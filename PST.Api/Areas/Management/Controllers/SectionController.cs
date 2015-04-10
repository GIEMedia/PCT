using System;
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
using PST.Api.Core;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;
using PST.Declarations.Models.Management;

namespace PST.Api.Areas.Management.Controllers
{
    [AdminAuthorize]
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
            Course course;
            GetCourse(courseID, out course);

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
            Section section;
            GetSection(courseID, sectionID, out section);

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
            Course course;
            Section s = null;

            if (section.id.IsNullOrEmpty())
                GetCourse(courseID, out course);
            else
                GetCourseAndSection(courseID, section.id, out course, out s);

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
            Course course;
            GetCourse(courseID, out course);

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
            Course course;
            Section section;
            GetCourseAndSection(courseID, sectionID, out course, out section);

            course.Sections.Remove(section);

            _entityRepository.Save(course);
        }

        /// <summary>
        /// Upload document to section of a course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section</param>
        /// <param name="cascade">Indicates if other sections that share this same document should also be updated (optional: default = false).</param>
        /// <returns>A document object containing info about new document.</returns>
        [HttpPost]
        [Route("document/{courseID}/{sectionID}/{cascade?}")]
        public async Task<document> UploadDocument(Guid courseID, Guid sectionID, bool? cascade = false)
        {
            if (!Request.Content.IsMimeMultipartContent())
                Request.CreateResponse(HttpStatusCode.UnsupportedMediaType);

            var doc = await _uploadService.Value.UploadDocument(Request.Content);

            var baseDocUrl = string.Concat(MvcApplication.BaseUrl, "Content/Documents/", doc.Item1);

            Course course;
            Section section;
            GetCourseAndSection(courseID, sectionID, out course, out section);

            var cascadeTo = ((cascade ?? false) && section.Document != null)
                ? course.Sections.Where(
                    s => s.ID != sectionID && s.Document != null && s.Document.ID == section.Document.ID)
                : new Section[0];

            DeleteDocumentFromSection(courseID, sectionID, cascade ?? false, false);

            section.Document = new Document
            {
                PageCount = doc.Item2,
                PageImageUrlFormat = baseDocUrl + "_{0}.jpg",
                PDFUrl = baseDocUrl + ".pdf"
            };

            _entityRepository.Save(section);

            cascadeTo.Apply(s =>
            {
                s.Document = section.Document;
                _entityRepository.Save(s);
            });

            return section.Document;
        }

        /// <summary>
        /// Sets the document for the indicated section to the document of another section.
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section to update the document of</param>
        /// <param name="useDocFromSectionID">ID of section that the document will be taken from</param>
        /// <param name="cascade">Indicates if other sections that share the same document as the section specified by sectionID should also be updated (optional: default = false).</param>
        /// <returns>A document object containing info about new document.</returns>
        [HttpPut]
        [Route("document/{courseID}/{sectionID}/{useDocFromSectionID}/{cascade?}")]
        public document SetDocumentFromExistingSection(Guid courseID, Guid sectionID, Guid useDocFromSectionID, bool? cascade = false)
        {
            Course course;
            Section sectionTo, sectionFrom;
            GetCourseAndSection(courseID, sectionID, out course, out sectionTo);
            GetSection(course, useDocFromSectionID, out sectionFrom);

            if(sectionFrom.Document == null)
                throw new Exception("Section does not have document");

            if (sectionFrom.Document.ID == sectionTo.Document.ID)
                return sectionFrom.Document;

            var origDocID = sectionTo.Document.ID;

            DeleteDocumentFromSection(course, sectionTo, cascade ?? false, false);

            if (cascade ?? false)
            {
                course.Sections.Where(s => s.Document != null && s.Document.ID == origDocID).Apply(s =>
                {
                    s.Document = sectionFrom.Document;
                    _entityRepository.Save(s);
                });
            }
            else
            {
                sectionTo.Document = sectionFrom.Document;
                _entityRepository.Save(sectionTo);
            }

            return sectionFrom.Document;
        }

        /// <summary>
        /// Delete document from a section of a course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section</param>
        /// <param name="cascade">Indicates if other sections that share this same document should also be updated (optional: default = false).</param>
        [HttpDelete]
        [Route("document/{courseID}/{sectionID}/{cascade?}")]
        public void DeleteDocument(Guid courseID, Guid sectionID, bool? cascade = false)
        {
            DeleteDocumentFromSection(courseID, sectionID, cascade ?? false);
        }

        private static readonly string DocumentFolder = HostingEnvironment.MapPath("~/Content/Documents/");

        private void DeleteDocumentFromSection(Guid courseID, Guid sectionID, bool cascade, bool performSave = true)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");

            var section = course.Sections.FindById(sectionID);
            if (section == null)
                throw new NullReferenceException("Section not found");

            DeleteDocumentFromSection(course, section, cascade, performSave);
        }

        private void DeleteDocumentFromSection(Course course, Section section, bool cascade, bool performSave = true)
        {
            if (section.Document == null)
                return;

            var doc = section.Document;

            if (!cascade) // cascade already does the below on the section
            {
                section.Document = null;
                if (performSave) _entityRepository.Save(section);
            }

            // Don't delete the document if another section is still using it
            if (cascade || !course.Sections.Any(s => s.Document != null && s.Document.ID == doc.ID))
            {
                try
                {
                    if (doc.PDFUrl.Length > 0)
                    {
                        var pdfFile = doc.PDFUrl.Split('/').Last();
                        TryDelete(DocumentFolder + pdfFile);

                        var jpgFileFormat = pdfFile.ToLower().Replace(".pdf", "_{0}.jpg");
                        for (var p = 1; p <= Math.Max(1, doc.PageCount); p++)
                            TryDelete(DocumentFolder + string.Format(jpgFileFormat, p));
                    }
                }
                catch
                {
                }

                if (cascade)
                    course.Sections.Where(s => s.Document != null && s.Document.ID == doc.ID).Apply(s =>
                    {
                        s.Document = null;
                        if (performSave) _entityRepository.Save(s);
                    });

                _entityRepository.Delete(doc);
            }
        }

        private static void TryDelete(string path)
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

        private void GetCourse(Guid courseID, out Course course)
        {
            course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");
        }

        private void GetCourseAndSection(Guid courseID, Guid sectionID, out Course course, out Section section)
        {
            GetCourse(courseID, out course);
            GetSection(course, sectionID, out section);
        }

        private void GetSection(Guid courseID, Guid sectionID, out Section section)
        {
            Course course;
            GetCourseAndSection(courseID, sectionID, out course, out section);
        }

        private static void GetSection(Course course, Guid sectionID, out Section section)
        {
            section = course.Sections.FindById(sectionID);
            if (section == null)
                throw new NullReferenceException("Section not found");
        }
    }
}