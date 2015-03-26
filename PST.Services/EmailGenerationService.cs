using System;
using System.Configuration;
using System.Dynamic;
using System.Web;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.EmailTemplates;
using Prototype1.Foundation.Interfaces;
using Prototype1.Foundation.Providers;
using PST.Api.Core.OAuth;
using PST.Declarations.Interfaces;

namespace PST.Services
{
    public class EmailGenerationService : ResetPasswordProviderBase<ApplicationUser>, IEmailGenerationService
    {
        private readonly IEntityRepository _entityRepository;
        private readonly IMailService _mailService;
        private static readonly string BaseUrl = ConfigurationManager.AppSettings["BaseUrl"];
        private static readonly string EmailFrom = ConfigurationManager.AppSettings["EmailFrom"];

        public EmailGenerationService(IEntityRepository entityRepository, IMailService mailService, Func<UserManager<ApplicationUser>> userManagerFactory)
            : base(userManagerFactory)
        {
            _entityRepository = entityRepository;
            _mailService = mailService;
        }

        public string ForgotPassword(string username, bool management, bool textOnly)
        {
            var user = this.UserManagerFactory().FindByName(username);
            return ForgotPassword(user, management, textOnly);
        }

        private string ForgotPassword(ApplicationUser user, bool management, bool textOnly)
        {
            dynamic forgot = new ExpandoObject();
            forgot.BrowserUrl = string.Format("{0}/EmailTemplate/ForgotPassword/{1}?management={2}", BaseUrl,
                HttpUtility.UrlEncode(user.UserName.Base64StringEncode()), management);
            var urlFormat = management
                ? "{0}/Management#/app/accounts/forgotpassword?u={1}&t={2}"
                : "{0}/#forgotpassword?u={1}&t={2}";
            forgot.NewPasswordUrl = string.Format(urlFormat, BaseUrl,
                HttpUtility.UrlEncode(user.UserName), HttpUtility.UrlEncode(this.GeneratePasswordResetToken(user)));
            forgot.Name = user.FirstName;

            //return EmailTemplateProvider.Apply(forgot, "ForgotPassword" + (textOnly ? ".TextOnly" : ""));
            return forgot.NewPasswordUrl;
        }

        protected override IdentityResult SendForgotPasswordEmail(ApplicationUser user, bool management)
        {
            var html = ForgotPassword(user, management, false);
            var text = ForgotPassword(user, management, true);

            const string subject = "PCT Forgotten Password";

            _mailService.SendEmail(user.Email, EmailFrom, subject, htmlBody: html, textOnlyBody: text);

            return IdentityResult.Success;
        }
    }
}