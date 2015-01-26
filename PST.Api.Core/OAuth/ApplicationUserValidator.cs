using System;
using System.Linq;
using PST.Declarations.Entities;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.Providers;

namespace PST.Api.Core.OAuth
{
    public class ApplicationUserValidator : ApplicationUserValidatorBase
    {
        private readonly IEntityRepository _entityRepository;

        public ApplicationUserValidator(IEntityRepository entityRepository)
        {
            _entityRepository = entityRepository;
        }

        protected override bool IsDuplicated(string username, Guid? id = null)
        {
            var isDuplicate = _entityRepository.Queryable<Account>()
                .Where(x => x.Username.ToLowerInvariant() == username);
            
            if(id.HasValue)
                isDuplicate = isDuplicate.Where(x => x.ID != id);
            
            return isDuplicate
                .Where(ApplicationUserStore.AccountIsActive)
                .Any();
        }
    }
}