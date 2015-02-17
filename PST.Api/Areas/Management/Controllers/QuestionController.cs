using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using PST.Api.Areas.Management.Models;
using PST.Api.Controllers;

namespace PST.Api.Areas.Management.Controllers
{
    [Authorize]
    [RoutePrefix("api/manage/course/question")]
    public class ManageQuestionController : ApiControllerBase
    {
        /// <summary>
        /// Get list of questions for section or test
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section (null if test)</param>
        /// <returns></returns>
        [HttpGet]
        [Route("list/{courseID}/{sectionID?}")]
        public m_question[] GetQuestions(Guid courseID, Guid? sectionID)
        {
            return new m_question[0];
        }

        /// <summary>
        /// Delete a question from section or test
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section (null if test)</param>
        /// <param name="questionID"></param>
        [HttpDelete]
        [Route("{courseID}/{questionID}/{sectionID?}")]
        public void DeleteQuestion(Guid courseID, Guid? sectionID, Guid questionID)
        {

        }

        /// <summary>
        /// Update sort order of questions on section or test
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section (null if test)</param>
        /// <param name="questionIDs">Collection of section IDs, sorted in new order</param>
        [HttpPut]
        [Route("sort/{courseID}/{sectionID?}")]
        public void UpdateSortOrder(Guid courseID, Guid? sectionID, Guid[] questionIDs)
        {

        }

        /// <summary>
        /// Upsert questions for a section or test
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section (null if test)</param>
        /// <param name="questions">Collection of questions to upsert. If new, leave ID blank. If existing, properties will be merged into existing entity.</param>
        /// <returns></returns>
        [HttpPut]
        [Route("{courseID}/{sectionID?}")]
        public m_question UpsertQuestions(Guid courseID, Guid? sectionID, m_question[] questions)
        {
            return new m_question();
        }

        /// <summary>
        /// Uploads an image to then be used in either a question or option
        /// </summary>
        /// <returns>The "returnData" property of the response will contain the url of the uploaded image</returns>
        [HttpPost]
        [Route("image/{courseID}/{sectionID}")]
        public async Task<HttpResponseMessage> UploadImage()
        {
            return new HttpResponseMessage();
        }
    }
}