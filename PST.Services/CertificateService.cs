using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation.Data.NHibernate;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;

namespace PST.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly IEntityRepository _entityRepository;

        public CertificateService(IEntityRepository entityRepository)
        {
            _entityRepository = entityRepository;
        }

        public IEnumerable<Certificate> GetCertificate(Guid accountID, Guid? courseID)
        {
            return (from a in _entityRepository.Queryable<Account>()
                where a.ID == courseID
                from cp in a.CourseProgress
                where courseID == null || cp.Course.ID == courseID
                select cp.Certificate);
        }

        public Certificate CreateCertificate(Account account, Course course, DateTime dateEarnedUtc)
        {
            throw new NotImplementedException();
        }
    }
}