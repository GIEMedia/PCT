using Prototype1.Foundation.Models;

namespace PCT.Declarations.Models
{
    public class change_password : change_password_base
    {
        public override string old_password { get; set; }
        public override string new_password { get; set; }
    }
}