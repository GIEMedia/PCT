using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Validation;
using System.Web.Mvc;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using NHibernate;
using Prototype1.Foundation;
using Prototype1.Foundation.ActionFilters;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.Unity;
using Prototype1.Foundation.Validation;
using Prototype1.Foundation.Web.Mvc;
using Prototype1.Services.Logging;

namespace PST.Api.Core.App_Start
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            GlobalConfiguration.Configuration.Formatters.XmlFormatter.UseXmlSerializer = false;

            var formatters = GlobalConfiguration.Configuration.Formatters;
            formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            formatters.JsonFormatter.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            //foreach (var formatter in formatters.Where(x => x != formatters.JsonFormatter && x != formatters.XmlFormatter).ToArray())
            //{
            //    formatters.Remove(formatter);
            //}

            foreach (var formatter in formatters.Where(x => x != formatters.JsonFormatter).ToArray())
            {
                formatters.Remove(formatter);
            }

            config.DependencyResolver = new DependencyContainer();
            config.Services.Replace(typeof(IBodyModelValidator), new BodyModelValidator(config.DependencyResolver));
            config.Services.Add(typeof(IExceptionLogger), new ApiExceptionLogger(config.DependencyResolver));
            
            Container.Instance.ResolveAll<DelegatingHandler>().Apply(config.MessageHandlers.Add);
            CacheConfig.RegisterCacheDependencies();

            config.Filters.Add(new ValidateModelAttribute());

            InitSessionFactory();

            // Map the areas first
            AreaRegistration.RegisterAllAreas();

            // Web API routes
            config.MapHttpAttributeRoutes();
        }

        [Obsolete]
        private static void InitSessionFactory()
        {
            var sessionFactory = Container.Root.Resolve<ISessionFactoryFactory>().CreateSessionFactory("PST");
            Container.Root.RegisterInstance(sessionFactory, new ContainerControlledLifetimeManager());
            NHibernateSessionManager.Instance.InitSessionFactory(sessionFactory);
        }
    }
}
