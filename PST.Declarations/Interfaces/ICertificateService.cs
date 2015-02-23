using System;
using System.Collections.Generic;
using PST.Declarations.Entities;

namespace PST.Declarations.Interfaces
{
    public interface ICertificateService
    {
        IEnumerable<Certificate> GetCertificate(Guid accountID, Guid? courseID);

        Certificate CreateCertificate(Account account, Course course, DateTime dateEarnedUtc);
    }
}