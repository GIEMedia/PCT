using System.Web;
using System.Web.Optimization;

namespace PST.Api
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations =
                !HttpContext.Current.IsDebuggingEnabled
                || System.Configuration.ConfigurationManager.AppSettings["OnServer"] == "true";

            bundles.UseCdn = false;

            
        }
    }
}