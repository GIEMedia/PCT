using PST.Api.Core.OAuth;
using Microsoft.AspNet.Identity;
using Microsoft.Practices.Unity;
using Prototype1.Foundation.Data.NHibernate;
using PST.Services.ContainerProviders;
using PasswordHasher = PST.Api.Core.OAuth.PasswordHasher;

namespace PST.Tests
{
    public class TestContainerProvider : ApiContainerProviderBase
    {
        protected override void RegisterEnvironmentSpecificImplementations(IUnityContainer container)
        {
            base.RegisterEnvironmentSpecificImplementations(container);

            container
                .RegisterType<UserManager<ApplicationUser>>(new HierarchicalLifetimeManager(),
                    new InjectionFactory(c => new UserManager<ApplicationUser>(c.Resolve<ApplicationUserStore>())
                    {
                        PasswordHasher = new PasswordHasher(),
                        UserValidator = new ApplicationUserValidator(c.Resolve<IEntityRepository>()),
                        PasswordValidator = new MinimumLengthValidator(5)
                    }))

                .RegisterType<IEntityRepository, TransientEntityRepository>(new HierarchicalLifetimeManager());
        }
    }
}