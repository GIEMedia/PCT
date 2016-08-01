using System;

namespace PCT.Declarations.Models
{
    public class course_overview
    {
        public Guid course_id { get; set; }

        public string title { get; set; }

        public string description { get; set; }

        public decimal? course_progress { get; set; }

        public decimal? test_progress { get; set; }

        public DateTime? last_activity { get; set; }

        public string[] prereq_courses { get; set; }

        public string image_url { get; set; }

        public bool ceu_eligible { get; set; }
    }
}
