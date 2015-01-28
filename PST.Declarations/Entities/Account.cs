using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.Design;
using PST.Declarations.Models;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Models;
using Prototype1.Foundation.Providers;

namespace PST.Declarations.Entities
{
    [Serializable]
    [Audit(false)]
    public class Account : AccountBase, IModelBackedEntityBase
    {
        public Account()
        {
            this.DateCreated = DateTime.Now;
        }

        public override string FirstName { get; set; }

        public override string LastName { get; set; }

        public override string Username { get; set; }

        [DataType(DataType.EmailAddress)]
        public override string Email { get; set; }

        public override string HashedPassword { get; set; }

        public override string PasswordResetToken { get; set; }

        public override DateTime? PasswordResetTokenExpirationDate { get; set; }

        public override DateTime DateCreated { get; set; }

        public override DateTime? DateLastLoggedIn { get; set; }

        public override AccountStatus Status { get; set; }

        public virtual AdminAccess AdminAccess { get; set; }

        public static implicit operator account(Account account)
        {
            return new account
            {
                ID = account.ID.ToString(),
                email = account.Email,
                first_name = account.FirstName,
                last_name = account.LastName,
                username = account.Username
            };
        }

        public static implicit operator Account(account account)
        {
            return new Account
            {
                ID = account.ID.ToGuid(true),
                Email = account.email,
                FirstName = account.first_name,
                LastName = account.last_name,
                Username = account.username
            };
        }

        [Transient]
        public virtual IEntityBackedModel Model
        {
            get { return (account)this; }
        }
    }
}
