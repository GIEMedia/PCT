using System;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PCT.Declarations;
using PCT.Declarations.Models.Management;
using Prototype1.Foundation;

namespace PCT.Tests.ManagementTests
{
    [TestClass]
    public class CourseControllerTests : ApiTestControllerBase
    {
        protected override string UrlBase
        {
            get { return MvcApplicationBase.BaseUrl + "/api/manage/course/"; }
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
            var categories = GetCategories(true);

            Assert.IsNotNull(categories);
            Assert.IsTrue(categories.Any());
            Assert.IsTrue(categories.All(c => c.title.Length > 0));
            Assert.IsTrue(categories.Any(c => c.sub_categories.Any()));
            Assert.IsTrue(categories.Any(c => c.sub_categories.All(s => s.title.Length > 0)));

            Debug.WriteLine("{0} categories found", categories.Length);
        }

        public m_main_category[] GetCategories(bool courseCount)
        {
            return ExecuteGetRequest<m_main_category[]>("categories?courseCount=" + courseCount);
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

            var mainCat = GetCategories(false).FirstOrDefault(c => c.id == topCat.id);
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

            var url = "category";
            if (!category.id.IsNullOrEmpty())
                url += (url == "category" ? "?" : "&") + "categoryID=" + category.id;
            if (parentCategoryID.HasValue)
                url += (url == "category" ? "?" : "&") + "parentCategoryID=" + parentCategoryID.Value;

            return ExecutePutRequest<m_category>(url, category.title);
        }

        [TestMethod]
        public void CanUpsertAndDeleteCourse()
        {
            var category = GetCategories(false).FirstOrDefault(c => c.sub_categories.Any());
            Assert.IsNotNull(category);

            var newCourse = new m_course
            {
                title = "New Course",
                state_ceus = new[]
                {
                    new m_state_ceu {state = "OH", hours = 1, category_code = "abc123"},
                    new m_state_ceu {state = "CA", hours = 1.25m, category_code = "xyz987"}
                },
                category = category.id,
                sub_category = category.sub_categories.First().id
            };

            var course = UpsertCourse(newCourse);
            Assert.IsNotNull(course);
            Assert.IsFalse(course.id.IsNullOrEmpty());
            Assert.IsTrue(course.date_created.Year == DateTime.UtcNow.Year);

            var courses = GetCourses();
            Assert.IsNotNull(courses);
            Assert.IsTrue(courses.Count(c => c.id == course.id) == 1);

            course.title = "New Course Updated";
            var updatedCourse = UpsertCourse(course);
            Assert.IsNotNull(updatedCourse);
            Assert.AreEqual(course.id, updatedCourse.id);
            Assert.AreEqual(course.title, updatedCourse.title);

            courses = GetCourses();
            Assert.IsNotNull(courses);
            Assert.IsTrue(courses.Count(c => c.id == course.id) == 1);

            DeleteCourse(updatedCourse);

            courses = GetCourses();
            Assert.IsNotNull(courses);
            Assert.IsFalse(courses.Any(c => c.id == course.id));
        }

        public m_course UpsertCourse(m_course course)
        {
            return ExecutePutRequest<m_course>("", course);
        }

        public void DeleteCourse(m_course course)
        {
            ExecuteDeleteRequest(course.id.ToString());
        }
    }
}