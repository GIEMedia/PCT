﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Core.OAuth;
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
        public test GetTest(Guid courseID)
        {
            var test = _courseService.GetTest(courseID, CurrentUserID);
            if (test == null)
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            return test;
        }

        /// <summary>
        /// Answer test question
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="answers">Answers to all of the questions in a test</param>
        /// <returns></returns>
        [HttpPut]
        [Route("answer/{courseID}")]
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