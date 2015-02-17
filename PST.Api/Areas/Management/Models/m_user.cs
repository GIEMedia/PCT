using Prototype1.Foundation.Providers;
using PST.Declarations;
using PST.Declarations.Models;

namespace PST.Api.Areas.Management.Models
{
    public class m_user : m_user_overview
    {
        public AdminAccess admin_access { get; set; }

        public string company_name { get; set; }
        
        public address company_address { get; set; }

        public state_licensure[] licensures { get; set; }

        public manager[] managers { get; set; }

        public m_user_course_stat courses { get; set; }
    }
}