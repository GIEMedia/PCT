using System;
using System.Linq;
using Prototype1.Foundation.Data;
using PCT.Declarations.Interfaces;
using PCT.Declarations.Models;
using PCT.Declarations.Models.Management;

namespace PCT.Declarations.Entities
{
    [Serializable]
    public class Section : Questioned<QuestionProgress>, ISorted
    {
        [Ownership(Ownership.Shared)]
        public virtual Document Document { get; set; }

        public virtual int SortOrder { get; set; }

        public override QuestionedProgress<QuestionProgress> CreateAndAddProgress(CourseProgress courseProgress)
        {
            var questionedProgress = new SectionProgress
            {
                SectionID = this.ID,
                TotalQuestions = Questions.Count
            };
            courseProgress.Sections.Add(questionedProgress);

            return questionedProgress;
        }

        public override QuestionedProgress<QuestionProgress> GetProgress(CourseProgress courseProgress)
        {
            return courseProgress.Sections.FirstOrDefault(s => s.SectionID == ID);
        }

        public virtual section<TQuestion> ToModel<TQuestion>()
            where TQuestion : question_base, new()
        {
            return new section<TQuestion>
            {
                section_id = ID,
                title = Title,
                document = Document,
                questions = Questions.Select(q => q.ToModel<TQuestion>()).ToArray()
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
