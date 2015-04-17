using System;
using System.ComponentModel.Design;
using System.Linq;
using System.Net;
using System.Net.Http;
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
using PST.Declarations.Models;
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
        private readonly Lazy<IUploadService> _uploadService;

        public ManagementController(Lazy<UserManager<ApplicationUser>> userManager, IEntityRepository entityRepository, Lazy<ICourseService> courseService, Lazy<IUploadService> uploadService)
            : base(userManager)
        {
            _userManager = userManager;
            _entityRepository = entityRepository;
            _courseService = courseService;
            _uploadService = uploadService;
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

            var results = (from cp in _entityRepository.Queryable<CourseProgress>()
                where cp.Course.ID == courseID && cp.TestProgress != null
                from qp in cp.TestProgress.CompletedQuestions
                from op in qp.OptionProgress
                select new {qp.QuestionID, qp.CorrectOnAttempt, op.OptionID, op.SelectedOnAttempt}).ToList();

            return course.Test.Questions.Select(q =>
            {
                var questionResults =
                    results.Where(r => r.QuestionID == q.ID)
                        .GroupBy(r => r.QuestionID, r => new {r.SelectedOnAttempt})
                        .ToList();
                return new m_question_stat
                {
                    first_attempt = questionResults.Count(r => r.Max(a => a.SelectedOnAttempt) == 1),
                    second_attempt = questionResults.Count(r => r.Max(a => a.SelectedOnAttempt) == 2),
                    third_attempt = questionResults.Count(r => r.Max(a => a.SelectedOnAttempt) > 2),
                    question = q.QuestionText,
                    options = q.Options.Select(o =>
                    {
                        var optionResults = results.Where(r => r.OptionID == o.ID).ToList();
                        return new m_option_stat
                        {
                            first_attempt = optionResults.Count(r => r.CorrectOnAttempt == 1),
                            second_attempt = optionResults.Count(r => r.CorrectOnAttempt == 2),
                            third_attempt = optionResults.Count(r => r.CorrectOnAttempt > 2),
                            text = o.Text,
                            image = q is MultiImageQuestion ? ((ImageOption) o).ImageUrl : null,
                            correct = o.Correct
                        };
                    }).ToArray()
                };
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

        /// <summary>
        /// Get all manufacturers
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("manufacturer")]
        public manufacturer[] GetManufacturers()
        {
            return _entityRepository.Queryable<Manufacturer>().OrderBy(m => m.Name).ToList()
                .Select(m => (manufacturer) m).ToArray();
        }

        /// <summary>
        /// Upsert manufacturer
        /// </summary>
        /// <param name="name"></param>
        /// <param name="manufacturer_id"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("manufacturer/{manufacturer_id?}")]
        public manufacturer UpsertManufacturer([FromBody] string name, Guid? manufacturer_id = null)
        {
            Manufacturer man;
            if (manufacturer_id.HasValue && !manufacturer_id.Value.IsNullOrEmpty())
            {
                man = _entityRepository.GetByID<Manufacturer>(manufacturer_id.Value);
                if (man == null)
                    throw new NullReferenceException("Specified manufacturer not found.");
            }
            else
                man = new Manufacturer();

            man.Name = name;

            _entityRepository.Save(man);

            return man;
        }

        /// <summary>
        /// Uploads an image and assigns it to an existing manufacturer
        /// </summary>
        /// <returns>Returns an updated manufacturer with the image url set</returns>
        [HttpPost]
        [Route("manufacturer/image/{manufacturer_id}")]
        public async Task<manufacturer> UploadManufacturerImage(Guid manufacturer_id)
        {
            var manufacturer = _entityRepository.GetByID<Manufacturer>(manufacturer_id);
            if (manufacturer == null)
                throw new NullReferenceException("Specified manufacturer not found.");

            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            manufacturer.ImageUrl = await _uploadService.Value.UploadImage(Request.Content, 98, 98, true);

            _entityRepository.Save(manufacturer);

            return manufacturer;
        }

        /// <summary>
        /// Delete manufacturer
        /// </summary>
        /// <param name="manufacturer_id"></param>
        [HttpDelete]
        [Route("manufacturer/{manufacturer_id}")]
        public void DeleteManufacturer(Guid manufacturer_id)
        {
            var manufacturer = _entityRepository.GetByID<Manufacturer>(manufacturer_id);
            if (manufacturer == null)
                throw new NullReferenceException("Specified manufacturer not found.");
            _entityRepository.Delete(manufacturer);
        }
    }
}