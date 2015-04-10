using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http.Controllers;
using Prototype1.Foundation;
using Prototype1.Security;

namespace PST.Api.Core
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class AdminOrTokenAuthorizeAttribute : AdminAuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            if (base.IsAuthorized(actionContext)) return true;

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