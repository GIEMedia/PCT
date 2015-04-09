using System;
using Prototype1.Security;

namespace PST.Declarations.Models.Management
{
    public class m_course
    {
        public Guid id { get; set; }

        public string title { get; set; }

        public DateTime date_created { get; set; }

        public CourseStatus status { get; set; }

        public Guid? category { get; set; }

        public Guid? sub_category { get; set; }

        public m_state_ceu[] state_ceus { get; set; }

        public Guid? prerequisite_course { get; set; }
    }
}