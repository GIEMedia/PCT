using System;

namespace PCT.Declarations.Models.Management
{
    public class m_section_overview
    {
        public Guid id { get; set; }

        public string title { get; set; }

        public int num_questions { get; set; }

        public document document { get; set; }
    }
}