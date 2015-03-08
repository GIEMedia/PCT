using System;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Core.OAuth;
using PST.Data;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using Constants = PST.Api.Core.Constants;

namespace PST.Api.Controllers
{
    public class ApiControllerBase : ApiController
    {
        protected static readonly string BaseUrl = ConfigurationManager.AppSettings["BaseUrl"].Replace("http://", "//").Replace("https://", "//");
        private readonly Lazy<UserManager<ApplicationUser>> _userManager;

        protected ApiControllerBase()
        {
        }

        protected ApiControllerBase(Lazy<UserManager<ApplicationUser>> userManager)
        {
            _userManager = userManager;
        }

        private Guid? _currentUserID;

        protected Guid CurrentUserID
        {
            get
            {
                if (!_currentUserID.HasValue)
                {
                    if (HttpContext.Current == null)
                        return Constants.TestCurrentUserID;

                    Guid currentUserID;
                    var principal = HttpContext.Current.User;
                    if (principal == null || principal.Identity == null ||
                        !Guid.TryParse(principal.Identity.GetUserId(), out currentUserID))
                        return Guid.Empty;
                    _currentUserID = currentUserID;
                }
                return _currentUserID.Value;
            }
        }

        private Account _currentAccount;

        protected Account CurrentUser
        {
            get { return _currentAccount ?? (_currentAccount = _userManager.Value.FindById(CurrentUserID.ToString())); }
        }

        private static readonly TimeZoneInfo EasternStandardTime = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
        protected TimeZoneInfo CurretUserTimeZoneInfo
        {
            get
            {
                TimeZoneInfo timeZone;
                return TimeZones.TimeZonesByState.TryGetValue(CurrentUser.CompanyAddress.State, out timeZone)
                    ? timeZone
                    : EasternStandardTime;
            }
        }

        protected struct SetValue<TEntity, TProperty> where TEntity : EntityBase
        {
            public Expression<Func<TEntity, TProperty>> Property { get; set; }

            public TProperty Value { get; set; }

            public Func<TEntity, bool> Condition { get; set; }
        }
    }
}