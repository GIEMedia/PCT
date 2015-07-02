using System;

namespace PCT.Declarations.Models
{
    public class test<TQuestion> : questioned<TQuestion>
        where TQuestion : question_base
    {
        public Guid? test_id { get; set; }

        public decimal passing_percentage { get; set; }
    }
}
