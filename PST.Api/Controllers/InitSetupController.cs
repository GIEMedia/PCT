using System;
using System.Collections.Generic;
using System.Web.Http;
using Antlr.Runtime.Misc;
using Prototype1.Foundation;
using Prototype1.Foundation.Data.NHibernate;
using PST.Declarations;
using PST.Declarations.Entities;
using PST.Declarations.Models;

namespace PST.Api.Controllers
{
    [RoutePrefix("api/setup")]
    public class InitSetupController : ApiControllerBase
    {
        private readonly IEntityRepository _entityRepository;

        public InitSetupController(IEntityRepository entityRepository)
        {
            _entityRepository = entityRepository;
        }

        [HttpPut]
        [Route("insert")]
        public Guid Insert()
        {
            /* SQL TO DELETE ALL COURSE DATA
                delete from progress
                delete from [option]
                delete from question
                delete from StateCEU
                delete from questioned where not courseid is null
                delete from PrerequisiteCourses
                delete from course
                delete from questioned
                delete from category where not ParentCategoryID is null
                delete from category
            */

            
            // ADD TO EXISTING CATEGORY:
            //var subcategory = _entityRepository.GetByID<SubCategory>("".ToGuid());
            
            // ADD TO NEW CATEGORY:
            var category = new MainCategory {Title = "Main Cat"};
            _entityRepository.Save(category);

            var subcategory = new SubCategory(category) {Title = "Sub Cat"};
            _entityRepository.Save(subcategory);

            var course = new Course
            {
                Title = "Test Course 1",
                DateCreatedUtc = DateTime.UtcNow,
                StateCEUs = new List<StateCEU>
                {
                    new StateCEU {StateAbbr = "OH", CategoryCode = "a", Hours = 1}
                },
                Category = subcategory,
                Status = CourseStatus.Active,
                Sections = new List<Section>
                {
                    new Section
                    {
                        Title = "Section 1",
                        SortOrder = 1,
                        Document = new Document
                        {
                            PageCount = 2,
                            PDFUrl = "app/temp/sample.pdf",
                            PageImageUrlFormat = "app/css/images/temp/pdf-placeholder{0}.jpg"
                        },
                        Questions = new List<Question>
                        {
                            new SingleImageQuestion
                            {
                                QuestionText = "S1 Question 1",
                                CorrectResponseHeading = "Correct!",
                                CorrectResponseText = "Yay",
                                ImageUrl = "app/css/images/temp/img-answer-large.jpg",
                                SortOrder = 1,
                                Options = new List<Option>
                                {
                                    new TextOption {Text = "Wrong", Correct = false, SortOrder = 1},
                                    new TextOption {Text = "Right", Correct = true, SortOrder = 2}
                                }
                            },
                            new TextQuestion
                            {
                                QuestionText = "S1 Question 2",
                                CorrectResponseHeading = "Correct!",
                                CorrectResponseText = "Yay",
                                SortOrder = 2,
                                Options = new List<Option>
                                {
                                    new TextOption {Text = "Right", Correct = true, SortOrder = 1},
                                    new TextOption {Text = "Also Right", Correct = true, SortOrder = 2},
                                    new TextOption {Text = "Wrong", Correct = false, SortOrder = 3}
                                }
                            }
                        }
                    },
                    new Section
                    {
                        Title = "Section 2",
                        SortOrder = 2,
                        Document = new Document
                        {
                            PageCount = 2,
                            PDFUrl = "app/temp/sample.pdf",
                            PageImageUrlFormat = "app/css/images/temp/pdf-placeholder{0}.jpg"
                        },
                        Questions = new List<Question>
                        {
                            new SingleImageQuestion
                            {
                                QuestionText = "S2 Question 1",
                                CorrectResponseHeading = "Correct!",
                                CorrectResponseText = "Yay",
                                ImageUrl = "app/css/images/temp/img-answer-large.jpg",
                                SortOrder = 1,
                                Options = new List<Option>
                                {
                                    new TextOption {Text = "Wrong", Correct = false, SortOrder = 1},
                                    new TextOption {Text = "Right", Correct = true, SortOrder = 2}
                                }
                            },
                            new TextQuestion
                            {
                                QuestionText = "S2 Question 2",
                                CorrectResponseHeading = "Correct!",
                                CorrectResponseText = "Yay",
                                SortOrder = 2,
                                Options = new List<Option>
                                {
                                    new TextOption {Text = "Right", Correct = true, SortOrder = 1},
                                    new TextOption {Text = "Also Right", Correct = true, SortOrder = 2},
                                    new TextOption {Text = "Wrong", Correct = false, SortOrder = 3}
                                }
                            }
                        }
                    }
                },
                Test = new Test
                {
                    Title = "Test Title",
                    Questions = new List<Question>
                        {
                            new SingleImageQuestion
                            {
                                QuestionText = "T Question 1",
                                CorrectResponseHeading = "Correct!",
                                CorrectResponseText = "Yay",
                                ImageUrl = "app/css/images/temp/img-answer-large.jpg",
                                SortOrder = 1,
                                Options = new List<Option>
                                {
                                    new TextOption {Text = "Wrong", Correct = false, SortOrder = 1},
                                    new TextOption {Text = "Right", Correct = true, SortOrder = 2}
                                }
                            },
                            new TextQuestion
                            {
                                QuestionText = "T Question 2",
                                CorrectResponseHeading = "Correct!",
                                CorrectResponseText = "Yay",
                                SortOrder = 2,
                                Options = new List<Option>
                                {
                                    new TextOption {Text = "Right", Correct = true, SortOrder = 1},
                                    new TextOption {Text = "Also Right", Correct = true, SortOrder = 2},
                                    new TextOption {Text = "Wrong", Correct = false, SortOrder = 3}
                                }
                            }
                        }
                }
            };
            _entityRepository.Save(course);

            var StateLicensure = new StateLicensure
            {
                LicenseNum = "12345",
                Category = "cat1",
                StateAbbr = "LA"
            };
            _entityRepository.Save(StateLicensure);


            return course.ID;
        }

        [HttpPut]
        [Route("progress/{courseID}")]
        public void Progress(Guid courseID)
        {
            var course = _entityRepository.GetByID<Course>(courseID);

            var courseProgress = new CourseProgress
            {
                Course = course,
                LastActivityUtc = DateTime.UtcNow,
                TestProgress =
                    new TestProgress
                    {
                        Test = course.Test,
                        TotalQuestions = 2,
                        TriesLeft = 3,
                        LastActivityUtc = DateTime.UtcNow
                    },
                Sections = new List<SectionProgress>
                {
                    new SectionProgress
                    {
                        Section = course.Sections[0],
                        TotalQuestions = 2,
                        LastActivityUtc = DateTime.UtcNow,
                        CompletedQuestions = new List<QuestionProgress>
                        {
                            new QuestionProgress
                            {
                                Question = course.Sections[0].Questions[0],
                                LastActivityUtc = DateTime.UtcNow
                            }
                        }
                    },
                    new SectionProgress
                    {
                        Section = course.Sections[1],
                        TotalQuestions = 2,
                        LastActivityUtc = DateTime.UtcNow
                    }
                }
            };

            _entityRepository.Save(courseProgress);

            var account = _entityRepository.GetByID<Account>(CurrentUserID);
            //account.CourseProgress.Add(courseProgress);
            //_entityRepository.Save(account);
        }
    }
}