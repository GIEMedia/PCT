using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using PST.Declarations.Models;
using PST.Declarations.Models.Management;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Course : EntityBase
    {
        public Course()
        {
            this.StateCEUs = new List<StateCEU>();
            this.PrerequisiteCourses = new List<Course>();
            this.Sections = new List<Section>();
            this.Status = CourseStatus.Draft;
        }

        public virtual string Title { get; set; }

        [Ownership(Ownership.None)]
        public virtual SubCategory Category { get; set; }

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
                title = course.Title,
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
                title = course.Title,
                description =
                    course.StateCEUs.Any()
                        ? "CEUs Available: " +
                          course.StateCEUs.OrderBy(x => x.StateAbbr)
                              .Select(x => string.Format("{0} ({1:#.0} hrs)", x.StateAbbr, x.Hours))
                              .Aggregate((i, j) => i + "," + j)
                        : ""
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
                title = course.Title
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
                sub_category = course.Category != null ? course.Category.ID : (Guid?) null,
                category =
                    course.Category != null && course.Category.ParentCategory != null
                        ? course.Category.ParentCategory.ID
                        : (Guid?) null,
                prerequisite_course = prereq == null ? (Guid?) null : prereq.ID,
                state_ceus = course.StateCEUs.Select(s => (m_state_ceu) s).ToArray()
            };
        }
    }
}