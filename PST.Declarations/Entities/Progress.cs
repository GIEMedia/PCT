using System;
using System.Linq;
using System.Collections.Generic;
using Prototype1.Foundation.Data;
using PST.Declarations.Models.Management;

namespace PST.Declarations.Entities
{
    [Serializable]
    public abstract class Progress : EntityBase
    {
        public Progress()
        {
            LastActivityUtc = DateTime.UtcNow;
        }

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

        private Certificate certificate;

        [Ownership(Ownership.Exclusive)]
        public virtual Certificate Certificate
        {
            get { return certificate; }
            set
            {
                certificate = value;
                if (certificate != null)
                    certificate.Course = Course;
            }
        }

        public static implicit operator m_user_course_stat(CourseProgress courseProgress)
        {
            var stat = new m_user_course_stat
            {
                title = courseProgress.Course.Title,
                last_activity = courseProgress.LastActivityUtc,
                certificate_url =
                    courseProgress.Certificate == null ? string.Empty : courseProgress.Certificate.ID.ToString(),
                course_percent = courseProgress.Sections.Count(s => s.Passed)/(decimal) courseProgress.TotalSections,
                test_percent = courseProgress.TestProgress == null
                    ? 0
                    : courseProgress.TestProgress.CompletedQuestions.Count()/
                      (decimal) courseProgress.TestProgress.TotalQuestions,
                test_failed = courseProgress.TestProgress != null && courseProgress.TestProgress.TriesLeft > 0
            };

            return stat;
        }
    }

    [Serializable]
    public abstract class QuestionedProgress : Progress
    {
        public QuestionedProgress()
        {
            this.CompletedQuestions = new List<QuestionProgress>();
        }

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
        public TestProgress()
        {
            this.TriesLeft = 3;
        }

        [Ownership(Ownership.None)]
        public virtual Test Test { get; set; }

        public virtual int TriesLeft { get; set; }
    }

    [Serializable]
    public class QuestionProgress : Progress
    {
        [Ownership(Ownership.None)]
        public virtual Question Question { get; set; }
    }
}