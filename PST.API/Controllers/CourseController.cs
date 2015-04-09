using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using Antlr.Runtime.Misc;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Security;
using PST.Api.Core;
using PST.Api.Core.OAuth;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;

namespace PST.Api.Controllers
{
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
        [Authorize]
        public course<question> GetCourse(Guid courseID)
        {
            List<Course> prereqCourses;
            var course = _courseService.GetCourse(courseID, CurrentUserID, out prereqCourses);
            if (course == null && prereqCourses == null)
                return null;

            return course ??
                   new course<question> { prerequisite_courses = prereqCourses.Select(c => (course_overview)c).ToArray() };
        }

        /// <summary>
        /// Get specific course in preview mode
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{courseID}/preview")]
        [AdminOrTokenAuthorization]
        public course<question_with_answers> GetCoursePreview(Guid courseID)
        {
            List<Course> prereqCourses;
            var course = _courseService.GetCourse(courseID, CurrentUserID, out prereqCourses, null);
            return course;
        }

        /// <summary>
        /// Get all categorized courses
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("list")]
        [Authorize]
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
                    courses = courses.Where(c => c.Category.ID == s.ID).Select(c => (course_overview) c).ToArray()
                }).Where(c => c.courses.Any()).ToArray()
            }).Where(c => c.categories.Any(s => s.courses.Any())).ToArray();
        }

        /// <summary>
        /// Get new courses
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("new")]
        [Authorize]
        public course_overview[] NewCourses()
        {
            return (from c in _courseService.NewCourses(accountID: CurrentUserID)
                select (course_overview) c).ToArray();
        }

        /// <summary>
        /// Answer section question
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="answer">Answer to a course question</param>
        /// <returns></returns>
        [HttpPut]
        [Route("answer/{courseID}")]
        [Authorize]
        public answer_result AnswerQuestion(Guid courseID, answer answer)
        {
            string correctResponseHeading, correctResponseText;
            var correct = _courseService.AnswerCourseQuestion(CurrentUserID, courseID, answer.question_id,
                answer.selected_option_ids, out correctResponseHeading, out correctResponseText);
            return new answer_result(answer.question_id, correct, correctResponseHeading, correctResponseText);
        }
    }
}
