using System;
using PST.Declarations;

namespace PST.Api.Areas.Management.Models
{
    public class m_course_overview
    {
        public Guid id { get; set; }

        public string title { get; set; }

        public DateTime date_created { get; set; }

        public int open { get; set; }
        
        public int complete { get; set; }

        public CourseStatus status { get; set; }
    }
}
