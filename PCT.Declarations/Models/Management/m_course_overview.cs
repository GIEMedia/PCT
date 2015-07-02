using System;
using System.Collections.Generic;
using Prototype1.Foundation;
using PCT.Declarations.Entities;
using WebGrease.Css.Extensions;

namespace PCT.Declarations.Models.Management
{
    public class m_course_overview
    {
        public Guid id { get; set; }

        public string title { get; set; }

        public DateTime date_created { get; set; }

        public DateTime? last_activity { get; set; }

        public int course_open { get; set; }

        public int course_complete { get; set; }

        public int test_open { get; set; }

        public int test_complete { get; set; }

        public CourseStatus status { get; set; }
    }

    public static class CourseModelExtensions
    {
        public static IEnumerable<m_course_overview> ApplyCourseProgressStats(this IEnumerable<m_course_overview> courses, IList<CourseProgressStat> stats)
        {
            foreach(var c in courses)
            {
                var stat = stats.FindById(c.id);
                if (stat != null)
                {
                    c.course_open = stat.CourseInProgress;
                    c.course_complete = stat.CourseCompleted;
                    c.test_open = stat.TestInProgress;
                    c.test_complete = stat.TestCompleted;
                    c.last_activity = stat.LastActivityUtc;
                }
                yield return c;
            }
        }
    }
}