using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Interfaces;
using Prototype1.Security;
using PST.Declarations.Models;
using PST.Declarations.Models.Management;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Course : EntityBase, IPermanentRecord
    {
        public Course()
        {
            this.StateCEUs = new List<StateCEU>();
            this.PrerequisiteCourses = new List<Course>();
            this.Sections = new List<Section>();
            this.Status = CourseStatus.Draft;
        }

        public virtual string Title { get; set; }

        public virtual string DisplayTitle
        {
            get { return (Manufacturer != null ? Manufacturer.Name + ": " : "") + Title; }
            set { /*no-op*/ }
        }

        [Ownership(Ownership.None)]
        public virtual SubCategory Category { get; set; }

        [Ownership(Ownership.None)]
        public virtual Manufacturer Manufacturer { get; set; }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<StateCEU> StateCEUs { get; set; }

        [Ownership(Ownership.Shared)]
        public virtual IList<Course> PrerequisiteCourses { get; set; }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<Section> Sections { get; set; }

        [Ownership(Ownership.Exclusive)]
        public virtual Test Test { get; set; }

        public virtual CourseStatus Status { get; set; }

        public virtual DateTime DateCreatedUtc { get; set; }

        public static implicit operator course<question>(Course course)
        {
            return ToCourse<question>(course);
        }

        public static implicit operator course<question_with_answers>(Course course)
        {
            return ToCourse<question_with_answers>(course);
        }

        private static course<TQuestion> ToCourse<TQuestion>(Course course)
            where TQuestion : question_base, new()
        {
            if (course == null)
                return new course<TQuestion>();

            return new course<TQuestion>
            {
                course_id = course.ID,
                title = course.DisplayTitle,
                sections =
                    course.Sections != null
                        ? course.Sections.Select(s => s.ToModel<TQuestion>()).ToArray()
                        : new section<TQuestion>[0]
            };
        }

        public static implicit operator course_overview(Course course)
        {
            if (course == null)
                return new course_overview();

            return new course_overview
            {
                course_id = course.ID,
                title = course.DisplayTitle,
                image_url = course.Manufacturer != null ? course.Manufacturer.ImageUrl : "",
                description = course.StateCEUs.Any()
                    ? course.StateCEUs.GroupBy(x => x.Hours, x => x.StateAbbr)
                          .Select(x => string.Format("{1:#.0} hrs: {0}", x.OrderBy(y=>y).Aggregate((i, j) => i + ", " + j), x.Key))
                          .Aggregate((i, j) => i + " | " + j)
                    : "",
                prereq_courses = course.PrerequisiteCourses.Select(c => c.DisplayTitle).ToArray()
            };
        }

        public static implicit operator m_course_overview(Course course)
        {
            if (course == null)
                return new m_course_overview();

            return new m_course_overview
            {
                id = course.ID,
                date_created = course.DateCreatedUtc,
                status = course.Status,
                title = course.DisplayTitle
            };
        }

        public static implicit operator m_course(Course course)
        {
            if (course == null)
                return new m_course();

            var prereq = course.PrerequisiteCourses.FirstOrDefault();
            return new m_course
            {
                id = course.ID,
                date_created = course.DateCreatedUtc,
                status = course.Status,
                title = course.Title,
                manufacturer = course.Manufacturer != null ? course.Manufacturer.ID : (Guid?) null,
                sub_category = course.Category != null ? course.Category.ID : (Guid?) null,
                category =
                    course.Category != null && course.Category.ParentCategory != null
                        ? course.Category.ParentCategory.ID
                        : (Guid?) null,
                prerequisite_course = prereq == null ? (Guid?) null : prereq.ID,
                state_ceus = course.StateCEUs.Select(s => (m_state_ceu) s).ToArray()
            };
        }

        public virtual bool Deleted { get; set; }

        public virtual IEnumerable<m_validation_error> Validate()
        {
            if(Sections.Count == 0)
                yield return new m_validation_error(m_validation_error.Severity.Error, null, null, null, "This course contains no sections.");

            if (Test == null)
                yield return new m_validation_error(m_validation_error.Severity.Error, null, null, null, "This course does not have a test.");

            foreach (var s in Sections.Where(s => s.Document == null || s.Document.PDFUrl.IsNullOrEmpty()))
                yield return new m_validation_error(m_validation_error.Severity.Warning, s.ID, null, null, "The section '{0}' has no document.", s.Title);

            foreach (var s in Sections.Where(s => s.Questions == null || s.Questions.Count == 0))
                yield return new m_validation_error(m_validation_error.Severity.Error, s.ID, null, true, "The section '{0}' has no questions.", s.Title);
            if (Test != null && (Test.Questions == null || Test.Questions.Count == 0))
                yield return new m_validation_error(m_validation_error.Severity.Error, null, null, true, "The test has no questions.");

            foreach (var s in Sections.Where(s => s.Questions != null))
                foreach (var q in s.Questions.Where(q => q.Options == null || q.Options.Count == 0))
                    yield return new m_validation_error(m_validation_error.Severity.Error, s.ID, q.ID, null, "The question '{0}' of section '{1}' has no answers.", q.QuestionText, s.Title);
            if (Test != null && Test.Questions != null)
                foreach (var q in Test.Questions.Where(q => q.Options == null || q.Options.Count == 0))
                    yield return new m_validation_error(m_validation_error.Severity.Error, null, q.ID, null, "The question '{0}' of the test has no answers.", q.QuestionText);

            foreach (var s in Sections.Where(s => s.Questions != null))
                foreach (var q in s.Questions.Where(q => q.Options != null && q.Options.All(o => !o.Correct)))
                    yield return new m_validation_error(m_validation_error.Severity.Error, s.ID, q.ID, null, "The question '{0}' of section '{1}' has no answers marked as correct.", q.QuestionText, s.Title);
            if (Test != null && Test.Questions != null)
                foreach (var q in Test.Questions.Where(q => q.Options != null && q.Options.All(o => !o.Correct)))
                    yield return new m_validation_error(m_validation_error.Severity.Error, null, q.ID, null, "The question '{0}' of the test has no answers marked as correct.", q.QuestionText);

            foreach (var s in Sections.Where(s => s.Questions != null))
                foreach (var q in s.Questions.Where(q => q.CorrectResponseHeading.IsNullOrEmpty() || q.CorrectResponseText.IsNullOrEmpty()))
                    yield return new m_validation_error(m_validation_error.Severity.Warning, s.ID, q.ID, null, "The question '{0}' of section '{1}' is missing the correct response heading and/or text.", q.QuestionText, s.Title);
            if (Test != null && Test.Questions != null)
                foreach (var q in Test.Questions.Where(q => q.CorrectResponseHeading.IsNullOrEmpty() || q.CorrectResponseText.IsNullOrEmpty()))
                    yield return new m_validation_error(m_validation_error.Severity.Warning, null, q.ID, null, "The question '{0}' of the test is missing the correct response heading and/or text.", q.QuestionText);

            foreach (var s in Sections.Where(s => s.Questions != null))
                foreach (var q in s.Questions.OfType<SingleImageQuestion>().Where(q => q.ImageUrl.IsNullOrEmpty()))
                    yield return new m_validation_error(m_validation_error.Severity.Error, s.ID, q.ID, null, "The single image question '{0}' of section '{1}' has no image.", q.QuestionText, s.Title);
            if (Test != null && Test.Questions != null)
                foreach (var q in Test.Questions.OfType<SingleImageQuestion>().Where(q => q.ImageUrl.IsNullOrEmpty()))
                    yield return new m_validation_error(m_validation_error.Severity.Error, null, q.ID, null, "The single image question '{0}' of the test has no image.", q.QuestionText);

            foreach (var s in Sections.Where(s => s.Questions != null))
                foreach (var q in s.Questions.OfType<VideoQuestion>().Where(q => q.Mp4Url.IsNullOrEmpty()))
                    yield return new m_validation_error(m_validation_error.Severity.Error, s.ID, q.ID, null, "The video question '{0}' of section '{1}' has no video.", q.QuestionText, s.Title);
            if (Test != null && Test.Questions != null)
                foreach (var q in Test.Questions.OfType<VideoQuestion>().Where(q => q.Mp4Url.IsNullOrEmpty()))
                    yield return new m_validation_error(m_validation_error.Severity.Error, null, q.ID, null, "The video question '{0}' of the test has no video.", q.QuestionText);
        }
    }
}