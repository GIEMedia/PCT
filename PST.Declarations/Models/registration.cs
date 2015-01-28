using System;
using Prototype1.Foundation.Models;

namespace PST.Declarations.Models
{
    public class registration : registration_base
    {
        public override string first_name { get; set; }
        public override string last_name { get; set; }
        public override string username { get; set; }
        public override string email { get; set; }
        public override string password { get; set; }
        public DateTime? date_of_birth { get; set; }
    }
}