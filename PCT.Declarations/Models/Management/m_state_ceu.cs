using System;

namespace PCT.Declarations.Models.Management
{
    public class m_state_ceu
    {
        public Guid id { get; set; }

        public string state { get; set; }

        public Guid? category_id { get; set; }

        public string activity_id { get; set; }

        public string activity_type { get; set; }

        public decimal hours { get; set; }
    }
}