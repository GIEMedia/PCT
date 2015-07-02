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
        private static readonly string TemplatePath =
            HostingEnvironment.MapPath("/Content/Certificates/Template/certificate_template.jpg");
        private static readonly string CertificatePath =
            HostingEnvironment.MapPath("/Content/Certificates/");

        private readonly IEntityRepository _entityRepository;

        public CertificateService(IEntityRepository entityRepository)
        {
            _entityRepository = entityRepository;
        }

        public IEnumerable<Certificate> GetCertificates(Guid accountID, Guid? courseID = null)
        {
            var certs = (from a in _entityRepository.Queryable<Account>()
                where a.ID == accountID
                from cp in a.CourseProgress
                where cp.Certificate != null
                orderby cp.Course.DisplayTitle
                select cp.Certificate);
            return courseID.HasValue ? certs.Where(c => c.Course.ID == courseID.Value) : certs;
        }

        public void CreateCertificate(Account account, CourseProgress courseProgress, DateTime dateEarnedUtc)
        {
            var certificate = new Certificate { EarnedUtc = dateEarnedUtc };
            courseProgress.Certificate = certificate;
            _entityRepository.Save(courseProgress);

            var certTemplate = new Bitmap(TemplatePath);

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
            g.DrawString(courseProgress.Course.DisplayTitle,
                new System.Drawing.Font("Javanese Text", 26), Brushes.Black, new RectangleF(0, 0, 1110, 1000),
                alignCenter);
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
                g.DrawString(s.Category,
                    new System.Drawing.Font("Javanese Text", 8), Brushes.Black, new RectangleF(230, height, 100, 50));
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

            certTemplate.Save(CertificatePath + certificate.ID + ".jpg", ImageFormat.Jpeg);

            using (var document = new iTextSharp.text.Document())
            using (var stream = new FileStream(CertificatePath + certificate.ID + ".pdf",
                FileMode.Create, FileAccess.Write, FileShare.None))
            {
                iTextSharp.text.pdf.PdfWriter.GetInstance(document, stream);
                document.SetPageSize(new iTextSharp.text.Rectangle(700, 570));
                document.Open();
                using (var imageStream = new FileStream(CertificatePath + certificate.ID + ".jpg",
                    FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    var image = iTextSharp.text.Image.GetInstance(imageStream);
                    image.ScaleToFit(800f, 500f);
                    document.Add(image);
                }
                document.Close();
            }
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
    }
}