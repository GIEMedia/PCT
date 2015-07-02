using System;

namespace PCT.Declarations.Models
{
    public class section<TQuestion> : questioned<TQuestion>
        where TQuestion : question_base
    {
        public Guid section_id { get; set; }

        public document document { get; set; }
    }
}