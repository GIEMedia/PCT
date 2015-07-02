using System;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Prototype1.Services;
using PCT.Declarations;
using PCT.Declarations.Entities;
using PCT.Declarations.Models.Management;
using Prototype1.Foundation;
using PCT.Services;

namespace PCT.Tests.ManagementTests
{
    [TestClass]
    public class QuestionControllerTests : ApiTestControllerBase
    {
        protected override string UrlBase
        {
            get { return MvcApplicationBase.BaseUrl + "/api/manage/course/question/"; }
        }

        [TestMethod]
        public void CanGetSectionQuestions()
        {
            var course = GetCourses().FirstOrDefault();
            Assert.IsNotNull(course);

            var section = GetSections(course.id).FirstOrDefault();
            Assert.IsNotNull(section);

            var questions = GetQuestions(course.id, section.id);
            Assert.IsNotNull(questions);
            Assert.IsTrue(questions.Any());
            Assert.IsFalse(questions.Any(q=>q.question_text.IsNullOrEmpty()));
        }

        [TestMethod]
        public void CanGetTestQuestions()
        {
            var course = GetCourses().FirstOrDefault();
            Assert.IsNotNull(course);

            var questions = GetQuestions(course.id, null);
            Assert.IsNotNull(questions);
            Assert.IsTrue(questions.Any());
            Assert.IsFalse(questions.Any(q => q.question_text.IsNullOrEmpty()));
        }

        public m_course_overview[] GetCourses()
        {
            return new CourseControllerTests().GetCourses();
        }

        public m_section_overview[] GetSections(Guid courseID)
        {
            return new SectionControllerTests().GetSections(courseID);
        }

        public m_question[] GetQuestions(Guid courseID, Guid? sectionID)
        {
            return
                ExecuteGetRequest<m_question[]>("list/" + courseID + "/" +
                                                (sectionID.HasValue ? sectionID.Value.ToString() : ""));
        }

        public m_course UpsertCourse(m_course course)
        {
            return new CourseControllerTests().UpsertCourse(course);
        }

        public void DeleteCourse(m_course course)
        {
            new CourseControllerTests().DeleteCourse(course);
        }

        public m_main_category[] GetCategories()
        {
            return new CourseControllerTests().GetCategories(false);
        }

        public m_section_overview UpsertSection(Guid courseID, m_section_overview section)
        {
            return new SectionControllerTests().UpsertSection(courseID, section);
        }

        [TestMethod]
        public void CanUpsertAndDeleteSectionQuestions()
        {
            var category = GetCategories().FirstOrDefault(c => c.sub_categories.Any());
            Assert.IsNotNull(category);

            var newCourse = new m_course
            {
                title = "New Course",
                state_ceus = new[]
                {
                    new m_state_ceu {state = "OH", hours = 1, category_code = "abc123"},
                    new m_state_ceu {state = "CA", hours = 1.25m, category_code = "xyz987"}
                },
                category = category.id,
                sub_category = category.sub_categories.First().id
            };

            var course = UpsertCourse(newCourse);
            Assert.IsNotNull(course);

            var section = UpsertSection(course.id, new m_section_overview { title = "New Section" });
            Assert.IsNotNull(section);

            var questions = new[]
            {
                new m_question
                {
                    question_text = "Question text 1.",
                    question_type = QuestionType.Text,
                    response_heading = "Heading",
                    response_message = "Message",
                    tip = "Tip",
                    options = new[]
                    {
                        new m_option {correct = true, text = "Correct"},
                        new m_option {correct = false, text = "Wrong"}
                    }
                },
                new m_question
                {
                    question_text = "Question text 2.",
                    question_type = QuestionType.Text,
                    response_heading = "Heading",
                    response_message = "Message",
                    tip = "Tip",
                    options = new[]
                    {
                        new m_option {correct = true, text = "Correct"},
                        new m_option {correct = false, text = "Wrong"}
                    }
                }
            };

            var newQuestions = UpsertQuestions(course.id, section.id, questions);
            Assert.IsNotNull(newQuestions);
            Assert.IsTrue(newQuestions.Any());
            Assert.IsFalse(newQuestions.Any(q => q.id.IsNullOrEmpty()));
            Assert.AreEqual(questions[0].question_text, newQuestions[0].question_text);

            newQuestions[0].question_text = "Updated Question Text";

            var resortedQuestions = newQuestions.Reverse().ToArray();

            var updatedQuestion = UpsertQuestions(course.id, section.id, resortedQuestions);
            Assert.IsNotNull(updatedQuestion);
            Assert.AreEqual(newQuestions[0].id, updatedQuestion[1].id);
            Assert.AreEqual(newQuestions[0].question_text, updatedQuestion[1].question_text);

            var questions2 = GetQuestions(course.id, section.id);
            Assert.IsNotNull(questions2);
            Assert.IsTrue(questions.Length == questions2.Length);

            DeleteCourse(course);
        }

        public m_question[] UpsertQuestions(Guid courseID, Guid? sectionID, m_question[] question)
        {
            return ExecutePutRequest<m_question[]>(courseID + (sectionID.HasValue ? "/" + sectionID.Value : ""), question);
        }

        [TestMethod]
        public void CanCreateQuestionByType()
        {
            var question =
                new EnumAttributedFactoryFactory<Question, QuestionTypeAttribute, QuestionType>().Create(
                    QuestionType.Text);
            Assert.IsNotNull(question);
            Assert.IsInstanceOfType(question, typeof (TextQuestion));

            question =
                new EnumAttributedFactoryFactory<Question, QuestionTypeAttribute, QuestionType>().Create(
                    QuestionType.SingleImage);
            Assert.IsNotNull(question);
            Assert.IsInstanceOfType(question, typeof(SingleImageQuestion));

            question =
                new EnumAttributedFactoryFactory<Question, QuestionTypeAttribute, QuestionType>().Create(
                    QuestionType.Video);
            Assert.IsNotNull(question);
            Assert.IsInstanceOfType(question, typeof(VideoQuestion));
            
            question =
                new EnumAttributedFactoryFactory<Question, QuestionTypeAttribute, QuestionType>().Create(
                    QuestionType.MultiImage);
            Assert.IsNotNull(question);
            Assert.IsInstanceOfType(question, typeof(MultiImageQuestion));
        }
    }
}