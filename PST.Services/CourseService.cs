using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;
using Remotion.Linq.Utilities;
using WebGrease.Css.Extensions;

namespace PST.Services
{
    public class CourseService : ICourseService
    {
        private readonly IEntityRepository _entityRepository;

        public CourseService(IEntityRepository entityRepository)
        {
            _entityRepository = entityRepository;
        }

        public IEnumerable<CourseProgress> OpenCourses(Guid accountID)
        {
            return
                _entityRepository.GetByID<Account>(accountID)
                    .CourseProgress.Where(c => c.Course.Status == CourseStatus.Active &&
                                               c.Sections.Count(s => s.Passed) != c.TotalSections);
        }

        public IEnumerable<Course> NewCourses(int count = 5, Guid? accountID = null)
        {
            var openCourses = accountID.HasValue ? (from a in _entityRepository.Queryable<Account>()
                where a.ID == accountID
                from c in a.CourseProgress
                select c.Course.ID).ToArray() : new Guid[0];

            //TODO: Replace with cache lookup
            return (from c in _entityRepository.Queryable<Course>()
                where c.Status == CourseStatus.Active && !openCourses.Contains(c.ID)
                orderby c.DateCreatedUtc descending
                select c).Take(count);
        }
        
        public Course GetCourse(Guid courseID, Guid? accountID = null)
        {
            //TODO: Replace with cache lookup
            var course = _entityRepository.GetByID<Course>(courseID);

            if (course == null)
                throw new ArgumentOutOfRangeException("courseID", "Course not found.");

            if (course.Status != CourseStatus.Active)
                throw new ArgumentOutOfRangeException("courseID", "Course not active.");

            if (!accountID.HasValue)
                return course;

            //var passedCourses =
            //    (from c in courseProgress
            //        where c.TestProgress != null && c.TestProgress.Passed
            //        select c.Course.ID).ToArray();

            //if(!course.PrerequisiteCourses.All(c => passedCourses.Contains(c.ID)))
            //    return null;

            var completedSectionIDs = (from a in _entityRepository.Queryable<Account>()
                where a.ID == accountID.Value
                from c in a.CourseProgress
                where c.Course.ID == course.ID
                from s in c.Sections
                select s.Section.ID).ToArray();

            course.Sections.Where(s => completedSectionIDs.Contains(s.ID)).Apply(a => a.Complete = true);

            return course;
        }

        public IEnumerable<Course> GetCourses(CourseStatus? status)
        {
            var courses = _entityRepository.Queryable<Course>();
            if (status.HasValue)
                courses = courses.Where(c => c.Status == status);
            return courses;
        }

        public Test GetTest(Guid courseID, Guid? accountID = null)
        {
            var course = GetCourse(courseID, accountID);

            if (course == null || course.Status != CourseStatus.Active)
                return null;

            if (accountID.HasValue)
            {
                var courseProgress = (from a in _entityRepository.Queryable<Account>()
                    where a.ID == accountID.Value
                    from c in a.CourseProgress
                    where c.Course.ID == courseID
                    select c).FirstOrDefault();

                if (courseProgress == null || courseProgress.Sections.Any(s => !s.Passed))
                    return null;

                if(courseProgress.TestProgress != null)
                    (from a in courseProgress.TestProgress.CompletedQuestions
                        join n in course.Test.Questions
                            on a.Question.ID equals n.ID
                        select n).Apply(a => a.Answered = true);
            }

            return course.Test;
        }

        private bool IsCorrectAnswer(Guid accountID, Course course, Question question, Questioned questioned, IList<Guid> selectedOptionIDs, out string correctResponseHeading, out string correctResponseText)
        {
            var correctOptions =
                question.Options.Where(o => o.Correct).Select(o => o.ID).ToArray();

            var correct = correctOptions.Count() == selectedOptionIDs.Count() &&
                   new HashSet<Guid>(correctOptions).SetEquals(selectedOptionIDs);

            if (correct)
            {
                var courseProgress = (from a in _entityRepository.Queryable<Account>()
                                      where a.ID == accountID
                                      from c in a.CourseProgress
                                      where c.Course.ID == course.ID
                                      select c).FirstOrDefault();

                if (courseProgress == null)
                {
                    var account = _entityRepository.GetByID<Account>(accountID);
                    courseProgress = new CourseProgress { Course = course };
                    account.CourseProgress.Add(courseProgress);
                    _entityRepository.Save(account);
                }

                var questionedProgress = questioned.GetProgress(courseProgress) ??
                                         questioned.CreateAndAddProgress(courseProgress);

                var questionProgress =
                    questionedProgress.CompletedQuestions.FirstOrDefault(q => q.Question.ID == question.ID);

                if (questionProgress == null)
                {
                    questionProgress = new QuestionProgress();
                    questionedProgress.CompletedQuestions.Add(questionProgress);
                }

                courseProgress.LastActivityUtc =
                    questionedProgress.LastActivityUtc =
                        questionProgress.LastActivityUtc = DateTime.UtcNow;

                questionedProgress.TotalQuestions = course.Test.Questions.Count;

                _entityRepository.Save(courseProgress);
            }

            correctResponseHeading = question.CorrectResponseHeading;
            correctResponseText = question.CorrectResponseText;

            return correct;
        }

        public bool AnswerCourseQuestion(Guid accountID, Guid courseID, Guid questionID, IList<Guid> selectedOptionIDs, out string correctResponseHeading, out string correctResponseText)
        {
            if(!selectedOptionIDs.Any())
                throw new ArgumentOutOfRangeException("selectedOptionIDs", "No options selected.");

            var course = GetCourse(courseID);

            if (course == null)
                throw new ArgumentOutOfRangeException("courseID", "Course not found.");

            if (course.Status != CourseStatus.Active)
                throw new ArgumentOutOfRangeException("courseID", "Course not active.");

            var question = (from s in course.Sections
                from q in s.Questions
                where q.ID == questionID
                select new {Question = q, Section = s}).FirstOrDefault();

            if (question == null || question.Question == null)
                throw new ArgumentOutOfRangeException("questionID",
                    "Question not found in course (" + course.Title + ")");

            return IsCorrectAnswer(accountID, course, question.Question, question.Section, selectedOptionIDs,
                out correctResponseHeading, out correctResponseText);
        }

        public bool AnswerTestQuestion(Guid accountID, Guid courseID, Guid questionID, IList<Guid> selectedOptionIDs, out string correctResponseHeading, out string correctResponseText)
        {
            if (!selectedOptionIDs.Any())
                throw new ArgumentOutOfRangeException("selectedOptionIDs", "No options selected.");

            var course = GetCourse(courseID);

            if (course == null)
                throw new ArgumentOutOfRangeException("courseID", "Course not found.");

            if (course.Status != CourseStatus.Active)
                throw new ArgumentOutOfRangeException("courseID", "Course not active.");

            if(course.Test == null)
                throw new ArgumentOutOfRangeException("courseID", "Course does not have a test.");

            var question = (from q in course.Test.Questions
                            where q.ID == questionID
                            select q).FirstOrDefault();

            if (question == null || question == null)
                throw new ArgumentOutOfRangeException("questionID",
                    "Question not found in course (" + course.Title + ")");

            return IsCorrectAnswer(accountID, course, question, course.Test, selectedOptionIDs,
                out correctResponseHeading, out correctResponseText);
        }
    }
}
