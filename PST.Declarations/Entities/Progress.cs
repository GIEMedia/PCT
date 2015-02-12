using System;
using System.Collections.Generic;
using Prototype1.Foundation.Data;

namespace PST.Declarations.Entities
{
    [Serializable]
    public abstract class Progress : EntityBase
    {
        public virtual DateTime LastActivityUtc { get; set; }
    }

    [Serializable]
    public class CourseProgress : Progress
    {
        public CourseProgress()
        {
            this.Sections = new List<SectionProgress>();
        }

        [Ownership(Ownership.None)]
        public virtual Course Course { get; set; }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<SectionProgress> Sections { get; set; }

        public virtual int TotalSections { get; set; }

        public virtual TestProgress TestProgress { get; set; }

        [Ownership(Ownership.Shared)]
        public virtual Certificate Certificate { get; set; }
    }

    [Serializable]
    public abstract class QuestionedProgress : Progress
    {

        [Ownership(Ownership.Exclusive)]
        public virtual IList<QuestionProgress> CompletedQuestions { get; set; }

        public virtual int TotalQuestions { get; set; }

        [Transient]
        public virtual bool Passed { get { return CompletedQuestions.Count == TotalQuestions; } }
    }

    [Serializable]
    public class SectionProgress : QuestionedProgress
    {
        [Ownership(Ownership.None)]
        public virtual Section Section { get; set; }
    }

    [Serializable]
    public class TestProgress : QuestionedProgress
    {
        [Ownership(Ownership.None)]
        public virtual Test Test { get; set; }

        public virtual int RetriesLeft { get; set; }
    }

    public class QuestionProgress : Progress
    {
        [Ownership(Ownership.None)]
        public virtual Question Question { get; set; }
    }
}