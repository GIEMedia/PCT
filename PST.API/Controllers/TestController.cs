using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Core;
using PST.Api.Core.OAuth;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;
using WebGrease.Css.Extensions;

namespace PST.Api.Controllers
{
    [RoutePrefix("api/test")]
    public class TestController : ApiControllerBase
    {
        private readonly IEntityRepository _entityRepository;
        private readonly ICourseService _courseService;

        public TestController(Lazy<UserManager<ApplicationUser>> userManager, IEntityRepository entityRepository, ICourseService courseService)
            : base(userManager)
        {
            _entityRepository = entityRepository;
            _courseService = courseService;
        }

        /// <summary>
        /// Get test for specific course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{courseID}")]
        [Authorize]
        public test<question> GetTest(Guid courseID)
        {
            return GetTest<question>(courseID);
        }

        /// <summary>
        /// Get test in preview mode for specific course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{courseID}/preview")]
        [AdminOrTokenAuthorize]
        public test<question_with_answers> GetTestPreview(Guid courseID)
        {
            return GetTest<question_with_answers>(courseID, null);
        }

        private test<TQuestion> GetTest<TQuestion>(Guid courseID, CourseStatus? status = CourseStatus.Active)
            where TQuestion : question_base, new()
        {
            var test = _courseService.GetTest(courseID, CurrentUserID, status);
            if (test == null)
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            return test.ToModel<TQuestion>();
        }

        /// <summary>
        /// Answer test question
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="answers">Answers to all of the questions in a test</param>
        /// <returns></returns>
        [HttpPut]
        [Route("answer/{courseID}")]
        [Authorize]
        public answer_result[] AnswerQuestions(Guid courseID, answer[] answers)
        {
            var results = _courseService.AnswerTestQuestion(CurrentUserID, courseID, answers);
            if (results == null)
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            return results.ToArray();
        }

        /// <summary>
        /// Send licensure upon passing course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="licensures">Collection of kicensures to send info to</param>
        /// <returns></returns>
        [HttpPut]
        [Route("send/licensure/{courseID}")]
        [Authorize]
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
        [Authorize]
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