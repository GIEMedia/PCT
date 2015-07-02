using System;
using System.Web.Mvc;
using PCT.Services;
using Prototype1.Foundation;

namespace PCT.Api.Controllers
{
    public class HomeController : WebControllerBase
    {
        private readonly Lazy<EmailGenerationService> _emailGenerationService;

        public HomeController(Lazy<EmailGenerationService> emailGenerationService)
        {
            _emailGenerationService = emailGenerationService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetIP()
        {
            const string url = "http://checkip.dyndns.org";
            var req = System.Net.WebRequest.Create(url);
            using(var resp = req.GetResponse())
            using (var sr = new System.IO.StreamReader(resp.GetResponseStream()))
                return Content(sr.ReadToEnd().Trim());
        }

        private bool IsSocialMediaCrawler()
        {
            return Request.UserAgent.StartsWith(
                StringComparison.CurrentCultureIgnoreCase,
                "facebookexternalhit",
                "Twitterbot",
                "Google");
        }
    }
}