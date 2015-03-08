namespace PST.Declarations.Models.Management
{
    public class m_user : m_user_overview
    {
        public m_user()
        {
            this.licensures = new state_licensure[0];
            this.managers = new manager[0];
            this.courses = new m_user_course_stat[0];
        }

        public AdminAccess admin_access { get; set; }

        public string company_name { get; set; }
        
        public address company_address { get; set; }

        public state_licensure[] licensures { get; set; }

        public manager[] managers { get; set; }

        public m_user_course_stat[] courses { get; set; }
    }
}