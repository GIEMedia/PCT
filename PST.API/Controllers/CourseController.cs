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
    [RoutePrefix("api/course")]
    public class CourseController : ApiControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        [Route("{courseID}")]
        public course Get(Guid courseID)
        {
            return _courseService.GetCourse(courseID, CurrentUserID);
        }

        [HttpGet]
        [Route("new")]
        public course_overview[] NewCourses()
        {
            return (from c in _courseService.NewCourses(accountID: CurrentUserID)
                    select new course_overview
                    {
                        course_id = c.ID,
                        title = c.Title,
                        description =
                            "CEUs Available: " +
                            c.StateCEUs.OrderBy(x => x.StateAbbr).Select(x => x.StateAbbr).Aggregate((i, j) => i + "," + j),
                    }).ToArray();
        }

        [HttpPut]
        [Route("answer/{courseID}/{questionID}")]
        public answer_result AnswerQuestion(Guid courseID, Guid questionID, Guid[] selectedOptionIDs)
        {
            string correctResponseHeading, correctResponseText;
            var correct = _courseService.AnswerCourseQuestion(CurrentUserID, courseID, questionID, selectedOptionIDs, out correctResponseHeading, out correctResponseText);
            return new answer_result(correct, correctResponseHeading, correctResponseText);
        }
    }
}
