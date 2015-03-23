using System;

namespace PST.Declarations.Models.Management
{
    public class m_user_search_result
    {
        public int pages { get; set; }

        public m_user_overview[] results { get; set; }
    }
}