using System;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using Prototype1.Foundation;
using PST.Api.Areas.Management.Models;
using PST.Api.Controllers;
using PST.Declarations;

namespace PST.Api.Areas.Management.Controllers
{
    [Authorize]
    [RoutePrefix("api/manage")]
    public class ManagementController : ApiControllerBase
    {
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
        /// <returns></returns>
        [HttpGet]
        [Route("user/list")]
        public m_user_overview[] GetUsers(int? page = 1, int? qty = 20)
        {
            return new m_user_overview[0];
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
            if(search.Length <2) return new m_user_overview[0];

            if (max > 100) max = 100;
                
            return new m_user_overview[0];
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
            return new m_user();
        }

        /// <summary>
        /// Update user's admin access
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="access"></param>
        [HttpPut]
        [Route("user/admin/{userID}")]
        public void GetUser(Guid userID, AdminAccess access)
        {
            
        }
    }
}