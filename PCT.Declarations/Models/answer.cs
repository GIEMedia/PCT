using System;

namespace PCT.Declarations.Models
{
    public class answer
    {
        public Guid question_id { get; set; }

        public Guid[] selected_option_ids { get; set; }
    }
}