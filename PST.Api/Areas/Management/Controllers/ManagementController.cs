using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using PST.Api.Controllers;
using PST.Api.Core;
using PST.Api.Core.OAuth;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Interfaces;
using PST.Declarations.Models.Management;

namespace PST.Api.Areas.Management.Controllers
{
    [AdminAuthorize]
    [RoutePrefix("api/manage")]
    public class ManagementController : ApiControllerBase
    {
        private readonly Lazy<UserManager<ApplicationUser>> _userManager;
        private readonly IEntityRepository _entityRepository;
        private readonly Lazy<ICourseService> _courseService;

        public ManagementController(Lazy<UserManager<ApplicationUser>> userManager, IEntityRepository entityRepository, Lazy<ICourseService> courseService)
            : base(userManager)
        {
            _userManager = userManager;
            _entityRepository = entityRepository;
            _courseService = courseService;
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
            var course = _courseService.Value.GetCourse(courseID, status: null);
            if (course == null)
                throw new NullReferenceException("Course not found");

            if(course.Test == null)
                return new m_question_stat[0];

            return course.Test.Questions.Select(q =>
                new m_question_stat
                {
                    first_attempt = 750,
                    second_attempt = 250,
                    third_attempt = 50,
                    question = q.QuestionText,
                    options = q.Options.Select(o =>
                        new m_option_stat
                        {
                            first_attempt = 750,
                            second_attempt = 250,
                            third_attempt = 50,
                            text = o.Text,
                            image = q is MultiImageQuestion ? ((ImageOption) o).ImageUrl : null,
                            correct = o.Correct
                        }).ToArray()
                }).ToArray();
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
        public m_user_search_result GetUsers(int? page = 1, int? qty = 20, string search = "")
        {
            qty = qty ?? 20;
            page = page ?? 1;
            search = search.IfNullOrWhiteSpace("").Trim();

            var accounts = _entityRepository.Queryable<Account>();

            if (!search.IsNullOrEmpty())
                accounts = search.Trim().Split(new[] {" "}, StringSplitOptions.RemoveEmptyEntries)
                    .Where(s => !s.Trim().IsNullOrWhiteSpace())
                    .Aggregate(accounts,
                        (current, s) =>
                            current.Where(a => a.FirstName.Contains(s) || a.LastName.Contains(s) || a.Email.Contains(s)));

            var totalUsers = accounts.Count();

            return new m_user_search_result
            {
                pages = (int)Math.Ceiling(totalUsers/(decimal)qty.Value),
                results =
                    accounts
                        .OrderBy(a => a.LastName)
                        .Skip(qty.Value*(page.Value - 1))
                        .Take(qty.Value)
                        .ToList()
                        .Select(a => (m_user_overview) a)
                        .ToArray()
            };
        }

        /// <summary>
        /// Search user list by last name, first name, and/or email
        /// </summary>
        /// <param name="search">String to perform search on - minimum 2 characters required</param>
        /// <param name="max">Maximum results to show (default = 20, absolute max = 100)</param>
        /// <returns></returns>
        [HttpGet]
        [Route("user/search")]
        public m_user_overview[] SearchUsers(string search, int max = 20)
        {
            search = search.IfNullOrWhiteSpace("").Trim();
            if (search.Length < 2) return new m_user_overview[0];

            if (max > 100) max = 100;

            return GetUsers(qty: max, search: search).results;
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

            return account;
        }

        /// <summary>
        /// Update user's admin access
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="access"></param>
        [HttpPut]
        [Route("user/admin/{userID}")]
        public async Task UpdateUserAdminAccess(Guid userID, AdminAccess access)
        {
            var account = await _userManager.Value.FindByIdAsync(userID.ToString());

            if (account == null)
                throw new NullReferenceException("User not found.");

            account.AdminAccess = access;
            await _userManager.Value.UpdateAsync(account);
        }
    }
}