using System.Web.Mvc;
using PCT.Api.Controllers;

namespace PCT.Api.Areas.Management.Controllers
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