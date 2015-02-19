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
        public static implicit operator test(Test test)
        {
            if (test == null)
                return new test();

            return new test
            {
                test_id = test.ID,
                questions = test.Questions.Select(q => q.ToModel()).ToArray()
            };
        }

        public override QuestionedProgress CreateAndAddProgress(CourseProgress courseProgress)
        {
            var questionedProgress = new TestProgress
            {
                Test = this,
                TotalQuestions = this.Questions.Count
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