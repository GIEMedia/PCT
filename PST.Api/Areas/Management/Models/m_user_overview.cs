using System;

namespace PST.Api.Areas.Management.Models
{
    public class m_user_overview
    {
        public Guid id { get; set; }

        public string first_name { get; set; }

        public string last_name { get; set; }

        public string email { get; set; }

        public DateTime last_sign_in { get; set; }
    }
}