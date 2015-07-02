using System;
using System.Collections.Generic;
using PCT.Declarations.Entities;

namespace PCT.Declarations.Interfaces
{
    public interface ICertificateService
    {
        IEnumerable<Certificate> GetCertificates(Guid accountID, Guid? courseID = null);

        void CreateCertificate(Account account, CourseProgress courseProgress, DateTime dateEarnedUtc);
    }
}