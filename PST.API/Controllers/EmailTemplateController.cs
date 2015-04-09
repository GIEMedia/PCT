using System;
using System.Net;
using System.Web.Mvc;
using Prototype1.Foundation;
using PST.Declarations.Interfaces;

namespace PST.Api.Controllers
{
    public class EmailTemplateController : WebControllerBase
    {
        private readonly IEmailGenerationService _emailGenerationService;

        public EmailTemplateController(IEmailGenerationService emailGenerationService)
        {
            _emailGenerationService = emailGenerationService;
        }

        public ActionResult ReviewCourse(Guid id, string name, string email, string title)
        {
            if (id.IsNullOrEmpty())
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "A course id was not supplied.");

            return Content(_emailGenerationService.ReviewCourse(name, email, id, title));
        }

        public ActionResult ForgotPassword(string u, bool management = false, bool textOnly = false)
        {
            string username;
            if (!u.TryBase64StringDecode(out username))
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "A valid username was not supplied.");

            return Content(_emailGenerationService.ForgotPassword(username, management, textOnly));
        }
    }
}