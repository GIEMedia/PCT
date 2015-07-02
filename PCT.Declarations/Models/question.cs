using System;

namespace PCT.Declarations.Models
{
    public abstract class question_base
    {
        public Guid question_id { get; set; }

        public string question_text { get; set; }

        public string tip { get; set; }

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

    public class question : question_base
    {
        
    }

    public class question_with_answers : question_base
    {
        public answer_result answer { get; set; }
    }
}