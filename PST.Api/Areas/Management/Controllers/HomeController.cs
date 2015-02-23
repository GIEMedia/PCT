using System.Web.Mvc;
using PST.Api.Controllers;

namespace PST.Api.Areas.Management.Controllers
{
    public class HomeController : WebControllerBase
    {
        public HomeController()
        {
        }

        public ActionResult Index()
        {
            return View();
        }
    }
}