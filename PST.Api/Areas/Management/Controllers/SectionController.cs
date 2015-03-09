using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Hosting;
using System.Web.Http;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Controllers;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models.Management;

namespace PST.Api.Areas.Management.Controllers
{
    //[Authorize]
    [RoutePrefix("api/manage/course/section")]
    public class ManageSectionController : ApiControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IEntityRepository _entityRepository;
        private readonly Lazy<IUploadService> _uploadService;

        public ManageSectionController(ICourseService courseService, IEntityRepository entityRepository, Lazy<IUploadService> uploadService)
        {
            _courseService = courseService;
            _entityRepository = entityRepository;
            _uploadService = uploadService;
        }

        /// <summary>
        /// Get list of sections of a course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("list/{courseID}")]
        public m_section_overview[] GetSections(Guid courseID)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if(course == null)
                throw new NullReferenceException("Course not found");

            return course.Sections.ToList().Select(s => (m_section_overview) s).ToArray();
        }

        /// <summary>
        /// Rename section of a course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section</param>
        /// <param name="title">New title for section</param>
        [HttpPut]
        [Route("rename/{courseID}/{sectionID}")]
        public void Rename(Guid courseID, Guid sectionID, [FromBody]string title)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");

            var section =  course.Sections.FindById(sectionID);
            if (section == null)
                throw new NullReferenceException("Section not found");

            section.Title = title;

            _entityRepository.Save(section);
        }

        /// <summary>
        /// Upsert section
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="section">Section to be upserted. If new, leave ID blank. If existing, properties will be merged into existing entity.</param>
        /// <returns></returns>
        [HttpPut]
        [Route("{courseID}")]
        public m_section_overview UpsertSection(Guid courseID, m_section_overview section)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");

            Section s = null;
            if (!section.id.IsNullOrEmpty())
                s = course.Sections.FindById(section.id);
            if (s == null)
            {
                s = new Section {SortOrder = course.Sections.Count};
                course.Sections.Add(s);
            }

            s.Title = section.title;

            _entityRepository.Save(course);

            return s;
        }

        /// <summary>
        /// Update sort order of sections of a course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionIDs">Collection of section IDs, sorted in new order</param>
        [HttpPut]
        [Route("sort/{courseID}")]
        public void UpdateSortOrder(Guid courseID, Guid[] sectionIDs)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");

            for (var i = 0; i < sectionIDs.Length; i++)
            {
                var id = sectionIDs[i];
                var section = course.Sections.FindById(id);
                if (section == null)
                    throw new NullReferenceException("Section not found: " + id);
                section.SortOrder = i;
            }

            _entityRepository.Save(course);
        }

        /// <summary>
        /// Delete section from course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section</param>
        [HttpDelete]
        [Route("{courseID}/{sectionID}")]
        public void DeleteSection(Guid courseID, Guid sectionID)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");

            var section = course.Sections.FindById(sectionID);
            if (section == null)
                throw new NullReferenceException("Section not found");

            course.Sections.Remove(section);

            _entityRepository.Save(course);
        }

        /// <summary>
        /// Upload document to section of a course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section</param>
        /// <returns>The "returnData" property of the response will contain the url of the uploaded pdf</returns>
        [HttpPost]
        [Route("document/{courseID}/{sectionID}")]
        public async Task<HttpResponseMessage> UploadDocument(Guid courseID, Guid sectionID)
        {
            if (!Request.Content.IsMimeMultipartContent())
                Request.CreateResponse(HttpStatusCode.UnsupportedMediaType);

            var doc = await _uploadService.Value.UploadDocument(Request.Content);

            DeleteDocument(courseID, sectionID);

            var baseDocUrl = string.Concat(BaseUrl, "Documents/", doc.Item1);

            var section = DeleteDocumentFromSection(courseID, sectionID);
            section.Document = new Document
            {
                PageCount = doc.Item2,
                PageImageUrlFormat = baseDocUrl + "_{0}.jpg",
                PDFUrl = baseDocUrl + ".pdf"
            };
            _entityRepository.Save(section);

            return Request.CreateResponse(HttpStatusCode.OK, new {returnData = baseDocUrl + ".pdf"});
        }

        /// <summary>
        /// Delete document from a section of a course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section</param>
        [HttpDelete]
        [Route("document/{courseID}/{sectionID}")]
        public void DeleteDocument(Guid courseID, Guid sectionID)
        {
            DeleteDocumentFromSection(courseID, sectionID);
        }

        private static readonly string DocumentFolder = HostingEnvironment.MapPath("~/Content/Documents/");
        private Section DeleteDocumentFromSection(Guid courseID, Guid sectionID)
        {

            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");

            var section = course.Sections.FindById(sectionID);
            if (section == null)
                throw new NullReferenceException("Section not found");

            try
            {
                if (section.Document != null && section.Document.PDFUrl.Length > 0)
                {
                    var pdfFile = section.Document.PDFUrl.Split('/').Last();
                    TryDelete(DocumentFolder + pdfFile);

                    var jpgFileFormat = pdfFile.ToLower().Replace(".pdf", "_{0}.jpg");
                    for (var p = 0; p < section.Document.PageCount; p++)
                        TryDelete(DocumentFolder + string.Format(jpgFileFormat, p));
                }
            }
            catch
            {
            }

            section.Document = null;

            _entityRepository.Save(section);

            return section;
        }

        private void TryDelete(string path)
        {
            try
            {
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch
            {
            }
        }
    }
}