using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;
using WebGrease.Css.Extensions;

namespace PST.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/test")]
    public class TestController : ApiControllerBase
    {
        private readonly ICourseService _courseService;

        public TestController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        /// <summary>
        /// Get test for specific course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{courseID}")]
        public test GetTest(Guid courseID)
        {
            return _courseService.GetTest(courseID, CurrentUserID);
        }

        /// <summary>
        /// Answer test question
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="questionID">ID of question</param>
        /// <param name="selectedOptionIDs">IDs of all secected options</param>
        /// <returns></returns>
        [HttpPut]
        [Route("answer/{courseID}/{questionID}")]
        public answer_result AnswerQuestion(Guid courseID, Guid questionID, Guid[] selectedOptionIDs)
        {
            string correctResponseHeading, correctResponseText;
            var correct = _courseService.AnswerTestQuestion(CurrentUserID, courseID, questionID, selectedOptionIDs, out correctResponseHeading, out correctResponseText);
            return new answer_result(correct, correctResponseHeading, correctResponseText);
        }

        /// <summary>
        /// Send licensure upon passing course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="licensures">Collection of kicensures to send info to</param>
        /// <returns></returns>
        [HttpPut]
        [Route("send/licensure/{courseID}")]
        public bool SendLicensure(Guid courseID, state_licensure[] licensures)
        {
            //TODO: Verify that they have passed this course

            //TODO: Refactor to account service
            var account = _entityRepository.GetByID<Account>(CurrentUserID);
            account.StateLicensures.Clear();
            licensures.ForEach(l => account.StateLicensures.Add(l));

            _entityRepository.Save(account);

            //TODO: Email state

            return true;
        }

        /// <summary>
        /// Send certificate upon passing course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="managers">Collection of managers to send certificate to</param>
        /// <returns></returns>
        [HttpPut]
        [Route("send/certificate/{courseID}")]
        public bool SendCertificate(Guid courseID, manager[] managers)
        {
            //TODO: Verify that they have passed this course

            //TODO: Refactor to account service
            var account = _entityRepository.GetByID<Account>(CurrentUserID);
            account.Managers.Clear();
            managers.ForEach(m => account.Managers.Add(m));

            _entityRepository.Save(account);

            //TODO: Email certificate

            return true;
        }
    }
}