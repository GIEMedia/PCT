using System;

namespace PCT.Declarations.Models
{
    public class manufacturer
    {
        public Guid manufacturer_id { get; set; }

        public string name { get; set; }

        public string image_url { get; set; }

        public int course_count { get; set; }
    }
}