using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using PST.Api.Areas.Management.Models;
using PST.Api.Controllers;

namespace PST.Api.Areas.Management.Controllers
{
    [Authorize]
    [RoutePrefix("api/manage/course/section")]
    public class ManageSectionController : ApiControllerBase
    {
        /// <summary>
        /// Get list of sections of a course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("list/{courseID}")]
        public m_section_overview[] GetSections(Guid courseID)
        {
            return new m_section_overview[0];
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
            return section;
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
            return new HttpResponseMessage();
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

        }
    }
}