using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
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

        [HttpPut]
        [Route("test")]
        public void Insert()
        {
            var subcategory = new SubCategory {Title = "Sub Cat"};
            _entityRepository.Save(subcategory);

            var category = new MainCategory {Title = "Main Cat", SubCategories = new List<SubCategory>() {subcategory}};
            _entityRepository.Save(category);

            var course = new Course
            {
                Title = "Test Course 1",
                DateCreatedUtc = DateTime.UtcNow,
                StateCEUs = new List<StateCEU>
                {
                    new StateCEU {StateAbbr = "OH", CategoryCode = "a", Hours = 1}
                },
                Category = subcategory,
                Status = CourseStatus.Active
            };
            _entityRepository.Save(course);

            var courseProgress = new CourseProgress
            {
                Course = course,
                LastActivityUtc = DateTime.UtcNow,
                TestProgress = null,
                Sections = null
            };
            _entityRepository.Save(courseProgress);
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
