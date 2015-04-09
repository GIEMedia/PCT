using System;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation;
using Prototype1.Foundation.Unity;
using Microsoft.Practices.Unity;
using Prototype1.Security;
using PST.Api.Core.OAuth;
using PST.Declarations;

namespace PST.Api.Core
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class AdminOrTokenAuthorizationAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            if (base.IsAuthorized(actionContext))
            {
                var principal = HttpContext.Current.User;
                if (principal != null && principal.Identity.IsAuthenticated)
                {
                    Guid loggedInGuid;
                    if (Guid.TryParse(principal.Identity.GetUserId(), out loggedInGuid))
                    {
                        var userManager = Container.Instance.Resolve<UserManager<ApplicationUser>>();
                        var user = userManager.FindById(loggedInGuid.ToString());
                        if (user != null && user.AdminAccess == AdminAccess.System)
                            return true;
                    }
                }
            }

            string token;
            var query = actionContext.Request.GetQueryNameValuePairs().ToDictionary(q=>q.Key, q=>q.Value);
            
            if (!query.TryGetValue("token", out token) || token.IsNullOrEmpty()) return false;

            try
            {
                var detokenized = ReversableToken.DeTokenize(token);
                return !detokenized.IsNullOrEmpty();
            }
            catch
            {
                return false;
            }
        }
    }
}