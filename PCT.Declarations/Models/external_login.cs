using Prototype1.Foundation.Models;

namespace PCT.Declarations.Models
{
    public class external_login : external_login_base
    {
        public override string name { get; set; }
        public override string url { get; set; }
        public override string state { get; set; }
    }
}