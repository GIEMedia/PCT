using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Controllers;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models.Management;
using PST.Services;

namespace PST.Api.Areas.Management.Controllers
{
    //[Authorize]
    [RoutePrefix("api/manage/course/question")]
    public class ManageQuestionController : ApiControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IEntityRepository _entityRepository;
        private readonly Lazy<IUploadService> _uploadService;

        public ManageQuestionController(ICourseService courseService, IEntityRepository entityRepository, Lazy<IUploadService> uploadService)
        {
            _courseService = courseService;
            _entityRepository = entityRepository;
            _uploadService = uploadService;
        }

        /// <summary>
        /// Get list of questions for section or test
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section (null if test)</param>
        /// <returns></returns>
        [HttpGet]
        [Route("list/{courseID}/{sectionID?}")]
        public m_question[] GetQuestions(Guid courseID, Guid? sectionID = null)
        {
            var course = _courseService.GetCourse(courseID, status: null);
            if(course == null)
                throw new NullReferenceException("Course not found");

            if (sectionID.HasValue)
            {
                var section = course.Sections.FirstOrDefault(s => s.ID == sectionID);
                if (section == null)
                    throw new NullReferenceException("Section not found");

                return section.Questions.Select(q => q.ToManagementModel()).ToArray();
            }
            else
            {
                return course.Test == null
                    ? new m_question[0]
                    : course.Test.Questions.Select(q => q.ToManagementModel()).ToArray();
            }
        }
        
        /*
        /// <summary>
        /// Delete a question from section or test
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section (null if test)</param>
        /// <param name="questionID"></param>
        [HttpDelete]
        [Route("{courseID}/{questionID}/{sectionID?}")]
        public void DeleteQuestion(Guid courseID, Guid? sectionID, Guid questionID)
        {
            Course course;
            var questioned = GetQuestioned(courseID, sectionID, out course);

            var question = questioned.Questions.FirstOrDefault(q => q.ID == questionID);
            if (question == null)
                throw new NullReferenceException("Question not found");

            questioned.Questions.Remove(question);

            _entityRepository.Save(course);
        }
        */

        /// <summary>
        /// Upsert questions for a section or test
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <param name="sectionID">ID of section (null if test)</param>
        /// <param name="questions">Collection of questions to upsert. If new, leave ID blank. If existing, properties will be merged into existing entity.</param>
        /// <returns></returns>
        [HttpPut]
        [Route("{courseID}/{sectionID?}")]
        public m_question[] UpsertQuestions(Guid courseID, m_question[] questions, Guid? sectionID = null)
        {
            Course course;
            var questioned = GetQuestioned(courseID, sectionID, out course);

            // Remove any options that existed but no longer in the model
            questioned.Questions.Where(o => !questions.Select(x => x.id).Contains(o.ID))
                .ToList()
                .Apply(o => questioned.Questions.Remove(o));

            for (var i = 0; i < questions.Length; i++)
            {
                var q = questions[i];
                var found = false;
                Question question = null;
                if (!q.id.IsNullOrEmpty())
                {
                    question = questioned.Questions.FindById(q.id);
                    found = true;
                }
                if (question == null)
                    question =
                        new EnumAttributedFactoryFactory<Question, QuestionTypeAttribute, QuestionType>().Create(
                            q.question_type);

                question.FromManagementModel(q, i);

                if (!found)
                    questioned.Questions.Add(question);
            }

            _entityRepository.Save(course);

            return questioned.Questions.OrderBy(q => q.SortOrder).Select(q => q.ToManagementModel()).ToArray();
        }

        /// <summary>
        /// Uploads an image to then be used in either a question or option
        /// </summary>
        /// <param name="width">Optionally specifies the resize width of the image</param>
        /// <param name="height">Optionally specifies the resize height of the image</param>
        /// <param name="forceCanvas">Optionally indicates if the canvas should be resized to the width/height specified regardless of proportinal resizing (default = false)</param>
        /// <returns>Returns a string containing the url of the uploaded image</returns>
        [HttpPost]
        [Route("image")]
        public async Task<string> UploadImage(int? width = null, int? height = null, bool forceCanvas = false)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            return await _uploadService.Value.UploadImage(Request.Content, width, height, forceCanvas);
        }

        private Questioned GetQuestioned(Guid courseID, Guid? sectionID, out Course course)
        {
            course = _courseService.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");

            if (sectionID.HasValue)
            {
                var section = course.Sections.FirstOrDefault(s => s.ID == sectionID);
                if (section == null)
                    throw new NullReferenceException("Section not found");

                return section;
            }
            else
            {
                if (course.Test == null)
                    throw new NullReferenceException("Course does not contain test");
                return course.Test;
            }

        }
    }
}