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

        //public virtual TestProgress TestProgress { get; set; }
        //public virtual IList<TestProgress> TestProgress { get; set; }
        private TestProgress _testProgress;
        public virtual TestProgress TestProgress
        {
            get { return _testProgress; }
            set
            {
                _testProgress = value;
                if (_testProgress != null)
                    _testProgress.CourseProgressID = ID;
            }
        }

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
                title = courseProgress.Course.DisplayTitle,
                last_activity = courseProgress.LastActivityUtc,
                certificate_url =
                    courseProgress.Certificate == null ? string.Empty : Certificate.GetPdfUrl(courseProgress.Certificate.ID),
                course_percent = courseProgress.Sections.Count(s => s.Passed)/(decimal) courseProgress.TotalSections,
                test_percent = courseProgress.TestProgress == null
                    ? 0
                    : courseProgress.TestProgress.CompletedQuestions.Count(q => q.CorrectOnAttempt != null) /
                      (decimal)courseProgress.TestProgress.TotalQuestions,
                test_failed = courseProgress.TestProgress != null && courseProgress.TestProgress.TriesLeft == 0
            };

            return stat;
        }
    }

    [Serializable]
    public abstract class QuestionedProgress<TQuestionProgress> : Progress
        where TQuestionProgress : QuestionProgressBase
    {
        public QuestionedProgress()
        {
            this.CompletedQuestions = new List<TQuestionProgress>();
        }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<TQuestionProgress> CompletedQuestions { get; set; }

        public virtual int TotalQuestions { get; set; }

        [Transient]
        public virtual bool Passed { get { return CompletedQuestions.Count(q => q.CorrectOnAttempt != null) == TotalQuestions; } }
    }

    [Serializable]
    public class SectionProgress : QuestionedProgress<QuestionProgress>
    {
        public virtual Guid SectionID { get; set; }
    }

    [Serializable]
    public class TestProgress : QuestionedProgress<TestQuestionProgress>
    {
        public static readonly int MaxTries = 3;

        public TestProgress()
        {
            this.TriesLeft = MaxTries;
        }

        public virtual Guid TestID { get; set; }

        public virtual int TriesLeft { get; set; }

        /// <summary>
        /// Set by CourseProgress.TestProgress setter - used for ParentProgressID mapping
        /// </summary>
        public virtual Guid CourseProgressID { get; set; }
    }

    [Serializable]
    public abstract class QuestionProgressBase : Progress
    {
        public virtual Guid QuestionID { get; set; }

        public abstract int? CorrectOnAttempt { get; set; }
    }

    [Serializable]
    public class QuestionProgress : QuestionProgressBase
    {
        [Transient]
        public override int? CorrectOnAttempt { get { return 1; } set { /* no-op */} }
    }

    [Serializable]
    public class TestQuestionProgress : QuestionProgressBase
    {
        public TestQuestionProgress()
        {
            this.OptionProgress = new List<OptionProgress>();
        }

        [Ownership(Ownership.None)]
        public virtual IList<OptionProgress> OptionProgress { get; set; }

        public override int? CorrectOnAttempt { get; set; }
    }

    [Serializable]
    public class OptionProgress : Progress
    {
        public virtual Guid OptionID { get; set; }

        public virtual int SelectedOnAttempt { get; set; }
    }
}