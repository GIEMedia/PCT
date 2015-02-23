using System;
using System.Web.Http;
using PST.Api.Areas.Management.Models;
using PST.Api.Controllers;
using PST.Declarations.Interfaces;

namespace PST.Api.Areas.Management.Controllers
{
    [Authorize]
    [RoutePrefix("api/manage/course")]
    public class ManageCourseController : ApiControllerBase
    {
        private readonly ICourseService _courseService;

        public ManageCourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        /// <summary>
        /// Get list of courses
        /// </summary>
        /// <param name="activeOnly">Indicates if all or only active courses should be returned</param>
        /// <returns></returns>
        [HttpGet]
        [Route("list")]
        public m_course_overview[] GetCourses(bool activeOnly = false)
        {
            //var courses = _courseService.GetCourses().Select(c => new m_course
            //{
            //    id = c.ID,
            //    title = c.Title,
            //    date_created = c.DateCreatedUtc.ToLocalTime(),
            //    status = c.Status
            //}).ToArray();

            return new m_course_overview[0];
        }

        /// <summary>
        /// Delete course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        [HttpDelete]
        [Route("{courseID}")]
        public void DeleteCourse(Guid courseID)
        {
            
        }

        /// <summary>
        /// Get specific course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route]
        public m_course GetCourse(Guid courseID)
        {
            return new m_course();
        }

        /// <summary>
        /// Get available categories
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("categories")]
        public m_main_category[] GetCategories()
        {
            return new m_main_category[0];
        }

        /// <summary>
        /// Add category or sub-category
        /// </summary>
        /// <param name="topCategoryID">ID of top category (if sub-category)</param>
        /// <param name="title">Title of category to add</param>
        /// <returns></returns>
        [HttpPut]
        [Route("category/{topCategoryID?}")]
        public m_category UpsertCategory(Guid? topCategoryID, [FromBody]string title)
        {
            return new m_category();
        }

        /// <summary>
        /// Upsert course
        /// </summary>
        /// <param name="course">Course to be upserted. If new, leave ID blank. If existing, properties will be merged into existing entity.</param>
        /// <returns></returns>
        [HttpPut]
        [Route]
        public m_course UpsertCourse(m_course course)
        {
            return course;
        }
    }
}
