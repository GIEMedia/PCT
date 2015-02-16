using Prototype1.Foundation.Data;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    public class Manager : EntityBase
    {
        public virtual string Name { get; set; }

        public virtual string Email { get; set; }

        public static implicit operator manager(Manager manager)
        {
            return new manager
            {
                name = manager.Name,
                email = manager.Email
            };
        }

        public static implicit operator Manager(manager manager)
        {
            return new Manager
            {
                Name = manager.name,
                Email = manager.email
            };
        }
    }
}