using System;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Models;
using Prototype1.Foundation;
using Prototype1.Foundation.Providers;

namespace PST.Api.Core.OAuth
{
    public class ApplicationUser : IApplicationUser
    {
        public string Id { get; protected internal set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public string PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpirationDate { get; set; }
        public AccountStatus? Status { get; set; }
        public AdminAccess? AdminAccess { get; set; }

        public static implicit operator ApplicationUser(Account account)
        {
            if (account == null)
                return null;

            return new ApplicationUser
            {
                Id = account.ID.ToString(),
                FirstName = account.FirstName,
                LastName = account.LastName,
                UserName = account.Username,
                Email = account.Email,
                HashedPassword = account.HashedPassword,
                PasswordResetToken = account.PasswordResetToken,
                PasswordResetTokenExpirationDate = account.PasswordResetTokenExpirationDate,
                Status = account.Status,
                AdminAccess = account.AdminAccess
            };
        }

        public static implicit operator Account(ApplicationUser user)
        {
            if (user == null)
                return null;

            return new Account
            {
                ID = user.Id.ToGuid(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.UserName,
                Email = user.Email,
                HashedPassword = user.HashedPassword,
                PasswordResetToken = user.PasswordResetToken,
                PasswordResetTokenExpirationDate = user.PasswordResetTokenExpirationDate,
                Status = user.Status.GetValueOrDefault(AccountStatus.None),
                AdminAccess = user.AdminAccess.GetValueOrDefault(Declarations.AdminAccess.None)
            };
        }

        public static implicit operator ApplicationUser(account account)
        {
            var user = new ApplicationUser
            {
                Id = account.ID,
                FirstName = account.first_name,
                LastName = account.last_name,
                UserName = account.email,
                Email = account.email
            };
            if (account.is_admin.HasValue)
                user.AdminAccess = account.is_admin.Value
                    ? Declarations.AdminAccess.System
                    : Declarations.AdminAccess.None;
            return user;
        }

        public static implicit operator account(ApplicationUser user)
        {
            return new account
            {
                ID = user.Id,
                first_name = user.FirstName,
                last_name = user.LastName,
                username = user.UserName,
                email = user.Email
            };
        }

        public static implicit operator ApplicationUser(registration registration)
        {
            return new ApplicationUser
            {
                FirstName = registration.first_name,
                LastName = registration.last_name,
                UserName = registration.email,
                Email = registration.email
            };
        }
    }
}