using System;
using System.Configuration;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Unity;
using Microsoft.Practices.Unity;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Certificate : EntityBase
    {
        public virtual DateTime EarnedUtc { get; set; }

        [Ownership(Ownership.None)]
        public virtual Course Course { get; set; }

        private static readonly string BaseUrl = ConfigurationManager.AppSettings["BaseUrl"].Replace("http://", "//").Replace("https://", "//");
        public static implicit operator certificate(Certificate certificate)
        {
            if(certificate == null)
                return new certificate();

            var urlBase = string.Concat(BaseUrl, "/Content/Certificates/", certificate.ID);
            return new certificate
            {
                course_name = certificate.Course.Title,
                earned = certificate.EarnedUtc,
                image_url = urlBase + ".jpg",
                pdf_url = urlBase + ".pdf"
            };
        }
    }
}