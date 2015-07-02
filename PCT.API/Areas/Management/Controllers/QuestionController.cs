using System;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Services;
using PCT.Api.Controllers;
using PCT.Api.Core;
using PCT.Declarations;
using PCT.Declarations.Entities;
using PCT.Declarations.Interfaces;
using PCT.Declarations.Models.Management;
using PCT.Services;

namespace PCT.Api.Areas.Management.Controllers
{
    [AdminAuthorize]
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

            questions = questions.Where(q => !(q.question_text ?? "").Trim().IsNullOrEmpty()).ToArray();
            
            var enumFactory = new EnumAttributedFactoryFactory<Question, QuestionTypeAttribute, QuestionType>();

            // Update questions where the question type has changed & reset cache
            var typesChanged = (from qE in questioned.Questions
                join qM in questions on qE.ID equals qM.id
                where qM.question_type != qE.QuestionType
                select new {Question = qE, NewQuestionType = qM.question_type}).ToList();
            if (typesChanged.Any())
            {
                foreach (var q in typesChanged)
                    ChangeQuestionType(q.Question, enumFactory.GetType(q.NewQuestionType));
                
                NHibernateSessionManager.Instance.GetSession().Evict(questioned);
                NHibernateSessionManager.Instance.GetSession().Evict(course);
                questioned = GetQuestioned(courseID, sectionID, out course);
            }

            // Remove any questions that existed but no longer in the model
            questioned.Questions.Where(q => !questions.Select(x => x.id).Contains(q.ID))
                .ToList()
                .Apply(q => questioned.Questions.Remove(q));

            for (var i = 0; i < questions.Length; i++)
            {
                var q = questions[i];
                Question question = null;

                if (!q.id.IsNullOrEmpty())
                    question = questioned.Questions.FindById(q.id);

                if (question == null)
                {
                    question = enumFactory.Create(q.question_type);
                    if (!q.id.IsNullOrEmpty())
                        question.ID = q.id;
                    questioned.Questions.Add(question);
                }

                question.FromManagementModel(q, i);
            }

            _entityRepository.Save(course);

            return questioned.Questions.OrderBy(q => q.SortOrder).Select(q => q.ToManagementModel()).ToArray();
        }

        private void ChangeQuestionType<TOld>(TOld oldQuestion, Type newType)
            where TOld : Question
        {
            var update = string.Format("UPDATE [Question] SET Discriminator='{1}' WHERE QuestionID='{0}'",
                oldQuestion.ID, newType.Name);

            // update the discriminator
            using (var connection = new SqlConnection(MvcApplication.ConnectionString))
            {
                connection.Open();
                using (var command = new SqlCommand(update, connection))
                    command.ExecuteNonQuery();
            }

            NHibernateSessionManager.Instance.GetSession().Evict(oldQuestion);

            // get the "new" question
            _entityRepository.GetByID<Question>(oldQuestion.ID);
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

            return course.Test ?? (course.Test = new Test(course));
        }
    }
}