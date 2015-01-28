using Microsoft.Owin;
using Owin;
using PST.Api.Core.App_Start;

[assembly: OwinStartupAttribute(typeof(PST.Api.Startup))]
namespace PST.Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            new AuthConfig().ConfigureAuth(app);
        }
    }
}