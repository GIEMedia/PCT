using System;
using System.Configuration;
using Prototype1.Foundation.Data;
using PCT.Declarations.Models;

namespace PCT.Declarations.Entities
{
    [Serializable]
    public class Certificate : EntityBase
    {
        public virtual DateTime EarnedUtc { get; set; }

        [Ownership(Ownership.None)]
        public virtual Course Course { get; set; }

        private static readonly string BaseUrl = MvcApplicationBase.BaseUrl;
        public static implicit operator certificate(Certificate certificate)
        {
            if(certificate == null)
                return new certificate();

            return new certificate
            {
                course_id = certificate.Course.ID,
                course_name = certificate.Course.DisplayTitle,
                earned = certificate.EarnedUtc,
                image_url = GetImageUrl(certificate.ID),
                pdf_url = GetPdfUrl(certificate.ID)
            };
        }

        public static string GetImageUrl(Guid certificateID)
        {
            return string.Concat(BaseUrl, "/Content/Certificates/", certificateID, ".jpg");
        }

        public static string GetPdfUrl(Guid certificateID)
        {
            return string.Concat(BaseUrl, "/Content/Certificates/", certificateID, ".pdf");
        }
    }
}