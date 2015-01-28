using System;
using System.Runtime.Serialization;
using PST.Declarations.Entities;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Models;
using Prototype1.Foundation.Providers;

namespace PST.Declarations.Models
{
    public class account : account_base, IEntityBackedModel
    {
        public override string first_name { get; set; }
        public override string last_name { get; set; }
        public override string username
        {
            get { return email; }
            set { email = value; }
        }
        public override string email { get; set; }
        public override string ID { get; set; }
        public DateTime? date_of_birth { get; set; }

        public bool? is_admin { get; set; }

        [IgnoreDataMember]
        public EntityBase Entity
        {
            get { return (Account) this; }
        }
    }
}