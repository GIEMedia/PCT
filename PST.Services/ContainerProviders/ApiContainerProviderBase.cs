using PST.Api.Core.OAuth;
using PST.Data;
using Microsoft.AspNet.Identity;
using Microsoft.Practices.Unity;
using Prototype1.Foundation.Data.MagicMapper;
using Prototype1.Foundation.Data.NHibernate;
using PST.Declarations.Interfaces;
using PasswordHasher = Microsoft.AspNet.Identity.PasswordHasher;

namespace PST.Services.ContainerProviders
{
    public abstract class ApiContainerProviderBase : Prototype1.Services.ContainerProviders.ApiContainerProviderBase
    {
        protected override void RegisterEnvironmentSpecificImplementations(IUnityContainer container)
        {
            container
                .RegisterType<IAutoMaps, AutoMaps>(new ContainerControlledLifetimeManager())
                .RegisterType<IEmailGenerationService, EmailGenerationService>()
                .RegisterType<UserManager<ApplicationUser>>(new PerRequestLifetimeManager(),
                    new InjectionFactory(c => new UserManager<ApplicationUser>(c.Resolve<ApplicationUserStore>())
                    {
                        PasswordHasher = new PasswordHasher(),
                        UserValidator = new ApplicationUserValidator(c.Resolve<IEntityRepository>()),
                        PasswordValidator = new MinimumLengthValidator(5)
                    }))
                .RegisterType<ICourseService, CourseService>(new ContainerControlledLifetimeManager())
                .RegisterType<ICertificateService, CertificateService>(new ContainerControlledLifetimeManager())
                .RegisterType<IUploadService, UploadService>(new ContainerControlledLifetimeManager())
                ;
        }
    }
}