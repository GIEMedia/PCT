using System;
using System.Threading.Tasks;
using PST.Declarations.Interfaces;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.OAuth;
using Prototype1.Foundation;
using Prototype1.Foundation.Models;
using Prototype1.Foundation.Providers;

namespace PST.Api.Core.OAuth
{
    public class ApplicationOAuthProvider : ApplicationOAuthProviderBase<ApplicationUser>
    {
        public ApplicationOAuthProvider(string publicClientId, Func<UserManager<ApplicationUser>> userManagerFactory)
            : base(publicClientId, userManagerFactory)
        {
        }
    }
}