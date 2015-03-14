using System;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Models.Management;
using Prototype1.Foundation;
using PST.Services;

namespace PST.Tests.ManagementTests
{
    [TestClass]
    public class ManagementControllerTests : ApiTestControllerBase
    {
        protected override string UrlBase
        {
            get
            {
                return ConfigurationManager.AppSettings["BaseUrl"]
                       + "api/manage/";
            }
        }

        [TestMethod]
        public void CanGetUsers()
        {
            var users = GetUsers(null, null, "");
            Assert.IsNotNull(users);
            Assert.IsTrue(users.Any());

            var user = users.First();
            var search = user.first_name + " " + user.last_name;
            var searchedUsers = GetUsers(null, null, search);
            Assert.IsNotNull(searchedUsers);
            Assert.IsTrue(searchedUsers.Any(u => user.id == u.id));

            search = "    " + user.first_name + "      " + user.last_name + "        ";
            searchedUsers = GetUsers(null, null, search);
            Assert.IsNotNull(searchedUsers);
            Assert.IsTrue(searchedUsers.Any(u => user.id == u.id));

            search = user.first_name + " " + user.last_name + " @*&@#&*H";
            searchedUsers = GetUsers(null, null, search);
            Assert.IsNotNull(searchedUsers);
            Assert.IsFalse(searchedUsers.Any());

            users = GetUsers(null, 2, "");
            Assert.IsNotNull(users);
            Assert.IsTrue(users.Count() == 2);
        }

        [TestMethod]
        public void CanSearchUsers()
        {
            var users = GetUsers(null, null, "");
            Assert.IsNotNull(users);
            Assert.IsTrue(users.Any(u => u.last_name.Length > 4));

            var user = users.First(u => u.last_name.Length > 4);
            var search = user.last_name.Substring(0, 4);
            var searchedUsers = SearchUsers(search);
            Assert.IsNotNull(searchedUsers);
            Assert.IsTrue(searchedUsers.Any(u => user.id == u.id));

            search = "a";
            searchedUsers = SearchUsers(search);
            Assert.IsNotNull(searchedUsers);
            Assert.IsFalse(searchedUsers.Any());
        }

        public m_user_overview[] GetUsers(int? page, int? qty, string search)
        {
            var url = "user/list";
            if (page.HasValue)
                url += "?page=" + page;
            if (qty.HasValue)
                url += (url == "user/list" ? "?" : "&") + "qty=" + qty;
            if (!search.IsNullOrEmpty())
                url += (url == "user/list" ? "?" : "&") + "search=" + search;
            return ExecuteGetRequest<m_user_overview[]>(url);
        }

        public m_user_overview[] SearchUsers(string search)
        {
            return ExecuteGetRequest<m_user_overview[]>("user/search?search=" + search);
        }

        [TestMethod]
        public void CanGetUser()
        {
            var users = GetUsers(null, null, "");
            Assert.IsNotNull(users);
            Assert.IsTrue(users.Any(u => u.last_name.Length > 4));

            var user = users.First(u => u.last_name.Length > 4);
            var foundUser = GetUser(user.id);
            Assert.IsNotNull(foundUser);
            Assert.AreEqual(user.id, foundUser.id);
            Assert.IsFalse(foundUser.company_name.IsNullOrEmpty());
            Assert.IsNotNull(foundUser.company_address);
            Assert.IsFalse(foundUser.company_address.address1.IsNullOrEmpty());
        }

        public m_user GetUser(Guid userID)
        {
            return ExecuteGetRequest<m_user>("user/" + userID);
        }

        [TestMethod]
        public void CanUpdateUserAdminAccess()
        {
            var users = GetUsers(null, null, "");
            Assert.IsNotNull(users);
            Assert.IsTrue(users.Any());

            var user = users.First();
            var foundUser = GetUser(user.id);
            Assert.IsNotNull(foundUser);

            var origAccess = foundUser.admin_access;

            UpdateUserAdminAccess(user.id, origAccess == AdminAccess.System ? AdminAccess.None : AdminAccess.System);

            foundUser = GetUser(user.id);
            Assert.AreNotEqual(origAccess, foundUser.admin_access);

            UpdateUserAdminAccess(user.id, origAccess);

            foundUser = GetUser(user.id);
            Assert.AreEqual(origAccess, foundUser.admin_access);
        }

        public void UpdateUserAdminAccess(Guid userID, AdminAccess access)
        {
            ExecutePutRequest("user/admin/" + userID + "?access=" + ((int) access),"");
        }
    }
}