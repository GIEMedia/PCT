using System;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace PST.Api.Controllers
{
    public abstract class WebControllerBase : Controller
    {
        private Guid? _currentUserID;

        protected Guid CurrentUserID
        {
            get
            {
                if (!_currentUserID.HasValue)
                {
                    if (HttpContext == null)
                        throw new NullReferenceException("HttpContext cannot be null.");

                    Guid currentUserID;
                    var principal = HttpContext.User;
                    if (principal == null || principal.Identity == null ||
                        !Guid.TryParse(principal.Identity.GetUserId(), out currentUserID))
                        return Guid.Empty;
                    _currentUserID = currentUserID;
                }
                return _currentUserID.Value;
            }
        } 
    }
}