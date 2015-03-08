﻿using System.Web.Http;
using System.Web.Mvc;

namespace PST.Api.Areas.Help
{
    public class HelpAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Help";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Help_default",
                "Help/{controller}/{action}/{id}",
                new { controller = "Help", action = "Index", id = UrlParameter.Optional }
            );

            HelpConfig.Register(GlobalConfiguration.Configuration);
        }
    }
}