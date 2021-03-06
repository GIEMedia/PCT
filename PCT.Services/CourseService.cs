﻿using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.Logging;
using PCT.Declarations;
using PCT.Declarations.Entities;
using PCT.Declarations.Interfaces;
using PCT.Declarations.Models;

namespace PCT.Services
{
    public class CourseService : ICourseService
    {
        private readonly IEntityRepository _entityRepository;
        private readonly ICertificateService _certificateService;
        private readonly IExceptionLogger _exceptionLogger;

        public CourseService(IEntityRepository entityRepository, ICertificateService certificateService, IExceptionLogger exceptionLogger)
        {
            _entityRepository = entityRepository;
            _certificateService = certificateService;
            _exceptionLogger = exceptionLogger;
        }

        public course_overview[] OpenCourses(Guid accountID)
        {
            var courseProgress =
                _entityRepository.GetByID<Account>(accountID).CourseProgress
                    .GroupBy(c => c.Course).Select(g => g.OrderByDescending(c => c.Attempt).FirstOrDefault())
                    .Where(c => c.Course.Status == CourseStatus.Active &&
                                (c.Sections.Count(s => s.Passed) != c.TotalSections ||
                                 // havent completed all of the questions

                                 c.TestProgress == null || // havent started the test
                                 (
                                 //c.TestProgress.CompletedQuestions.Count(q => q.CorrectOnAttempt != null) !=
                                 // c.TestProgress.TotalQuestions &&

                                  // hasn't passed test
                                  c.Certificate == null &&

                                  // havent failed test
                                  c.TestProgress.TriesLeft > 0)));

            return courseProgress.Select(cp =>
            {
                var co = (course_overview) cp.Course;
                co.course_progress = Math.Max(.1M, cp.Sections.Count(s => s.Passed)/(decimal) cp.TotalSections);
                co.test_progress =
                    cp.TestProgress != null
                        ? cp.TestProgress.CompletedQuestions.Count(q => q.CorrectOnAttempt != null)/
                          (decimal) cp.TestProgress.TotalQuestions
                        : 0;
                co.last_activity = cp.LastActivityUtc;
                var states = cp.Course.StateCEUs.Select(s => s.StateAbbr).ToArray();
                co.ceu_eligible = cp.Course.StateCEUs.Any() &&
                                  (from a in _entityRepository.Queryable<Account>()
                                      where a.ID == accountID
                                      from s in a.StateLicensures
                                      where states.Contains(s.StateAbbr)
                                      select s).Any();

                return co;
            }).ToArray().OrderByDescending(c => c.last_activity)
                //TODO: Remove this hack - multiple results being returned for same course
                .GroupBy(g => g.course_id).Select(g => g.First()).ToArray();
        }

        public IEnumerable<Course> NewCourses(int count = 5, Guid? accountID = null)
        {
            var coursesWithProgress = accountID.HasValue
                ? (from a in _entityRepository.Queryable<Account>()
                    where a.ID == accountID
                    from c in a.CourseProgress
                    select c.Course.ID).ToArray()
                : new Guid[0];

            //TODO: Replace with cache lookup
            return (from c in _entityRepository.Queryable<Course>()
                where c.Status == CourseStatus.Active && !coursesWithProgress.Contains(c.ID)
                orderby c.DateCreatedUtc descending
                select c).Take(count);
        }

        public Course GetCourse(Guid courseID, Guid? accountID, out List<Course> prerequisiteCourses, CourseStatus? status = null, bool onlyPassed = false, bool isPreview = false)
        {
            prerequisiteCourses = null;

            //TODO: Replace with cache lookup
            var course = _entityRepository.GetByID<Course>(courseID);

            if (course == null)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not found.");

            if (status.HasValue && course.Status != status)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course status not " + status + ".");

            if (!accountID.HasValue)
                return course;

            var courseProgress = (from a in _entityRepository.Queryable<Account>()
                where a.ID == accountID
                from c in a.CourseProgress
                select c).ToList()
                .GroupBy(c => c.Course)
                .Select(g => g.OrderByDescending(x => x.Attempt).FirstOrDefault()).ToList();

            if (onlyPassed && !courseProgress.Any(c => c.Course.ID == courseID && c.Sections.All(s => s.Passed)))
                return null;

            var passedCourses =
                (from c in courseProgress
                 where c.TestProgress != null && c.TestProgress.Passed
                 select c.Course.ID).ToArray();

            if (!isPreview && !course.PrerequisiteCourses.All(c => passedCourses.Contains(c.ID)))
            {
                prerequisiteCourses = course.PrerequisiteCourses.ToList();
                return null;
            }

            return course;
        }

        public Course GetCourse(Guid courseID, Guid? accountID = null, CourseStatus? status = null, bool onlyPassed = false, bool isPreview = false)
        {
            List<Course> preqCourses;
            return GetCourse(courseID, accountID, out preqCourses, status, onlyPassed, isPreview);
        }

        public course_progress GetCourseProgress(Guid accountID, Guid courseID)
        {
            var course = GetCourse(courseID);

            if (course == null)
                return new course_progress();

            var courseProgress = (from a in _entityRepository.Queryable<Account>()
                where a.ID == accountID
                from c in a.CourseProgress
                where c.Course.ID == course.ID
                orderby c.Attempt descending 
                select c).FirstOrDefault();

            if (courseProgress == null) return null;

            var completedSections = (from s in courseProgress.Sections
                from q in s.CompletedQuestions
                group q by s into g
                select g).ToDictionary(g => g.Key.SectionID, g => g.ToList());

            return new course_progress
            {
                course_id = course.ID,
                complete = completedSections.Keys.Count == course.Sections.Count,
                need_verification = courseProgress.VerificationInitials.IsNullOrEmpty(),
                sections =
                    course.Sections.Where(s => completedSections.ContainsKey(s.ID)).Select(s =>
                    {
                        var completedQuestions = completedSections[s.ID].Select(q => q.QuestionID).ToArray();
                        return new section_progress
                        {
                            section_id = s.ID,
                            complete = s.Questions.Count == completedSections[s.ID].Count,
                            correctly_answered_questions =
                                s.Questions.Where(q => completedQuestions.Contains(q.ID))
                                    .Select(q => new question_progress
                                    {
                                        question_id = q.ID
                                    }).ToArray()
                        };
                    }).ToArray()
            };
        }

        public IList<CourseProgressStat> GetCourseProgressStats()
        {
            try
            {
                return NHibernateSessionManager.Instance.GetSession()
                    .GetNamedQuery("AggregateCourseProgresses")
                    .List<CourseProgressStat>();
            }
            catch(Exception ex)
            {
                _exceptionLogger.LogException(ex);
                return new List<CourseProgressStat>();
            }
        }

        public IEnumerable<Course> GetCourses(CourseStatus? status)
        {
            var courses = _entityRepository.Queryable<Course>();
            if (status.HasValue)
                courses = courses.Where(c => c.Status == status);
            return courses.OrderBy(c => c.DisplayTitle);
        }

        public Test GetTest(Guid courseID, Guid? accountID = null, CourseStatus? status = CourseStatus.Active, bool onlyPassed = true, bool isPreview = false)
        {
            var course = GetCourse(courseID, accountID, status, onlyPassed, isPreview);

            return course == null ? null : course.Test;
        }

        public test_progress GetTestProgress(Guid accountID, Guid courseID)
        {
            var test = GetTest(courseID, accountID);

            if (test == null)
                return null;

            var courseProgress = (from a in _entityRepository.Queryable<Account>()
                where a.ID == accountID
                from c in a.CourseProgress
                where c.Course.ID == courseID
                orderby c.Attempt descending
                select c).FirstOrDefault();

            if (courseProgress == null || courseProgress.Sections.Any(s => !s.Passed) ||
                courseProgress.Sections.Count != courseProgress.TotalSections)
                return null;

            var testProgress = courseProgress.TestProgress ??
                               (TestProgress) test.CreateAndAddProgress(courseProgress);


            var completedQuestions = testProgress.CompletedQuestions.Where(q => q.CorrectOnAttempt != null).Select(q => q.QuestionID).ToArray();
            return new test_progress
            {
                test_id = test.ID,
                course_id = courseID,
                max_tries = test.MaxTries,
                tries_left = testProgress.TriesLeft,
                correctly_answered_questions =
                    test.Questions.Where(q => completedQuestions.Contains(q.ID))
                        .Select(q => new question_progress
                        {
                            question_id = q.ID,
                            correct_response_heading = q.CorrectResponseHeading,
                            correct_response_text = q.CorrectResponseText,
                            correct_options = q.Options.Where(o => o.Correct).Select(o => o.ID).ToArray()
                        }).ToArray()
            };
        }

        private CourseProgress GetCourseProgress(Guid accountID, Course course)
        {
            var courseProgress = (from a in _entityRepository.Queryable<Account>()
                where a.ID == accountID
                from c in a.CourseProgress
                where c.Course.ID == course.ID
                orderby c.Attempt descending
                select c).FirstOrDefault();

            var attempt = 1;

            if (courseProgress?.TestProgress != null &&
                !courseProgress.TestProgress.Passed && courseProgress.TestProgress.TriesLeft == 0)
            {
                attempt = courseProgress.Attempt + 1;
                courseProgress = null;
            }

            if (courseProgress == null)
            {
                var account = _entityRepository.GetByID<Account>(accountID);
                courseProgress = new CourseProgress {Course = course, TotalSections = course.Sections.Count, Attempt = attempt };
                account.CourseProgress.Add(courseProgress);
                _entityRepository.Save(account);
            }

            return courseProgress;
        }

        private bool IsCorrectAnswer<TQuestionProgress>(Guid accountID, Course course, Question question, Questioned<TQuestionProgress> questioned,
            IList<Guid> selectedOptionIDs, out string correctResponseHeading, out string correctResponseText)
            where TQuestionProgress : QuestionProgressBase, new()
        {
            Guid[] correctOptions;
            return IsCorrectAnswer(accountID, course, question, questioned, selectedOptionIDs,
                out correctResponseHeading, out correctResponseText, out correctOptions);
        }

        private bool IsCorrectAnswer<TQuestionProgress>(Guid accountID, Course course, Question question,
            Questioned<TQuestionProgress> questioned,
            IList<Guid> selectedOptionIDs, out string correctResponseHeading, out string correctResponseText,
            out Guid[] correctOptions)
            where TQuestionProgress : QuestionProgressBase, new()
        {
            correctOptions =
                question.Options.Where(o => o.Correct).Select(o => o.ID).ToArray();

            var correct = correctOptions.Count() == selectedOptionIDs.Count() &&
                          new HashSet<Guid>(correctOptions).SetEquals(selectedOptionIDs);

            var courseProgress = GetCourseProgress(accountID, course);

            var questionedProgress = questioned.GetProgress(courseProgress) ??
                                     questioned.CreateAndAddProgress(courseProgress);

            var questionProgress =
                questionedProgress.CompletedQuestions.FirstOrDefault(q => q.QuestionID == question.ID);

            if (questionProgress == null)
            {
                questionProgress = new TQuestionProgress {QuestionID = question.ID};
                questionedProgress.CompletedQuestions.Add(questionProgress);
            }

            courseProgress.LastActivityUtc =
                questionedProgress.LastActivityUtc =
                    questionProgress.LastActivityUtc = DateTime.UtcNow;

            questionedProgress.TotalQuestions = questioned.Questions.Count;

            TestProgress testProgress;
            if ((testProgress = questionedProgress as TestProgress) != null)
            {
                var attempt = Math.Max(1, TestProgress.MaxTries - testProgress.TriesLeft + 1);
                TestQuestionProgress testQuestionProgress;
                if ((testQuestionProgress = questionProgress as TestQuestionProgress) != null)
                {
                    selectedOptionIDs.Select(o => new OptionProgress {OptionID = o, SelectedOnAttempt = attempt})
                        .Apply(o => testQuestionProgress.OptionProgress.Add(o));
                    if (correct)
                        testQuestionProgress.CorrectOnAttempt = attempt;
                }
            }

            _entityRepository.Save(courseProgress);

            correctResponseHeading = question.CorrectResponseHeading;
            correctResponseText = question.CorrectResponseText;

            return correct;
        }

        public bool AnswerCourseQuestion(Guid accountID, Guid courseID, Guid questionID, IList<Guid> selectedOptionIDs,
            out string correctResponseHeading, out string correctResponseText)
        {
            if (!selectedOptionIDs.Any())
                throw new ArgumentOutOfRangeException(nameof(selectedOptionIDs), "No options selected.");

            var course = GetCourse(courseID);

            if (course == null)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not found.");

            if (course.Status != CourseStatus.Active)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not active.");

            var question = (from s in course.Sections
                from q in s.Questions
                where q.ID == questionID
                select new {Question = q, Section = s}).FirstOrDefault();

            if (question?.Question == null)
                throw new ArgumentOutOfRangeException(nameof(questionID),
                    "Question not found in course (" + course.DisplayTitle + ")");

            return IsCorrectAnswer(accountID, course, question.Question, question.Section, selectedOptionIDs,
                out correctResponseHeading, out correctResponseText);
        }

        public IEnumerable<answer_result> AnswerTestQuestion(Guid accountID, Guid courseID, answer[] answers)
        {
            var course = GetCourse(courseID);

            if (course == null)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not found.");

            if (course.Status != CourseStatus.Active)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not active.");

            if (course.Test == null)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course does not have a test.");

            var courseProgress = GetCourseProgress(accountID, course);
            var testProgress = (TestProgress) (course.Test.GetProgress(courseProgress) ??
                                               course.Test.CreateAndAddProgress(courseProgress));

            if (testProgress.TriesLeft == 0)
                return null;

            var firstAttempt = testProgress.TriesLeft == TestProgress.MaxTries;

            var results = new List<answer_result>();
            foreach (var answer in answers)
            {
                if (!answer.selected_option_ids.Any())
                    results.Add(new answer_result(answer.question_id, false));

                var question = (from q in course.Test.Questions
                    where q.ID == answer.question_id
                    select q).FirstOrDefault();

                if (question == null)
                    continue;

                string correctResponseHeading, correctResponseText;
                Guid[] correctOptions;
                var isCorrect = IsCorrectAnswer(accountID, course, question, course.Test, answer.selected_option_ids,
                    out correctResponseHeading, out correctResponseText, out correctOptions);

                results.Add(new answer_result(answer.question_id, isCorrect, correctResponseHeading, correctResponseText,
                    correctOptions));
            }

            courseProgress = GetCourseProgress(accountID, course);
            testProgress = (TestProgress) (course.Test.GetProgress(courseProgress) ??
                                           course.Test.CreateAndAddProgress(courseProgress));

            var percentage = testProgress.CompletedQuestions.Count(r => r.CorrectOnAttempt != null)/
                             (decimal) course.Test.Questions.Count;

            //if (firstAttempt) courseProgress.FirstAttemptGrade = percentage;

            if (percentage < course.Test.PassingPercentage)
            {
                testProgress.TriesLeft = Math.Max(0, testProgress.TriesLeft - 1);
                _entityRepository.Save(testProgress);
            }
            else if(courseProgress.Certificate == null)
            {
                var account = _entityRepository.GetByID<Account>(accountID);
                _certificateService.CreateCertificate(account, courseProgress, DateTime.UtcNow);
            }

            return results;
        }

        public bool DeleteCourse(Guid courseID)
        {
            var course = GetCourse(courseID);
            if (course == null)
                return false;
            _entityRepository.Delete(course);
            return true;
        }

        public void Verify(Guid accountID, Guid courseID, string initials)
        {
            var course = GetCourse(courseID);

            if (course == null)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not found.");

            if (course.Status != CourseStatus.Active)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not active.");

            var courseProgress = GetCourseProgress(accountID, course);

            courseProgress.VerificationInitials = initials;
            courseProgress.VerificationDate =
                courseProgress.LastActivityUtc = DateTime.UtcNow;

            _entityRepository.Save(courseProgress);
        }

        public int IncrementActivity(Guid accountID, Guid courseID, int elapsedSeconds)
        {
            var course = GetCourse(courseID);

            if (course == null)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not found.");

            if (course.Status != CourseStatus.Active)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course not active.");

            var courseProgress = GetCourseProgress(accountID, course);

            courseProgress.ActiveTime += elapsedSeconds;
            courseProgress.LastActivityUtc = DateTime.UtcNow;

            // Changed to use SQL instead of NHibernate b/c it was saving stale data. Only the two fields here should change when this call is made.

            NHibernateSessionManager.Instance.GetSession()
                .CreateSQLQuery(
                    "UPDATE [Progress] SET ActiveTime=:activeTime, LastActivityUtc=:lastActivityUtc WHERE ProgressID=:progressID AND ActiveTime<:activeTime")
                .SetInt32("activeTime", courseProgress.ActiveTime)
                .SetDateTime("lastActivityUtc", courseProgress.LastActivityUtc)
                .SetGuid("progressID", courseProgress.ID)
                .ExecuteUpdate();

            //_entityRepository.Save(courseProgress);

            return courseProgress.ActiveTime;
        }

        public void ResetCourseSoItCanBeRataken(Guid accountID, Guid courseID)
        {
            var test = GetTest(courseID);

            var courseProgress = (from a in _entityRepository.Queryable<Account>()
                where a.ID == accountID
                from c in a.CourseProgress
                where c.Course.ID == courseID
                orderby c.Attempt descending
                select c).FirstOrDefault();

            if (courseProgress == null)
                throw new ArgumentOutOfRangeException(nameof(courseID), "Course progress not found.");

            if (courseProgress.TestProgress != null)
                courseProgress.TestProgress.TriesLeft = 0;
            else
                courseProgress.TestProgress = new TestProgress
                {
                    TestID = test.ID,
                    TotalQuestions = test.Questions.Count,
                    TriesLeft = 0
                };

            _entityRepository.Save(courseProgress);
        }
    }
}