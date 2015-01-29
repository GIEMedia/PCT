using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using PST.Declarations;
using PST.Declarations.Entities;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.Providers;
using PST.Declarations.Entities.Components;

namespace PST.Api.Core.OAuth
{
    public class ApplicationUserStore : ApplicationUserStoreBase<ApplicationUser, Account>
    {
        private readonly IEntityRepository _entityRepository;

        private static readonly AccountStatus[] InactiveStatuses = { AccountStatus.Closed };
        public static readonly Expression<Func<Account, bool>> AccountIsActive = a => !InactiveStatuses.Contains(a.Status); 

        public ApplicationUserStore(IEntityRepository entityRepository)
        {
            _entityRepository = entityRepository;
        }

        public override Task AddLoginAsync(ApplicationUser user, UserLoginInfo login)
        {
            var accountLoginInfo = new AccountLoginInfo()
            {
                AccountId = user.Id,
                LoginProvider = login.LoginProvider,
                ProviderKey = login.ProviderKey
            };
            _entityRepository.Save(accountLoginInfo);

            return Task.FromResult<object>(null);
        }

        public override Task RemoveLoginAsync(ApplicationUser user, UserLoginInfo login)
        {
            var accountLoginInfo = _entityRepository.Queryable<AccountLoginInfo>()
               .FirstOrDefault(x => x.AccountId == user.Id && x.LoginProvider == login.LoginProvider
                                    && x.ProviderKey == login.ProviderKey);
            _entityRepository.Delete(accountLoginInfo);

            return Task.FromResult<object>(null);
        }

        public override Task<IList<UserLoginInfo>> GetLoginsAsync(ApplicationUser user)
        {
            var accountLoginInfos = _entityRepository.Queryable<AccountLoginInfo>()
                .Where(x => x.AccountId == user.Id)
                .ToList();
            var userInfos = accountLoginInfos.Select(x =>
                new UserLoginInfo(x.LoginProvider, x.ProviderKey)).ToList();

            return Task.FromResult<IList<UserLoginInfo>>(userInfos);
        }

        public override Task<ApplicationUser> FindAsync(UserLoginInfo login)
        {
            var accountLoginInfo = _entityRepository.Queryable<AccountLoginInfo>()
                .FirstOrDefault(x => x.LoginProvider == login.LoginProvider
                                     && x.ProviderKey == login.ProviderKey);

            return accountLoginInfo != null
                ? FindByIdAsync(accountLoginInfo.AccountId)
                : Task.FromResult<ApplicationUser>(null);
        }

        protected override ApplicationUser GetUser(Expression<Func<Account, bool>> filter)
        {
            var acct = _entityRepository.Queryable<Account>()
                .Where(filter)
                .Where(AccountIsActive)
                .Select(a => new
                {
                    a.ID,
                    a.FirstName,
                    a.LastName,
                    a.Username,
                    a.Email,
                    a.CompanyAddress,
                    a.HashedPassword,
                    a.PasswordResetToken,
                    a.PasswordResetTokenExpirationDate,
                    a.Status,
                    a.AdminAccess
                }).FirstOrDefault();

            if (acct == null)
                return null;

            return new ApplicationUser
            {
                Id = acct.ID.ToString(),
                FirstName = acct.FirstName,
                LastName = acct.LastName,
                UserName = acct.Username,
                Email = acct.Email,
                CompanyAddress = acct.CompanyAddress,
                HashedPassword = acct.HashedPassword,
                PasswordResetToken = acct.PasswordResetToken,
                PasswordResetTokenExpirationDate = acct.PasswordResetTokenExpirationDate,
                Status = acct.Status,
                AdminAccess = acct.AdminAccess
            };
        }

        protected override Account GetAccountForUser(ApplicationUser user)
        {
            Guid id;
            return !Guid.TryParse(user.Id, out id)
                ? null
                : _entityRepository.GetByID<Account>(id);
        }

        protected override void SaveUser(ApplicationUser user)
        {
            var account = GetAccountForUser(user).As<Account>() ?? new Account();

            account.FirstName = user.FirstName.IfNullOrEmpty(account.FirstName);
            account.LastName = user.LastName.IfNullOrEmpty(account.LastName);
            account.Username = user.UserName.IfNullOrEmpty(account.Username);
            account.Email = user.Email.IfNullOrEmpty(account.Email);
            account.CompanyAddress = user.CompanyAddress ?? new Address();
            account.HashedPassword = user.HashedPassword.IfNullOrEmpty(account.HashedPassword);
            account.PasswordResetToken = user.PasswordResetToken.IfNullOrEmpty(account.PasswordResetToken);
            account.PasswordResetTokenExpirationDate = user.PasswordResetTokenExpirationDate.IfNull(account.PasswordResetTokenExpirationDate);
            account.Status = user.Status.GetValueOrDefault(account.Status);
            account.AdminAccess = user.AdminAccess.GetValueOrDefault(account.AdminAccess);

            _entityRepository.Save(account);
            user.As<ApplicationUser>().Id = account.ID.ToString();
        }

        protected override void DeleteUser(Account account)
        {
            account.Status = AccountStatus.Closed;
            account.Username = null;
            _entityRepository.Save(account);
        }

        protected override void SetUserPasswordHash(ApplicationUser user)
        {
            if (user == null)
                return;

            var currentUser = this.GetAccountForUser(user);
            if (currentUser == null)
                return;

            if (!string.IsNullOrEmpty(user.HashedPassword))
                currentUser.HashedPassword = user.HashedPassword;

            _entityRepository.Save(currentUser);
        }
    }
}