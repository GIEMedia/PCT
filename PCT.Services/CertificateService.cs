using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web.Hosting;
using iTextSharp.text;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using PCT.Declarations;
using PCT.Declarations.Entities;
using PCT.Declarations.Interfaces;
using Font = iTextSharp.text.Font;

namespace PCT.Services
{
    public class CertificateService : ICertificateService
    {
        //private static readonly string TemplatePathUser =
        //    HostingEnvironment.MapPath("/Content/Certificates/Template/certificate_template_user.jpg");
        //private static readonly string TemplatePathState =
        //    HostingEnvironment.MapPath("/Content/Certificates/Template/certificate_template_state.jpg");
        //private static readonly string CertificatePath =
        //    HostingEnvironment.MapPath("/Content/Certificates/");

        private string _certificatePath;
        private string CertificatePath
        {
            get
            {
                _certificatePath = _certificatePath ?? HostingEnvironment.MapPath("/Content/Certificates/");
                return _certificatePath;
            }
        }

        private string _templatePathState;
        private string TemplatePathState
        {
            get
            {
                _templatePathState = _templatePathState ?? HostingEnvironment.MapPath("/Content/Certificates/Template/certificate_template_state.jpg");
                return _templatePathState;
            }
        }

        private string _templatePathUser;
        private string TemplatePathUser
        {
            get
            {
                _templatePathUser = _templatePathUser ?? HostingEnvironment.MapPath("/Content/Certificates/Template/certificate_template_user.jpg");
                return _templatePathUser;
            }
        }

        private readonly IEntityRepository _entityRepository;

        public CertificateService(IEntityRepository entityRepository)
        {
            _entityRepository = entityRepository;
        }

        public void SetPaths(string certificatePath, string templatePathUser, string templatePathState)
        {
            _templatePathUser = templatePathUser;
            _templatePathState = templatePathState;
            _certificatePath = certificatePath;
        }

        public IEnumerable<Certificate> GetCertificates(Guid accountID, Guid? courseID = null)
        {
            var certs = (from a in _entityRepository.Queryable<Account>()
                         where a.ID == accountID
                         from cp in a.CourseProgress
                             //group cp by cp.Course into g
                             //let cpa = g.OrderByDescending(x => x.Attempt).FirstOrDefault()
                         where cp.Certificate != null
                         //orderby cp.Course.DisplayTitle
                         select new { cp.Certificate, cp.Attempt }).ToList()
                .GroupBy(g => g.Certificate.Course)
                .Select(g => g.OrderByDescending(x => x.Attempt).FirstOrDefault());
            return (courseID.HasValue
                ? certs.Where(c => c.Certificate.Course.ID == courseID.Value)
                : certs)
                .Select(c => c.Certificate);
        }

        public void CreateCertificate(Account account, CourseProgress courseProgress, DateTime dateEarnedUtc)
        {
            var certificate = new Certificate { EarnedUtc = dateEarnedUtc };
            courseProgress.Certificate = certificate;
            _entityRepository.Save(courseProgress);

            CreateUserCertificate(certificate, account, courseProgress, dateEarnedUtc);

            var licensuresWithCEUs =
                account.StateLicensures.Where(
                    s => courseProgress.Course.StateCEUs.Any(ceu => ceu.StateAbbr == s.StateAbbr)).ToList();

            foreach (var licensure in licensuresWithCEUs)
                CreateStateCertificate(certificate, account, licensure, courseProgress, dateEarnedUtc);

            using (var document = new iTextSharp.text.Document())
            using (var stream = new FileStream(CertificatePath + certificate.ID + ".pdf",
                FileMode.Create, FileAccess.Write, FileShare.None))
            {
                document.SetPageSize(new iTextSharp.text.Rectangle(700, 570));
                iTextSharp.text.pdf.PdfWriter.GetInstance(document, stream);
                document.Open();

                // User Certificate
                document.SetPageSize(new iTextSharp.text.Rectangle(700, 570));
                using (var imageStream = new FileStream(CertificatePath + certificate.ID + "_user.jpg",
                    FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    var image = iTextSharp.text.Image.GetInstance(imageStream);
                    image.ScaleToFit(800f, 500f);
                    document.Add(image);
                }

                // State Certificates
                foreach (var licensure in licensuresWithCEUs)
                {
                    document.SetPageSize(new iTextSharp.text.Rectangle(2550, 3300));
                    using (
                        var imageStream =
                            new FileStream(CertificatePath + certificate.ID + "_state_" + licensure.ID + ".jpg",
                                FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                    {
                        var image = iTextSharp.text.Image.GetInstance(imageStream);
                        //image.ScaleToFit(800f, 500f);
                        document.Add(image);
                    }
                }

                document.Close();
            }
        }

        private void CreateUserCertificate(Certificate certificate, Account account, CourseProgress courseProgress, DateTime dateEarnedUtc)
        {
            var certTemplate = new Bitmap(TemplatePathUser);

            var g = Graphics.FromImage(certTemplate);
            g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;

            var alignCenter = new StringFormat
            {
                Alignment = StringAlignment.Center,
                LineAlignment = StringAlignment.Center
            };

            g.DrawString(account.FirstName + " " + account.LastName,
                new System.Drawing.Font("Javanese Text", 26), Brushes.Black, new RectangleF(0, 0, 1110, 797),
                alignCenter);
            var font = new System.Drawing.Font("Javanese Text", 26);
            var maxWidth = 1100f;
            if (CalculateLimitedWidth(courseProgress.Course.DisplayTitle, g, font, maxWidth))
            {
                g.DrawString(courseProgress.Course.DisplayTitle,
                    new System.Drawing.Font("Javanese Text", 26), Brushes.Black, new RectangleF(0, 0, maxWidth, 1000),
                    alignCenter);
            }
            else
            {
                DrawMultipleLines(courseProgress.Course.DisplayTitle, g, font, maxWidth, 445, alignCenter);
            }
            g.DrawString(dateEarnedUtc.ToLongDateString(),
                new System.Drawing.Font("Javanese Text", 21), Brushes.Black, new RectangleF(480, 515, 400, 100),
                alignCenter);
            g.DrawString(account.FirstName + " " + account.LastName,
                new System.Drawing.Font("Javanese Text", 18), Brushes.Black, new RectangleF(115, 630, 400, 100));
            g.DrawString(account.FirstName + " " + account.LastName,
                new System.Drawing.Font("Javanese Text", 18), Brushes.Black, new RectangleF(615, 630, 400, 100));

            float height = 690;
            foreach (var s in account.StateLicensures)
            {
                g.DrawString(s.StateAbbr,
                    new System.Drawing.Font("Javanese Text", 8), Brushes.Black, new RectangleF(119, height, 100, 50));
                var category = !string.IsNullOrEmpty(s.Category) ? _entityRepository.GetByID<CertificationCategory>(s.Category.ToGuid(true)) : null;
                if (category != null)
                {
                    g.DrawString(category.Name + " " + category.Number,
                        new System.Drawing.Font("Javanese Text", 8), Brushes.Black, new RectangleF(230, height, 100, 50));
                }
                g.DrawString(s.LicenseNum,
                    new System.Drawing.Font("Javanese Text", 8), Brushes.Black, new RectangleF(380, height, 100, 50));
                height = height + 15;
            }

            g.DrawString(account.CompanyName,
                new System.Drawing.Font("Javanese Text", 12, FontStyle.Bold), Brushes.Black,
                new RectangleF(615, 670, 400, 100));
            g.DrawString(account.CompanyAddress.Address1,
                new System.Drawing.Font("Javanese Text", 10), Brushes.Black, new RectangleF(615, 688, 400, 100));
            var cityStateZipTop = 706;
            if (!account.CompanyAddress.Address2.IsNullOrEmpty())
            {
                g.DrawString(account.CompanyAddress.Address2,
                    new System.Drawing.Font("Javanese Text", 10), Brushes.Black, new RectangleF(615, 706, 400, 100));
                cityStateZipTop = 724;
            }
            g.DrawString(
                account.CompanyAddress.City + ", " + account.CompanyAddress.State + ", " +
                account.CompanyAddress.ZipCode,
                new System.Drawing.Font("Javanese Text", 10), Brushes.Black, new RectangleF(615, cityStateZipTop, 400, 100));

            certTemplate.Save(CertificatePath + certificate.ID + "_user.jpg", ImageFormat.Jpeg);
        }

        private void CreateStateCertificate(Certificate certificate, Account account, StateLicensure licensure, CourseProgress courseProgress, DateTime dateEarnedUtc)
        {
            var certTemplate = new Bitmap(TemplatePathState);

            var ceu =
                courseProgress.Course.StateCEUs.First(
                    s => courseProgress.Course.StateCEUs.Any(c => c.StateAbbr == s.StateAbbr));

            var g = Graphics.FromImage(certTemplate);
            g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;

            var alignCenter = new StringFormat
            {
                Alignment = StringAlignment.Center,
                LineAlignment = StringAlignment.Center
            };

            g.DrawString(account.FirstName + " " + account.LastName,
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(515, 818, 400, 100));

            g.DrawString(licensure.LicenseNum + "\n" + licensure.StateAbbr,
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(1498, 800, 400, 100));

            g.DrawString(ceu.Category.Number,
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(2218, 818, 400, 100));

            g.DrawString(courseProgress.Course.DisplayTitle,
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(587, 1040, 1252, 100));

            g.DrawString(ceu.ActivityID,
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(2155, 1040, 400, 100));

            g.DrawString(courseProgress.LastActivityUtc.ToLocalTime().ToString("d"),
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(515, 1263, 400, 100));

            g.DrawString(ceu.ActivityType,
               new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(2200, 1263, 400, 100));

            var activityTime = TimeSpan.FromMinutes(courseProgress.ActiveTime);
            g.DrawString(activityTime.Hours + ":" + activityTime.Minutes,
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(515, 1484, 400, 100));

            var hours = TimeSpan.FromHours((double)ceu.Hours);
            g.DrawString(hours.Hours + ":" + hours.Minutes,
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(1225, 1484, 400, 100));

            var percentage = courseProgress.TestProgress.CompletedQuestions.Count(r => r.CorrectOnAttempt != null) /
                             (decimal)courseProgress.Course.Test.Questions.Count;
            var grade = (percentage * 100).Round(true, 0) + "%";
            g.DrawString(grade, new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(1915, 1484, 400, 100));

            if (!courseProgress.VerificationInitials.IsNullOrEmpty() && courseProgress.VerificationDate.HasValue)
                g.DrawString(courseProgress.VerificationInitials + "  " + courseProgress.VerificationDate.Value.ToShortDateString(),
                    new System.Drawing.Font("Arial", 24), Brushes.Black, new RectangleF(595, 1685, 277, 100),
                    alignCenter);

            g.DrawString(DateTime.Now.ToString("d"),
                new System.Drawing.Font("Arial", 28), Brushes.Black, new RectangleF(788, 2240, 276, 100),
                alignCenter);

            certTemplate.Save(CertificatePath + certificate.ID + "_state_" + licensure.ID + ".jpg", ImageFormat.Jpeg);
        }

        private static readonly string BaseUrl = MvcApplicationBase.BaseUrl;

        public static string GetCertificateImageUrl(Guid certificateID)
        {
            return string.Concat(BaseUrl, "/Content/Certificates/", certificateID, ".jpg");
        }

        public static string GetCertificatePdfUrl(Guid certificateID)
        {
            return string.Concat(BaseUrl, "/Content/Certificates/", certificateID, ".pdf");
        }

        static bool CalculateLimitedWidth(string text, Graphics g, System.Drawing.Font font, float width)
        {
            var sizeF = g.MeasureString(text, font);
            if (sizeF.Width <= width)
                return true;
            else
                return false;
        }

        static void DrawMultipleLines(string text, Graphics g, System.Drawing.Font font, float maxWidth, float y, StringFormat alignCenter)
        {
            var currentWidth = 0f;
            RectangleF rect = new RectangleF(0, y, maxWidth, font.Height);
            var space = " ";
            var spaceLength = g.MeasureString(space, font).Width;
            var arrLetters = text.Split(new string[] { space }, StringSplitOptions.RemoveEmptyEntries);
            var tmpText = "";

            for (int i = 0; i < arrLetters.Length; i++)
            {
                if (currentWidth + g.MeasureString(arrLetters[i], font).Width > rect.Width)
                {
                    g.DrawString(tmpText.Trim(), font, Brushes.Black, rect, alignCenter);
                    tmpText = "";
                    currentWidth = 0f;
                    rect.Height += font.Height;
                }

                tmpText += arrLetters[i] + space;
                currentWidth += g.MeasureString(arrLetters[i], font).Width + spaceLength;

                if (i == arrLetters.Length - 1)
                {
                    g.DrawString(tmpText.Trim(), font, Brushes.Black, rect, alignCenter);
                }
            }
        }
    }
}