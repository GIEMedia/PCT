using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using PCT.Declarations.Entities;
using PCT.Declarations.Entities.Components;
using PCT.Services;
using Prototype1.Foundation.Data.NHibernate;

namespace PCT.Tests
{
    [TestClass]
    public class CertificateTests
    {
        [TestMethod]
        public void CanCreateCertificate()
        {
            var moqRepo = new Mock<IEntityRepository>();
            moqRepo.Setup(x => x.Save(It.IsAny<CourseProgress>()));

            var certService = new CertificateService(moqRepo.Object);
            certService.SetPaths(
                @"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\",
                @"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\Template\certificate_template_user.jpg",
                @"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\Template\certificate_template_state.jpg");

            var account = new Account
            {
                FirstName = "Oleg",
                LastName = "Fridman",
                StateLicensures = new List<StateLicensure>
                {
                    new StateLicensure {Category = "Cat1", LicenseNum = "ABC123", StateAbbr = "OH", ID = Guid.NewGuid()}
                },
                CompanyAddress = new Address
                {
                    Address1 = "123 Main St",
                    Address2 = "Suite 123",
                    City = "Austin",
                    State = "TX",
                    ZipCode = "73723",
                    Phone = "5125232323"
                },
                CompanyName = "Prototype1, LLC"
            };

            var courseProgress = new CourseProgress
            {
                VerificationInitials = "OF",
                VerificationDate = DateTime.UtcNow,
                ActiveTime = (int) TimeSpan.FromHours(1.8).TotalMinutes,
                LastActivityUtc = DateTime.UtcNow.AddMinutes(-5),
                Course = new Course
                {
                    Title = "Allergy Technologies: ActiveGuard® Mattress Liners Allergy Technologies: ActiveGuard® Mattress Liners",
                    StateCEUs = new List<StateCEU>
                    {
                        new StateCEU
                        {
                            StateAbbr = "OH",
                            Category = new CertificationCategory
                            {
                                Name = "OH Category",
                                Number = "OHCAT1",
                                StateAbbr = "OH"
                            },
                            Hours = 1.5m,
                            ActivityID = "ActID",
                            ActivityType = "General"
                        }
                    },
                    Test = new Test
                    {
                        Questions = new List<Question>
                        {
                            new TextQuestion(),
                            new TextQuestion(),
                            new TextQuestion(),
                            new TextQuestion()
                        }
                    }
                },
                TestProgress = new TestProgress
                {
                    CompletedQuestions = new List<TestQuestionProgress>
                    {
                        new TestQuestionProgress { CorrectOnAttempt = 1 },
                        new TestQuestionProgress { CorrectOnAttempt = 1 },
                        new TestQuestionProgress { CorrectOnAttempt = 1 },
                        new TestQuestionProgress { CorrectOnAttempt = 1 }
                    }
                }
            };

            certService.CreateCertificate(account, courseProgress, DateTime.UtcNow);

            var id = DateTime.Now.Ticks;
            new FileInfo(
                @"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\00000000-0000-0000-0000-000000000000.pdf")
                .MoveTo(
                    @"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\00000000-0000-0000-0000-000000000000.pdf"
                        .Replace(Guid.Empty.ToString(), id.ToString()));

            foreach(var licensure in account.StateLicensures.Where(s => courseProgress.Course.StateCEUs.Any(ceu => ceu.StateAbbr == s.StateAbbr)))
                new FileInfo(
                    @"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\00000000-0000-0000-0000-000000000000_state_" + licensure.ID + ".jpg")
                    .MoveTo(
                        (@"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\00000000-0000-0000-0000-000000000000_state_" + licensure.ID + ".jpg")
                            .Replace(Guid.Empty.ToString(), id.ToString()));

            new FileInfo(
                @"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\00000000-0000-0000-0000-000000000000_user.jpg")
                .MoveTo(
                    @"D:\Source Control\Prototype1\GIE-PST\PCT.Tests\Content\Certificates\00000000-0000-0000-0000-000000000000_user.jpg"
                        .Replace(Guid.Empty.ToString(), id.ToString()));
        }
    }
}