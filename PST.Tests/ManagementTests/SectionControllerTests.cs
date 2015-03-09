using System;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PST.Declarations.Models.Management;
using Prototype1.Foundation;

namespace PST.Tests.ManagementTests
{
    [TestClass]
    public class SectionControllerTests : ApiTestControllerBase
    {
        protected override string UrlBase
        {
            get
            {
                return ConfigurationManager.AppSettings["BaseUrl"]
                       + "api/manage/course/section/";
            }
        }

        [TestMethod]
        public void CanGetSections()
        {
            var course = GetCourses().FirstOrDefault();
            Assert.IsNotNull(course);

            var sections = GetSections(course.id);
            Assert.IsNotNull(sections);
            Assert.IsTrue(sections.Any());
            Assert.IsFalse(sections.Any(s=>s.id.IsNullOrEmpty()));
        }

        public m_course_overview[] GetCourses()
        {
            return new CourseControllerTests().GetCourses();
        }

        public m_section_overview[] GetSections(Guid courseID)
        {
            return ExecuteGetRequest<m_section_overview[]>("list/" + courseID);
        }

        [TestMethod]
        public void CanRenameSection()
        {
            var course = GetCourses().FirstOrDefault();
            Assert.IsNotNull(course);

            var section = GetSections(course.id).FirstOrDefault();
            Assert.IsNotNull(section);

            var originalTitle = section.title;

            section.title = "Updated Section Title";
            RenameSection(course.id, section);

            var updatedSection = GetSections(course.id).FirstOrDefault(s => s.id == section.id);
            Assert.IsNotNull(updatedSection);
            Assert.AreEqual(section.id, updatedSection.id);
            Assert.AreEqual(section.title, updatedSection.title);

            section.title = originalTitle;
            RenameSection(course.id, section);

            updatedSection = GetSections(course.id).FirstOrDefault(s => s.id == section.id);
            Assert.IsNotNull(updatedSection);
            Assert.AreEqual(section.id, updatedSection.id);
            Assert.AreEqual(section.title, updatedSection.title);
        }

        public void RenameSection(Guid courseID, m_section_overview section)
        {
            ExecutePutRequest("rename/" + courseID + "/" + section.id, section.title);
        }

        [TestMethod]
        public void CanUpsertAndDeleteSection()
        {
            var course = GetCourses().FirstOrDefault();
            Assert.IsNotNull(course);

            var section = new m_section_overview {title = "Newly Created Section"};
            var newSection = UpsertSection(course.id, section);
            Assert.IsNotNull(newSection);
            Assert.IsFalse(newSection.id.IsNullOrEmpty());
            Assert.AreEqual(section.title, newSection.title);

            newSection.title = "Updated Section Title";

            var updatedSection = UpsertSection(course.id, newSection);
            Assert.IsNotNull(updatedSection);
            Assert.AreEqual(newSection.id, updatedSection.id);
            Assert.AreEqual(newSection.title, updatedSection.title);

            DeleteSection(course.id, updatedSection.id);

            section = GetSections(course.id).FirstOrDefault(s=>s.id == updatedSection.id);
            Assert.IsNull(section);
        }

        public m_section_overview UpsertSection(Guid courseID, m_section_overview section)
        {
            return ExecutePutRequest<m_section_overview>(courseID.ToString(), section);
        }

        public void DeleteSection(Guid courseID, Guid sectionID)
        {
            ExecuteDeleteRequest(courseID + "/" + sectionID);
        }

        [TestMethod]
        public void CanUpdateSortOrder()
        {
            var course = GetCourses().FirstOrDefault();
            Assert.IsNotNull(course);

            var sections = GetSections(course.id);
            Assert.IsNotNull(sections);
            Assert.IsTrue(sections.Count() > 1);

            var sectionIDs = sections.Reverse().Select(s => s.id).ToArray();

            UpdateSortOrder(course.id, sectionIDs);

            var updatedSections = GetSections(course.id);
            Assert.IsNotNull(sections);
            Assert.IsTrue(sections.Count() > 1);
            CollectionAssert.AreEqual(sectionIDs, updatedSections.Select(s => s.id).ToArray());

            sectionIDs = sections.Select(s => s.id).ToArray();

            UpdateSortOrder(course.id, sectionIDs);

            updatedSections = GetSections(course.id);
            Assert.IsNotNull(sections);
            Assert.IsTrue(sections.Count() > 1);
            CollectionAssert.AreEqual(sectionIDs, updatedSections.Select(s => s.id).ToArray());
        }

        public void UpdateSortOrder(Guid courseID, Guid[] sectionIDs)
        {
            ExecutePutRequest("sort/" + courseID, sectionIDs);
        }
    }
}