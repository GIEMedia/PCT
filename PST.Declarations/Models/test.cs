using System;

namespace PST.Declarations.Models
{
    public class test : questioned
    {
        public Guid? test_id { get; set; }

        public decimal passing_percentage { get; set; }

        public int retries_left { get; set; }
    }
}
