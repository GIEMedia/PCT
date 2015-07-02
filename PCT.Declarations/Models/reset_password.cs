using Prototype1.Foundation.Models;

namespace PCT.Declarations.Models
{
    public class reset_password : reset_password_base
    {
        public override string username { get; set; }
        public override string security_key { get; set; }
        public override string new_password { get; set; }
    }
}