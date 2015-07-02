using System;

namespace PCT.Declarations.Models.Management
{
    public class m_state_ceu
    {
        public Guid id { get; set; }

        public string state { get; set; }

        public string category_code { get; set; }

        public decimal hours { get; set; }
    }
}