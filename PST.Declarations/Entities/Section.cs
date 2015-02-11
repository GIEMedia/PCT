using System;
using System.Linq;
using Prototype1.Foundation.Data;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Section : Questioned
    {
        [Ownership(Ownership.Exclusive)]
        public virtual Document Document { get; set; }

        public static implicit operator section(Section section)
        {
            return new section
            {
                section_id = section.ID,
                title = section.Title,
                complete = section.Complete,
                document = section.Document,
                questions = section.Questions.OfType<Question<Option>>().Select(q => q.ToModel()).ToArray()
            };
        }

        public override QuestionedProgress CreateAndAddProgress(CourseProgress courseProgress)
        {
            var questionedProgress = new SectionProgress
            {
                Section = this,
                TotalQuestions = this.Questions.Count
            };
            courseProgress.Sections.Add(questionedProgress);

            return questionedProgress;
        }

        public override QuestionedProgress GetProgress(CourseProgress courseProgress)
        {
            return courseProgress.Sections.FirstOrDefault(s => s.Section.ID == this.ID);
        }
    }
}
