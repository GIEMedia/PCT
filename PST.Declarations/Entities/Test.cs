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

        public static implicit operator test(Test test)
        {
            if (test == null)
                return new test();

            return new test
            {
                test_id = test.ID,
                title = test.Title,
                passing_percentage = test.PassingPercentage,
                questions = test.Questions.Select(q => q.ToModel()).ToArray()
            };
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
    }
}