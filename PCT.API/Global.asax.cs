using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using PCT.Api.Core.App_Start;
using Microsoft.Practices.Unity.Mvc;
using Prototype1.Foundation;
using Prototype1.Foundation.Unity;
using Prototype1.Migration;
using PCT.Declarations;

namespace PCT.Api
{
    public class MvcApplication : MvcApplicationBase
    {
        public static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["PCT"].ConnectionString;
        
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
                MigrationManager.MigrateToLatest(ConnectionString, "PCT.Migrations");
            }
        }

        private static DateTime _htmlVersionLastUpdated = DateTime.MinValue;
        private static int _htmlVersion;
        private static readonly object _htmlLockObject = new object();
        public static int HtmlVersion
        {
            get
            {
                if (_htmlVersionLastUpdated > DateTime.Now.AddMinutes(-5))
                    return _htmlVersion;
                lock (_htmlLockObject)
                {
                    _htmlVersion =
                        new DirectoryInfo(HostingEnvironment.MapPath("~/")).GetFiles("*.htm*",
                            SearchOption.AllDirectories).Max(f => f.LastWriteTime).GetHashCode();
                    _htmlVersionLastUpdated = DateTime.Now;
                }
                return _htmlVersion;
            }
        }

        private static readonly int _idleDurationSecs = ConfigurationManager.AppSettings["IdleDurationSecs"].ToInt(60*5);
        public static int IdleDurationSecs => _idleDurationSecs;
    }
}
