using System;
using System.Configuration;
using Microsoft.Practices.Unity;
using Prototype1.Foundation;
using Prototype1.Foundation.Logging;
using Prototype1.Foundation.Unity;

namespace PCT.Declarations
{
    public class MvcApplicationBase : System.Web.HttpApplication
    {
        private static string _baseUrl;

        public static string BaseUrl
        {
            get
            {
                if (_baseUrl == null)
                {
                    _baseUrl = ConfigurationManager.AppSettings["BaseUrl"];
                    if (_baseUrl.EndsWith("/"))
                        _baseUrl = _baseUrl.Remove(_baseUrl.Length - 1);
                }
                return _baseUrl;
            }
        }

        private static string _websiteHost;

        public static string WebsiteHost
        {
            get
            {
                if (_websiteHost == null)
                {
                    var baseUrl = new Uri(BaseUrl);
                    _websiteHost = baseUrl.Host + (!baseUrl.Port.In(80, 443) ? ":" + baseUrl.Port : "");
                }
                return _websiteHost;
            }
        }

        protected MvcApplicationBase()
        {
            Error += Application_Error;
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            var ex = Server.GetLastError();

            if (ex == null ||
                ex.Message.StartsWith(StringComparison.CurrentCultureIgnoreCase,
                    "File", "The file ", "A public action method", "A potentially dangerous", "The controller for path") ||
                ex.StackTrace.Contains("CheckSuspiciousPhysicalPath") ||
                ex.StackTrace.Contains("System.Web.CachedPathData.ValidatePath(String physicalPath)"))
                return;

            Container.Instance.Resolve<IExceptionLogger>().LogException(ex, "Unhandled Exception");
        }
    }
}