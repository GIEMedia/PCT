using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation.Data;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Test : Questioned
    {
        [Transient]
        public virtual decimal PassingPercentage { get { return .8M; } }

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

        public override QuestionedProgress CreateAndAddProgress(CourseProgress courseProgress)
        {
            var questionedProgress = new TestProgress
            {
                Test = this,
                TotalQuestions = this.Questions.Count,
            };
            courseProgress.TestProgress = questionedProgress;

            return questionedProgress;
        }

        public override QuestionedProgress GetProgress(CourseProgress courseProgress)
        {
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