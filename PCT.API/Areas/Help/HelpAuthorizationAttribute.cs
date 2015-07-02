using System.Web.Mvc;

namespace PCT.Api.Areas.Help
{
    public class HelpAuthorizationAttribute : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectResult("/Help/Login");
        }
    }
}