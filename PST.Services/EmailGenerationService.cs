using System;
using System.Configuration;
using System.Dynamic;
using System.Net;
using System.Web;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation;
using Prototype1.Foundation.Interfaces;
using Prototype1.Foundation.Providers;
using Prototype1.Security;
using PST.Api.Core.OAuth;
using PST.Declarations;
using PST.Declarations.Interfaces;

namespace PST.Services
{
    public class EmailGenerationService : ResetPasswordProviderBase<ApplicationUser>, IEmailGenerationService
    {
        private readonly IMailService _mailService;
        private static readonly string BaseUrl = MvcApplicationBase.BaseUrl;
        private static readonly string EmailFrom = ConfigurationManager.AppSettings["EmailFrom"];

        public EmailGenerationService(IMailService mailService, Func<UserManager<ApplicationUser>> userManagerFactory)
            : base(userManagerFactory)
        {
            _mailService = mailService;
        }

        public string ForgotPassword(string username, bool management, bool textOnly)
        {
            var user = UserManagerFactory().FindByName(username);
            return ForgotPassword(user, management, textOnly);
        }

        private string ForgotPassword(ApplicationUser user, bool management, bool textOnly)
        {
            dynamic forgot = new ExpandoObject();
            forgot.BaseUrl = BaseUrl;
            forgot.BrowserUrl = string.Format("{0}/EmailTemplate/ForgotPassword?u={1}&management={2}", BaseUrl,
                HttpUtility.UrlEncode(user.UserName.Base64StringEncode()), management);
            forgot.NewPasswordUrl = string.Format("{0}/#/forgotpassword?u={1}&t={2}", BaseUrl,
                HttpUtility.UrlEncode(user.UserName), HttpUtility.UrlEncode(GeneratePasswordResetToken(user)));
            forgot.Name = user.FirstName;

            var html = RazorTemplateProvider.Apply(forgot, "ForgotPassword" + (textOnly ? ".TextOnly" : ""));
            return PreMailer.Net.PreMailer.MoveCssInline(html).Html;
        }

        protected override IdentityResult SendForgotPasswordEmail(ApplicationUser user, bool management)
        {
            var html = ForgotPassword(user, management, false);
            var text = ForgotPassword(user, management, true);

            const string subject = "PCT Forgotten Password";

            _mailService.SendEmail(user.Email, EmailFrom, subject, htmlBody: html, textOnlyBody: text);

            return IdentityResult.Success;
        }

        public string ManagerNotification(string name, string courseTitle, Guid certificateID)
        {
            dynamic review = new ExpandoObject();
            review.BaseUrl = BaseUrl;
            review.BrowserUrl = string.Format("{0}/EmailTemplate/ManagerNotification/{3}?name={1}&title={2}",
                BaseUrl, WebUtility.UrlEncode(name), WebUtility.UrlEncode(courseTitle), certificateID);
            review.Name = name;
            review.CourseTitle = courseTitle;
            review.CertificateImage = CertificateService.GetCertificateImageUrl(certificateID);
            review.CertificatePdf = CertificateService.GetCertificatePdfUrl(certificateID);

            var html = RazorTemplateProvider.Apply(review, "ManagerNotification");
            return PreMailer.Net.PreMailer.MoveCssInline(html).Html;
        }

        public string ReviewCourse(string name, string email, Guid courseID, string courseTitle)
        {
            var token = WebUtility.UrlEncode(ReversableToken.Tokenize(courseID.ToString()));

            dynamic review = new ExpandoObject();
            review.BaseUrl = BaseUrl;
            review.BrowserUrl = string.Format("{0}/EmailTemplate/ReviewCourse/{4}?name={1}&email={2}&title={3}",
                BaseUrl, WebUtility.UrlEncode(name), WebUtility.UrlEncode(email), WebUtility.UrlEncode(courseTitle),
                courseID);
            review.ReviewerName = name;
            review.CourseTitle = courseTitle;
            review.CourseReviewUrl = string.Format("{0}/#/course/{1}/preview?token={2}", BaseUrl, courseID, token);
            review.TestReviewUrl = string.Format("{0}/#/test/{1}/preview?token={2}", BaseUrl, courseID, token);

            var html = RazorTemplateProvider.Apply(review, "ReviewCourse");
            return PreMailer.Net.PreMailer.MoveCssInline(html).Html;
        }
    }
}