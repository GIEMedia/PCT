using System;
using System.Web.Http;
using System.Web.Mvc;
using PST.Api.Areas.HelpPage.Models;

namespace PST.Api.Areas.HelpPage.Controllers
{
    /// <summary>
    /// The controller that will handle requests for the help page.
    /// </summary>
    public class HelpController : Controller
    {
        public HelpController()
        {
            Configuration = GlobalConfiguration.Configuration;
        }

        public HttpConfiguration Configuration { get; private set; }

        public ActionResult Index()
        {
            return View(Configuration.Services.GetApiExplorer().ApiDescriptions);
        }

        public ActionResult Api(string apiId)
        {
            if (!String.IsNullOrEmpty(apiId))
            {
                HelpPageApiModel apiModel = Configuration.GetHelpPageApiModel(apiId);
                if (apiModel != null)
                {
                    return PartialView(apiModel);
                }
            }

            return PartialView("Error");
        }
    }
}