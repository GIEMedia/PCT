using System;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation.Providers;

namespace PCT.Api.Core.OAuth
{
    public class ApplicationOAuthProvider : ApplicationOAuthProviderBase<ApplicationUser>
    {
        public ApplicationOAuthProvider(string publicClientId, Func<UserManager<ApplicationUser>> userManagerFactory)
            : base(publicClientId, userManagerFactory)
        {
        }
    }
}