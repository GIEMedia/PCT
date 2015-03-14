using System;

namespace PST.Declarations.Models
{
    public class course<TQuestion>
        where TQuestion : question_base
    {
        public Guid? course_id { get; set; }

        public string title { get; set; }

        public section<TQuestion>[] sections { get; set; }

        public course_overview[] prerequisite_courses { get; set; }
    }
}