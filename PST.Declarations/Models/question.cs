using System;

namespace PST.Declarations.Models
{
    public class question
    {
        public Guid question_id { get; set; }

        public string question_text { get; set; }

        public bool multi_select { get; set; }

        public enum option_types
        {
            text,
            image
        }

        public option_types option_type { get; set; }

        public option[] options { get; set; }

        public string image { get; set; }

        public video video { get; set; }
    }
}