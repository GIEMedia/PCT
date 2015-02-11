using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PST.Declarations.Models
{
    public class course
    {
        public Guid course_id { get; set; }

        public string title { get; set; }

        public section[] sections { get; set; }
    }
}
