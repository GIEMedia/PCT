using System;

namespace PST.Api.Areas.Management.Models
{
    public class m_user_course_stat
    {
        public string title { get; set; }

        public int course_percent { get; set; }

        public int test_percent { get; set; }

        public bool test_failed { get; set; }

        public DateTime last_activity { get; set; }

        public string certificate_url { get; set; }
    }
}