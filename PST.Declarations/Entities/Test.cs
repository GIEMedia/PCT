using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Test : Questioned<TestQuestionProgress>
    {
        private static readonly decimal _passingPercentage =
            ConfigurationManager.AppSettings["PassingPercentage"].ToDecimal(.8M);

        public Test()
        {
        }

        public Test(Course course)
        {
            this.Title = course.DisplayTitle;
        }

        [Transient]
        public virtual decimal PassingPercentage { get { return _passingPercentage; } }

        [Transient]
        public virtual int MaxTries { get { return 3; } }

        public static implicit operator test<question>(Test test)
        {
            return test.ToModel<question>();
        }

        public static implicit operator test<question_with_answers>(Test test)
        {
            return test.ToModel<question_with_answers>();
        }

        public override QuestionedProgress<TestQuestionProgress> CreateAndAddProgress(CourseProgress courseProgress)
        {
            var questionedProgress = new TestProgress
            {
                TestID = this.ID,
                TotalQuestions = this.Questions.Count,
            };
            //courseProgress.TestProgress = new List<TestProgress> {questionedProgress};
            courseProgress.TestProgress = questionedProgress;

            return questionedProgress;
        }

        public override QuestionedProgress<TestQuestionProgress> GetProgress(CourseProgress courseProgress)
        {
            //return courseProgress.TestProgress.FirstOrDefault();
            return courseProgress.TestProgress;
        }

        public virtual test<TQuestion> ToModel<TQuestion>()
            where TQuestion : question_base, new()
        {
            return new test<TQuestion>
            {
                test_id = ID,
                title = Title,
                passing_percentage = PassingPercentage,
                questions = Questions.Select(q => q.ToModel<TQuestion>()).ToArray()
            };
        }
    }
}