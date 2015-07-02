using Microsoft.Owin;
using Owin;
using PCT.Api.Core.App_Start;

[assembly: OwinStartupAttribute(typeof(PCT.Api.Startup))]
namespace PCT.Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            new AuthConfig().ConfigureAuth(app);
        }
    }
}