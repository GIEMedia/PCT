﻿using System;
using PST.Api.Core.OAuth;
using PST.Declarations.Interfaces;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Practices.Unity;
using Owin;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.Unity;

namespace PST.Api.Core.App_Start
{
    public class AuthConfig
    {
        static AuthConfig()
        {
            PublicClientId = "self";

            UserManagerFactory = Container.Instance.Resolve<Func<UserManager<ApplicationUser>>>();
            var invitationService = Container.Instance.Resolve<Lazy<IInvitationService>>();

            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/api/account/login"),
                Provider = new ApplicationOAuthProvider(PublicClientId, UserManagerFactory, invitationService),
                AuthorizeEndpointPath = new PathString("/api/account/external_login"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                AllowInsecureHttp = true
            };
        }

        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static Func<UserManager<ApplicationUser>> UserManagerFactory { get; set; }

        public static string PublicClientId { get; private set; }

        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);

            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            app.UseOAuthBearerTokens(OAuthOptions);



            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");

            //app.UseFacebookAuthentication(
            //   appId: "",
            //   appSecret: "");

            //app.UseGoogleAuthentication();
        }
    }
}