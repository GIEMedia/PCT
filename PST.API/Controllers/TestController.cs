using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;

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

        [HttpGet]
        [Route]
        public test Get(Guid courseID)
        {
            return _courseService.GetTest(courseID, CurrentUserID);
        }

        [HttpPut]
        [Route]
        public answer_result AnswerQuestion(Guid courseID, Guid questionID, Guid[] selectedOptionIDs)
        {
            string correctResponseHeading, correctResponseText;
            var correct = _courseService.AnswerTestQuestion(CurrentUserID, courseID, questionID, selectedOptionIDs, out correctResponseHeading, out correctResponseText);
            return new answer_result(correct, correctResponseHeading, correctResponseText);
        }
    }
}