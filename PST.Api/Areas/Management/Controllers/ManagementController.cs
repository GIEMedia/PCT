using System;
using System.Linq;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Controllers;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Models;
using PST.Declarations.Models.Management;

namespace PST.Api.Areas.Management.Controllers
{
    [Authorize]
    [RoutePrefix("api/manage")]
    public class ManagementController : ApiControllerBase
    {
        private readonly IEntityRepository _entityRepository;

        public ManagementController(IEntityRepository entityRepository)
        {
            _entityRepository = entityRepository;
        }

        /// <summary>
        /// Get results of a course's test
        /// </summary>
        /// <param name="courseID">ID of course</param>
        /// <returns></returns>
        [HttpGet]
        [Route("results/{courseID}")]
        public m_question_stat[] GetResults(Guid courseID)
        {
            return new m_question_stat[0];
        }

        /// <summary>
        /// Get list of users
        /// </summary>
        /// <param name="page">Page to show (default = 1)</param>
        /// <param name="qty">Quantity of results to show (default = 20)</param>
        /// <param name="search">String to search for users on</param>
        /// <returns></returns>
        [HttpGet]
        [Route("user/list")]
        public m_user_overview[] GetUsers(int? page = 1, int? qty = 20, string search = "")
        {
            qty = qty ?? 20;
            page = page ?? 1;
            search = search.IfNullOrWhiteSpace("").Trim();

            var accounts = _entityRepository.Queryable<Account>();

            if(!search.IsNullOrEmpty())
                accounts = accounts.Where(a=>
                    a.FirstName.Contains(search) ||
                    a.LastName.Contains(search) ||
                    a.Email.Contains(search));

            return accounts
                .OrderBy(a => a.LastName)
                .Skip(qty.Value*(page.Value - 1))
                .Take(qty.Value)
                .Select(a => (m_user_overview) a)
                .ToArray();
        }

        /// <summary>
        /// Search user list by last name, first name, and/or email
        /// </summary>
        /// <param name="search">String to perform search on - minimum 2 characters required</param>
        /// <param name="max">Maximum results to show (default = 20, absolute max = 100)</param>
        /// <returns></returns>
        [HttpGet]
        [Route("user/search")]
        public m_user_overview[] SearchUser(string search, int max = 20)
        {
            search = search.IfNullOrWhiteSpace("").Trim();
            if (search.Length < 2) return new m_user_overview[0];

            if (max > 100) max = 100;

            return _entityRepository.Queryable<Account>().Where(a =>
                a.FirstName.Contains(search) ||
                a.LastName.Contains(search) ||
                a.Email.Contains(search))
                .OrderBy(a => a.LastName)
                .Take(max)
                .Select(a => (m_user_overview) a)
                .ToArray();
        }

        /// <summary>
        /// Get details about a specific user
        /// </summary>
        /// <param name="userID">ID of user</param>
        /// <returns></returns>
        [HttpGet]
        [Route("user/{userID}")]
        public m_user GetUser(Guid userID)
        {
            var account = _entityRepository.GetByID<Account>(userID);
            if (account == null)
                throw new NullReferenceException("User not found.");

            var user = new m_user
            {
                id = account.ID,
                email = account.Email,
                first_name = account.FirstName,
                last_name = account.LastName,
                last_sign_in = account.DateLastLoggedIn,
                admin_access = account.AdminAccess,
                company_address = account.CompanyAddress,
                company_name = account.CompanyName,
                licensures = account.StateLicensures.Select(l => (state_licensure) l).ToArray(),
                managers = account.Managers.Select(m => (manager) m).ToArray(),
                courses = account.CourseProgress.Select(m => (m_user_course_stat)m).ToArray()
            };

            return user;
        }

        /// <summary>
        /// Update user's admin access
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="access"></param>
        [HttpPut]
        [Route("user/admin/{userID}")]
        public void UpdateUser(Guid userID, AdminAccess access)
        {
            var account = _entityRepository.GetByID<Account>(userID);
            if(account == null)
                throw new NullReferenceException("User not found.");

            account.AdminAccess = access;

            _entityRepository.Save(account);
        }
    }
}