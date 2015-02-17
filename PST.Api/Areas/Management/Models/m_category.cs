using System;

namespace PST.Api.Areas.Management.Models
{
    public class m_category
    {
        public Guid id { get; set; }

        public string title { get; set; }
    }

    public class m_main_category : m_category
    {
        public m_category[] sub_categories { get; set; }
    }
}