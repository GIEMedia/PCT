using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using PST.Api.Core.App_Start;
using PST.Api.Core.OAuth;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;
using PST.Services;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.Providers;
using WebGrease.Css.Extensions;
using ChallengeResult = Prototype1.Foundation.Results.ChallengeResult;

namespace PST.Api.Controllers
{
    /// <summary>
    /// Manage user account information
    /// </summary>
    [Authorize]
    [RoutePrefix("api/account")]
    public class AccountController : ApiControllerBase
    {
        private readonly Func<UserManager<ApplicationUser>> _userManagerFactory;
        private readonly EmailGenerationService _resetPasswordProvider;
        private readonly IEntityRepository _entityRepository;
        private readonly Lazy<ICourseService> _courseService;
        private readonly Lazy<ICertificateService> _cetificateService;

        public AccountController(Func<UserManager<ApplicationUser>> userManagerFactory,
            EmailGenerationService resetPasswordProvider, IEntityRepository entityRepository,
            Lazy<UserManager<ApplicationUser>> userManager, Lazy<ICourseService> courseService,
            Lazy<ICertificateService> cetificateService)
            : base(userManager)
        {
            _userManagerFactory = userManagerFactory;
            _resetPasswordProvider = resetPasswordProvider;
            _entityRepository = entityRepository;
            _courseService = courseService;
            _cetificateService = cetificateService;
        }

        #region Account Access & Login Management

        /// <summary>
        /// Log a user out of the system
        /// </summary>
        [HttpDelete]
        [Route("logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return StatusCode(HttpStatusCode.NoContent);
        }

        /// <summary>
        /// Retrieve a user's account information
        /// </summary>
        /// <returns>account</returns>
        [HttpGet]
        [Route]
        public async Task<account> Get()
        {
            try
            {
                var result = await _userManagerFactory().FindByIdAsync(User.Identity.GetUserId());
                return result;
            }
            catch (ArgumentException ex)
            {
                ModelState.AddModelError("", "Username not found.");
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }
        }

        /// <summary>
        /// Update a user's account information
        /// </summary>
        /// <param name="account">Updated account information</param>
        /// <returns>HTTP Response</returns>
        [HttpPut]
        [Route]
        public async Task<IHttpActionResult> Put(account account)
        {
            try
            {
                var result = await _userManagerFactory().UpdateAsync(account);
                return GetErrorResult(result) ?? StatusCode(HttpStatusCode.NoContent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest("Username not found.");
            }
        }

        /// <summary>
        /// Create a new user account
        /// </summary>
        /// <param name="registration">Registration information for a new account</param>
        /// <returns>HTTP Response</returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("register")]
        public async Task<IHttpActionResult> PostRegister(registration registration)
        {
            var result = await _userManagerFactory().CreateAsync(registration, registration.password);
            return GetErrorResult(result) ?? StatusCode(HttpStatusCode.NoContent);
        }

        /// <summary>
        /// Create a new user account using external authentication
        /// </summary>
        /// <param name="registration_external">Registration information for a new account</param>
        /// <returns>HTTP Response</returns>
        [HttpPost]
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("register_external")]
        public async Task<IHttpActionResult> PostRegisterExternal(registration_external registration_external)
        {
            var externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);
            if (externalLogin == null)
                return BadRequest("Username not found.");

            var user = new ApplicationUser
            {
                UserName = registration_external.username
            };

            var result = await _userManagerFactory().CreateAsync(user);
            if (!result.Succeeded)
                return GetErrorResult(result);

            result = await _userManagerFactory().AddLoginAsync(user.Id,
                new UserLoginInfo(externalLogin.LoginProvider, externalLogin.ProviderKey));
            return GetErrorResult(result) ?? StatusCode(HttpStatusCode.NoContent);
        }

        /// <summary>
        /// Logs in user using external authentication
        /// </summary>
        /// <param name="provider">Provider name</param>
        /// <param name="error">Error redirect url</param>
        /// <returns>HTTP Response</returns>
        [HttpGet]
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("external_login", Name = "external_login")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            if (error != null)
                return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));

            if (!User.Identity.IsAuthenticated)
                return new ChallengeResult(provider, this);

            var externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);
            if (externalLogin == null)
                return BadRequest("Username not found.");

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            var user = await _userManagerFactory().FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
                externalLogin.ProviderKey));

            if (user != null)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                var oAuthIdentity = await _userManagerFactory().CreateIdentityAsync(user,
                    OAuthDefaults.AuthenticationType);
                var cookieIdentity = await _userManagerFactory().CreateIdentityAsync(user,
                    CookieAuthenticationDefaults.AuthenticationType);
                var properties = ApplicationOAuthProvider.CreateProperties(user.UserName);
                Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
            }
            else
            {
                var claims = externalLogin.GetClaims();
                var identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                Authentication.SignIn(identity);
            }
            return StatusCode(HttpStatusCode.NoContent);
        }

        /// <summary>
        /// Returns list of supported external login providers
        /// </summary>
        /// <param name="returnUrl">Return Url</param>
        /// <returns>List of external_login</returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("list_external_logins")]
        public IEnumerable<external_login> GetListExternalLogins(string returnUrl)
        {
            var descriptions = Authentication.GetExternalAuthenticationTypes();
            var state = RandomOAuthStateGenerator.Generate(256);

            return descriptions.Select(description => new external_login
            {
                name = description.Caption,
                url = Url.Route("external_login", new
                {
                    provider = description.AuthenticationType,
                    response_type = "token",
                    client_id = AuthConfig.PublicClientId,
                    redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                    state = state
                }),
                state = state
            }).ToList();
        }

        /// <summary>
        /// Adds external login to user's account
        /// </summary>
        /// <param name="externalAccessToken">External login acces token</param>
        /// <returns>HTTP Response</returns>
        [HttpPut]
        [Route("add_external_login")]
        public async Task<IHttpActionResult> PutExternalLogin(string externalAccessToken)
        {
            if (string.IsNullOrEmpty(externalAccessToken))
                return BadRequest("ExternalAccessToken cannot be empty.");

            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var ticket = AuthConfig.OAuthOptions.AccessTokenFormat.Unprotect(externalAccessToken);

            if (ticket == null || ticket.Identity == null || (ticket.Properties != null
                                                              && ticket.Properties.ExpiresUtc.HasValue
                                                              &&
                                                              ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
            {
                return BadRequest("External login failure.");
            }

            var externalData = ExternalLoginData.FromIdentity(ticket.Identity);
            if (externalData == null)
                return BadRequest("The external login is already associated with an account.");

            var result =
                await
                    _userManagerFactory()
                        .AddLoginAsync(User.Identity.GetUserId(),
                            new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));
            return GetErrorResult(result) ?? StatusCode(HttpStatusCode.NoContent);
        }

        /// <summary>
        /// Removes external login from user's account
        /// </summary>
        /// <param name="loginProvider">External login provider name</param>
        /// <param name="providerKey">External login provider key</param>
        /// <returns>HTTP Response</returns>
        [HttpDelete]
        [Route("remove_external_login")]
        public async Task<IHttpActionResult> DeleteExternalLogin(string loginProvider, string providerKey)
        {
            if (string.IsNullOrEmpty(loginProvider) || string.IsNullOrEmpty(providerKey))
                return BadRequest("Invalid external login information.");

            var result =
                await
                    _userManagerFactory()
                        .RemoveLoginAsync(User.Identity.GetUserId(), new UserLoginInfo(loginProvider, providerKey));
            return GetErrorResult(result) ?? StatusCode(HttpStatusCode.NoContent);
        }

        [HttpPost]
        [Route("change_password")]
        public async Task<IHttpActionResult> ChangePassword(change_password change_password)
        {
            try
            {
                var result = await _userManagerFactory().ChangePasswordAsync(User.Identity.GetUserId(),
                    change_password.old_password, change_password.new_password);
                return GetErrorResult(result) ?? StatusCode(HttpStatusCode.NoContent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest("Username not found.");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("forgot_password")]
        public async Task<IHttpActionResult> ForgotPassword(string username, bool management = false)
        {
            try
            {
                var result = _resetPasswordProvider.ForgotPassword(username, management);
                return GetErrorResult(result) ?? StatusCode(HttpStatusCode.NoContent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest("Username not found.");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("reset_password")]
        public async Task<IHttpActionResult> ResetPassword(reset_password reset_password)
        {
            try
            {
                var result = _resetPasswordProvider.ResetPassword(reset_password.username, reset_password.security_key,
                    reset_password.new_password);
                return GetErrorResult(result) ?? StatusCode(HttpStatusCode.NoContent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest("Username not found.");
            }
        }

        [HttpDelete]
        [Route("{account_id}")]
        public void ToggleAccountStatus(string account_id)
        {
            Guid accountID;
            
            if (!Guid.TryParse(account_id, out accountID)) return;
            
            var account = _entityRepository.GetByID<Account>(accountID);
            if (account == null) return;

            account.Status = account.Status == AccountStatus.Closed
                ? AccountStatus.None
                : AccountStatus.Closed;

            _entityRepository.Save(account);
        }

        [HttpGet]
        [Route("{account_id}")]
        public account_detailed GetAccountByID(string account_id)
        {
            Guid accountID;

            if (!Guid.TryParse(account_id, out accountID)) return null;

            var account = _entityRepository.GetByID<Account>(accountID);
            var accountDetailed = new account_detailed
            {
                account = account
            };

            return accountDetailed;
        }

        #endregion

        #region Courses, Certificates, Managers & Licensure

        [HttpGet]
        [Route("courses")]
        public course_overview[] OpenCourses()
        {
            var courseProgress = _courseService.Value.OpenCourses(CurrentUserID);
            return (from cp in courseProgress
                let c = cp.Course
                from sp in c.Sections
                select new course_overview
                {
                    course_id = c.ID,
                    title = c.Title,
                    description =
                        "CEUs Available: " +
                        c.StateCEUs.OrderBy(x => x.StateAbbr).Select(x => x.StateAbbr).Aggregate((i, j) => i + "," + j),
                    course_progress = cp.Sections.Count(s => s.Passed)/(decimal) cp.TotalSections,
                    test_progress = cp.TestProgress.CompletedQuestions.Count/(decimal) cp.TestProgress.TotalQuestions,
                    last_activity = cp.LastActivityUtc.ToTimeZone(CurretUserTimeZoneInfo)
                }).ToArray();
        }

        [HttpGet]
        [Route("certificates")]
        public certificate[] GetCertificates()
        {
            return new certificate[0];
        }

        [HttpGet]
        [Route("certificate/{courseID}")]
        public certificate GetCertificate(Guid courseID)
        {
            return new certificate();
        }

        [HttpGet]
        [Route("managers")]
        public manager[] GetManagers()
        {
            //TODO: Refactor to account service
            return (from a in _entityRepository.Queryable<Account>()
                where a.ID == CurrentUserID
                from m in a.Managers
                select (manager) m).ToArray();
        }

        [HttpPut]
        [Route("managers")]
        public void UpdateManagers(manager[] managers)
        {
            //TODO: Refactor to account service
            var account = _entityRepository.GetByID<Account>(CurrentUserID);
            account.Managers.Clear();
            managers.ForEach(m => account.Managers.Add(m));
            _entityRepository.Save(account);
        }

        [HttpGet]
        [Route("licensures")]
        public state_licensure[] GetLicensures()
        {
            //TODO: Refactor to account service
            return (from a in _entityRepository.Queryable<Account>()
                where a.ID == CurrentUserID
                from s in a.StateLicensures
                select (state_licensure) s).ToArray();
        }

        [HttpPut]
        [Route("licensures")]
        public void UpdateLicensure(state_licensure[] licensures)
        {
            //TODO: Refactor to account service
            var account = _entityRepository.GetByID<Account>(CurrentUserID);
            account.StateLicensures.Clear();
            licensures.ForEach(l => account.StateLicensures.Add(l));
            _entityRepository.Save(account);
        }

        #endregion

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
                return BadRequest();

            if (result.Succeeded)
                return StatusCode(HttpStatusCode.NoContent);

            if (result.Errors != null)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error);
                }
            }

            if (ModelState.IsValid)
            {
                // No ModelState errors are available to send, so just return an empty BadRequest.
                return BadRequest();
            }

            return BadRequest(ModelState);
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; private set; }
            public string ProviderKey { get; private set; }
            private string UserName { get; set; }

            public IEnumerable<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                var providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static readonly RandomNumberGenerator Random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                var strengthInBytes = strengthInBits / bitsPerByte;

                var data = new byte[strengthInBytes];
                Random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion
    }
}
