using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Prototype1.Foundation.Web;
using PST.Declarations.Models.Management;
using Prototype1.Foundation;

namespace PST.Tests.ManagementTests
{
    [TestClass]
    public class CourseControllerTests
    {
        private static readonly string UrlBase = ConfigurationManager.AppSettings["BaseUrl"]
            + "api/manage/course/";

        private static T ExecuteGetRequest<T>(string url)
        {
            string r;
            HttpRequestExecutor.ExecuteGetRequest(out r, UrlBase + url);
            return r.FromJson<T>();
        }

        private static T ExecutePutRequest<T>(string url, object obj)
        {
            string r;
            HttpRequestExecutor.ExecutePutRequest(out r, UrlBase + url, obj.ToJson(), true,
                new Dictionary<string, string>());
            return r.FromJson<T>();
        }

        [TestMethod]
        public void CanGetCourses()
        {
            var courses = GetCourses();

            Assert.IsNotNull(courses);
            Assert.IsTrue(courses.Any());
            Assert.IsTrue(courses.All(c => c.title.Length > 0));

            Debug.WriteLine(string.Format("{0} courses found.", courses.Length));
        }

        public m_course_overview[] GetCourses()
        {
            return ExecuteGetRequest<m_course_overview[]>("list");
        }

        [TestMethod]
        public void CanGetCourse()
        {
            var course = GetCourse();

            Assert.IsNotNull(course);
            Assert.IsFalse(course.id.IsNullOrEmpty());
            Assert.IsNotNull(course.category);
            Assert.IsTrue(course.state_ceus.Any());
            Assert.IsNotNull(course.sub_category);
            Assert.IsTrue(course.title.Length > 0);

            Debug.WriteLine(string.Format("Course found: '{0}'", course.title));
        }

        public m_course GetCourse()
        {
            var courses = GetCourses();

            return ExecuteGetRequest<m_course>(courses[0].id.ToString());
        }

        [TestMethod]
        public void CanGetCategories()
        {
            var categories = GetCategories();

            Assert.IsNotNull(categories);
            Assert.IsTrue(categories.Any());
            Assert.IsTrue(categories.All(c => c.title.Length > 0));
            Assert.IsTrue(categories.All(c => c.sub_categories.Any()));
            Assert.IsTrue(categories.All(c => c.sub_categories.All(s=>s.title.Length > 0)));

            Debug.WriteLine(string.Format("{0} categories found", categories.Length));
        }

        public m_main_category[] GetCategories()
        {
            return ExecuteGetRequest<m_main_category[]>("categories");
        }

        [TestMethod]
        public void CanUpsertCategory()
        {
            var topCat = UpsertCategory(null, null);
            Assert.IsNotNull(topCat);
            Assert.IsFalse(topCat.id.IsNullOrEmpty());

            var subCat1 = UpsertCategory(null, topCat.id);
            Assert.IsNotNull(subCat1);
            Assert.IsFalse(subCat1.id.IsNullOrEmpty());
            var subCat2 = UpsertCategory(null, topCat.id);
            Assert.IsNotNull(subCat1);
            Assert.IsFalse(subCat1.id.IsNullOrEmpty());

            var mainCat = GetCategories().FirstOrDefault(c => c.id == topCat.id);
            Assert.IsNotNull(mainCat);
            Assert.IsTrue(mainCat.sub_categories.Length == 2);
            Assert.IsTrue(mainCat.sub_categories.Count(c => c.id == subCat1.id) == 1);
            Assert.IsTrue(mainCat.sub_categories.Count(c => c.id == subCat2.id) == 1);

            topCat.title = "New Title";
            var updatedTopCat = UpsertCategory(topCat, null);
            Assert.IsNotNull(updatedTopCat);
            Assert.AreEqual(topCat.id, updatedTopCat.id);
            Assert.AreEqual(topCat.title, updatedTopCat.title);

            subCat1.title = "New Sub Title";
            var updatedSubCat1 = UpsertCategory(subCat1, topCat.id);
            Assert.IsNotNull(updatedSubCat1);
            Assert.AreEqual(subCat1.id, updatedSubCat1.id);
            Assert.AreEqual(subCat1.title, updatedSubCat1.title);
        }

        public m_category UpsertCategory(m_category category, Guid? parentCategoryID)
        {
            category = category ?? new m_category
            {
                title = "New Cat Title"
            };

            var url = "category?"
                      + (category.id.IsNullOrEmpty()
                          ? ""
                          : "&categoryID=" + category.id)
                      + (parentCategoryID.HasValue
                          ? "&parentCategoryID=" + parentCategoryID.Value
                          : "");

            return ExecutePutRequest<m_category>(url, category.title);
        }
    }
}
