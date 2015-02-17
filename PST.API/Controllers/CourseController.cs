using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Antlr.Runtime.Misc;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Core.OAuth;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;

namespace PST.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/course")]
    public class CourseController : ApiControllerBase
    {
        private readonly IEntityRepository _entityRepository;
        private readonly ICourseService _courseService;

        public CourseController(Lazy<UserManager<ApplicationUser>> userManager, IEntityRepository entityRepository, ICourseService courseService)
            : base(userManager)
        {
            _entityRepository = entityRepository;
            _courseService = courseService;
        }

        /// <summary>
        /// Get specific course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{courseID}")]
        public course GetCourse(Guid courseID)
        {
            return _courseService.GetCourse(courseID, CurrentUserID);
        }

        /// <summary>
        /// Get all categorized courses
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("list")]
        public main_category[] GetCourses()
        {
            var courses = _courseService.GetCourses(CourseStatus.Active);
            var categories = _entityRepository.Queryable<MainCategory>().ToList();

            return categories.Select(mainCategory => new main_category
            {
                title = mainCategory.Title,
                categories = mainCategory.SubCategories.Select(s => new sub_category
                {
                    title = s.Title,
                    courses = courses.Where(c => c.Category.ID == s.ID).Select(c => new course_overview
                    {
                        course_id = c.ID,
                        title = c.Title,
                        description =
                            c.StateCEUs.Any()
                                ? "CEUs Available: " +
                                  c.StateCEUs.OrderBy(x => x.StateAbbr)
                                      .Select(x => x.StateAbbr)
                                      .Aggregate((i, j) => i + "," + j)
                                : "",
                    }).ToArray()
                }).ToArray()
            }).ToArray();
        }

        /// <summary>
        /// Get new courses
        /// </summary>
        /// <returns></returns>
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
                        c.StateCEUs.Any()
                            ? "CEUs Available: " +
                              c.StateCEUs.OrderBy(x => x.StateAbbr)
                                  .Select(x => x.StateAbbr)
                                  .Aggregate((i, j) => i + "," + j)
                            : "",
                }).ToArray();
        }

        /// <summary>
        /// Answer section question
        /// </summary>
        /// <param name="courseID"></param>
        /// <param name="questionID"></param>
        /// <param name="selectedOptionIDs"></param>
        /// <returns></returns>
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
