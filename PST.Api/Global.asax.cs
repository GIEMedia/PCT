using System;
using System.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using PST.Api.Core.App_Start;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Mvc;
using Prototype1.Foundation;
using Prototype1.Foundation.Logging;
using Prototype1.Foundation.Unity;
using Prototype1.Migration;

namespace PST.Api
{
    public class MvcApplication : System.Web.HttpApplication
    {
        private static string _websiteHost;

        public static string WebsiteHost
        {
            get
            {
                if (_websiteHost == null)
                {
                    var baseUrl = new Uri(ConfigurationManager.AppSettings["BaseUrl"]);
                    _websiteHost = baseUrl.Host + (!baseUrl.Port.In(80, 443) ? ":" + baseUrl.Port : "");
                }
                return _websiteHost;
            }
        }

        protected string ControllerNamespace;

        private readonly string _connectionString = ConfigurationManager.ConnectionStrings["PST"].ConnectionString;

        protected MvcApplication()
        {
            Error += Application_Error;
        }

        protected void Application_Start()
        {
            DependencyResolver.SetResolver(new UnityDependencyResolver(Container.Instance));
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes, this.GetType().BaseType);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            CacheConfig.RegisterCacheDependencies();
            RunDatabaseMigrations();
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            var ex = Server.GetLastError();
            
            // Ignore missing files errors ("File dos not exist.")
            if (ex == null || ex.Message.StartsWith("File") || ex.Message.StartsWith("A potentially dangerous")) return;

            var logger = Container.Instance.Resolve<IExceptionLogger>();
            logger.LogException(ex, "Unhandled Exception");
        }

        private void RunDatabaseMigrations()
        {
            if (ConfigurationManager.AppSettings["EnableDBMigrations"].ToBool(true))
            {
                MigrationManager.MigrateToLatest(_connectionString, "PST.Migrations");
            }
        }
    }
}
