using System;
using System.Collections.Generic;
using PST.Declarations.Entities;

namespace PST.Declarations.Interfaces
{
    public interface ICertificateService
    {
        IEnumerable<Certificate> GetCertificates(Guid accountID, Guid? courseID = null);

        void CreateCertificate(Account account, CourseProgress courseProgress, DateTime dateEarnedUtc);
    }
}