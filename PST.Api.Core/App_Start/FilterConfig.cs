using System.Web.Mvc;
using Prototype1.Foundation.Web;

namespace PST.Api.Core.App_Start
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new ConfigurableRequireHttpsAttribute());
        }
    }
}
