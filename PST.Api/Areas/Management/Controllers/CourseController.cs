using System;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.Interfaces;
using PST.Api.Controllers;
using PST.Api.Core;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models.Management;
using WebGrease.Css.Extensions;

namespace PST.Api.Areas.Management.Controllers
{
    [AdminAuthorize]
    [RoutePrefix("api/manage/course")]
    public class ManageCourseController : ApiControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IEntityRepository _entityRepository;
        private readonly IEmailGenerationService _emailGenerationService;
        private readonly IMailService _mailService;

        private static readonly string CourseReviewEmailFrom = ConfigurationManager.AppSettings["CourseReviewEmailFrom"];

        public ManageCourseController(ICourseService courseService, IEntityRepository entityRepository, IEmailGenerationService emailGenerationService, IMailService mailService)
        {
            _courseService = courseService;
            _entityRepository = entityRepository;
            _emailGenerationService = emailGenerationService;
            _mailService = mailService;
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
            var progresses = _courseService.GetCourseProgressStats();

            return
                _courseService.GetCourses(activeOnly ? CourseStatus.Active : (CourseStatus?) null)
                    .Select(c => (m_course_overview) c)
                    .ApplyCourseProgressStats(progresses)
                    .ToArray();
        }

        /// <summary>
        /// Delete course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        [HttpDelete]
        [Route("{courseID}")]
        public void DeleteCourse(Guid courseID)
        {
            _courseService.DeleteCourse(courseID);
        }

        /// <summary>
        /// Get specific course
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{courseID}")]
        public m_course GetCourse(Guid courseID)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found.");
            return course;
        }

        /// <summary>
        /// Get available categories
        /// </summary>
        /// <param name="courseCount">Indicates if course counts should be added the resulting category list.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("categories")]
        public m_main_category[] GetCategories(bool courseCount = false)
        {
            var cats = _entityRepository.Queryable<MainCategory>()
                .ToList()
                .Select(c => (m_main_category) c)
                .ToArray();

            if(!courseCount) return cats;

            var courses = _courseService.GetCourses(null);
            cats.ForEach(c => c.sub_categories.ForEach(s => s.course_count = courses.Count(x => x.Category.ID == s.id)));

            return cats.ToArray();
        }

        /// <summary>
        /// Add category or sub-category
        /// </summary>
        /// <param name="categoryID">ID of category to upsert</param>
        /// <param name="parentCategoryID">ID of parent category (if sub-category)</param>
        /// <param name="title">Title of category to add</param>
        /// <returns></returns>
        [HttpPut]
        [Route("category")]
        public m_category UpsertCategory([FromBody]string title, [FromUri]Guid? categoryID = null, [FromUri]Guid? parentCategoryID = null)
        {
            if (parentCategoryID.HasValue)
            {
                var parentCategory = _entityRepository.GetByID<MainCategory>(parentCategoryID.Value);
                if (parentCategory == null)
                    throw new NullReferenceException("Specified parent category not found.");

                var subCategory = categoryID.HasValue
                    ? _entityRepository.GetByID<SubCategory>(categoryID.Value)
                    : new SubCategory();

                subCategory.ParentCategory = parentCategory;
                subCategory.Title = title;

                _entityRepository.Save(subCategory);

                return subCategory;
            }
            else
            {
                var category = categoryID.HasValue
                   ? _entityRepository.GetByID<MainCategory>(categoryID.Value)
                   : new MainCategory();

                category.Title = title;

                _entityRepository.Save(category);

                return category;
            }
        }

        /// <summary>
        /// Delete a category or sub category. The category must not be in use.
        /// </summary>
        /// <param name="categoryID">ID of category to delete</param>
        /// <param name="parentCategoryID">ID of parent category (if sub-category).</param>
        [HttpDelete]
        [Route("category")]
        public void DeleteCategory([FromUri]Guid categoryID, [FromUri]Guid? parentCategoryID = null)
        {
            if (parentCategoryID.HasValue)
            {
                var parentCategory = _entityRepository.GetByID<MainCategory>(parentCategoryID.Value);
                if (parentCategory == null)
                    throw new NullReferenceException("Specified parent category not found.");

                var subCategory = parentCategory.SubCategories.FindById(categoryID);

                if (subCategory == null)
                    throw new NullReferenceException("Specified category not found.");

                if(_entityRepository.Queryable<Course>().Any(c=>c.Category != null && c.Category.ID == subCategory.ID))
                    throw new ArgumentException("There are still courses that use this category. Delete failed.");

                parentCategory.SubCategories.Remove(subCategory);

                _entityRepository.Delete(subCategory);
                _entityRepository.Save(parentCategory);
            }
            else
            {
                var category = _entityRepository.GetByID<MainCategory>(categoryID);

                if (category == null)
                    throw new NullReferenceException("Specified category not found.");

                var subCategories = category.SubCategories.Select(c => c.ID).ToArray();
                if (_entityRepository.Queryable<Course>().Any(c => c.Category != null && subCategories.Contains(c.Category.ID)))
                    throw new ArgumentException("There are still courses that use this category. Delete failed.");

                _entityRepository.Delete(category);
            }
        }

        /// <summary>
        /// Upsert course
        /// </summary>
        /// <param name="course">Course to be upserted. Status cannot be updated using this call. If new, leave ID blank. If existing, properties will be merged into existing entity.</param>
        /// <returns></returns>
        [HttpPut]
        [Route]
        public m_course UpsertCourse(m_course course)
        {
            Course c = null;
            if (!course.id.IsNullOrEmpty())
            {
                c = _courseService.GetCourse(course.id, status: null);
                if (c == null)
                    throw new NullReferenceException("Course not found to update.");
            }
            if (c == null)
                c = new Course {DateCreatedUtc = DateTime.UtcNow, Status = CourseStatus.Draft};

            c.Title = course.title;

            c.Category = course.sub_category.HasValue ? _entityRepository.GetByID<SubCategory>(course.sub_category.Value) : null;
            
            c.Manufacturer = course.manufacturer.HasValue ? _entityRepository.GetByID<Manufacturer>(course.manufacturer.Value) : null;

            c.PrerequisiteCourses.Clear();
            if (course.prerequisite_course.HasValue)
            {
                var prereq = _courseService.GetCourse(course.prerequisite_course.Value, status: null);
                if(prereq != null)
                c.PrerequisiteCourses.Add(prereq);
            }
            
            c.StateCEUs.Clear();
            course.state_ceus.ForEach(
                s =>
                    c.StateCEUs.Add(new StateCEU
                    {
                        StateAbbr = s.state,
                        CategoryCode = s.category_code,
                        Hours = s.hours
                    }));

            _entityRepository.Save(c);

            return c;
        }

        /// <summary>
        /// Validate course, sections, and test
        /// </summary>
        /// <param name="courseID"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("validate/{courseID}")]
        public m_validation_error[] Validate(Guid courseID)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found to validate.");

            return course.Validate().ToArray();
        }

        /// <summary>
        /// Update the status of a course.
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="courseStatus">Status to change course to. If setting it to Active, validation will run. If any errors found, the save will not happen. If only warnings found, save will happen but warnings will still return.</param>
        /// <returns></returns>
        [HttpPut]
        [Route("status/{courseID}/{courseStatus}")]
        public m_validation_error[] ValidateAndUpdateStatus(Guid courseID, CourseStatus courseStatus)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found to update.");

            m_validation_error[] errors = null;
            if (courseStatus == CourseStatus.Active &&
                (errors = course.Validate().ToArray()).Any(e => e.severity == m_validation_error.Severity.Error))
                return errors;

            course.Status = courseStatus;
            _entityRepository.Save(course);

            return errors ?? new m_validation_error[0];
        }

        /// <summary>
        /// Send course to reviewer
        /// </summary>
        /// <param name="reviewer">Details about who will be reviewing this course</param>
        [HttpPut]
        [Route("review/{courseID}")]
        public void SendCourseToReviewer(Guid courseID, m_course_reviewer reviewer)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if (course.Status == CourseStatus.Draft)
            {
                course.Status = CourseStatus.InReview;
                _entityRepository.Save(course);
            }

            var htmlBody = _emailGenerationService.ReviewCourse(reviewer.name, reviewer.email, courseID, course.DisplayTitle);
            _mailService.SendEmail(reviewer.email, CourseReviewEmailFrom, "PCT Course Review: " + course.DisplayTitle,
                htmlBody: htmlBody);
        }
    }
}
