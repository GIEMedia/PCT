using System.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using PST.Api.Core.App_Start;
using Microsoft.Practices.Unity.Mvc;
using Prototype1.Foundation;
using Prototype1.Foundation.Unity;
using Prototype1.Migration;
using PST.Declarations;

namespace PST.Api
{
    public class MvcApplication : MvcApplicationBase
    {
        public static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["PST"].ConnectionString;
        
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

        private static void RunDatabaseMigrations()
        {
            if (ConfigurationManager.AppSettings["EnableDBMigrations"].ToBool(true))
            {
                MigrationManager.MigrateToLatest(ConnectionString, "PST.Migrations");
            }
        }
    }
}
