using System;
using System.Linq;
using Prototype1.Foundation.Data;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;
using PST.Declarations.Models.Management;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Section : Questioned, ISorted
    {
        [Ownership(Ownership.Exclusive)]
        public virtual Document Document { get; set; }

        public virtual int SortOrder { get; set; }

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

        public static implicit operator section(Section section)
        {
            return new section
            {
                section_id = section.ID,
                title = section.Title,
                document = section.Document,
                questions = section.Questions.Select(q => q.ToModel()).ToArray()
            };
        }

        public static implicit operator m_section_overview(Section section)
        {
            return new m_section_overview
            {
                id = section.ID,
                title = section.Title,
                document = section.Document,
                num_questions = section.Questions.Count
            };
        }
    }
}
