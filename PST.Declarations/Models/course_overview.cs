using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PST.Declarations.Models
{
    public class course_overview
    {
        public Guid course_id { get; set; }

        public string title { get; set; }

        public string description { get; set; }

        public decimal course_progress { get; set; }

        public decimal test_progress { get; set; }

        public DateTime last_activity { get; set; }
    }
}
