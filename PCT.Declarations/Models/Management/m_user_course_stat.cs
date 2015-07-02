using System;

namespace PCT.Declarations.Models.Management
{
    public class m_user_course_stat
    {
        public string title { get; set; }

        public decimal course_percent { get; set; }

        public decimal test_percent { get; set; }

        public bool test_failed { get; set; }

        public DateTime last_activity { get; set; }

        public string certificate_url { get; set; }
    }
}