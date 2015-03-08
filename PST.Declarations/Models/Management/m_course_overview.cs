using System;

namespace PST.Declarations.Models.Management
{
    public class m_course_overview
    {
        public Guid id { get; set; }

        public string title { get; set; }

        public DateTime date_created { get; set; }

        public DateTime last_activity { get; set; }

        public int open { get; set; }
        
        public int complete { get; set; }

        public CourseStatus status { get; set; }
    }
}
