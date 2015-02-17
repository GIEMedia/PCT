﻿using FluentNHibernate.Cfg;
using NHibernate.Type;
using Prototype1.Foundation.Data.MagicMapper;
using PST.Declarations.Entities;

namespace PST.Data
{
    public class AutoMaps : IAutoMaps
    {
        private const int Max = 4001;

        public void Map(MappingConfiguration m)
        {
            var mapper = new MagicMapper(m);
            mapper.LoadInterfaceMappingsFromAssemblyOf<AutoMaps>();
            MapRootEntities(mapper);
            m.HbmMappings.AddFromAssemblyOf<AutoMaps>();
        }

        private static void MapRootEntities(MagicMapper mapper)
        {
            mapper.Add().TableFor<Account>(a =>
            {
                a.Component(x => x.CompanyAddress, m =>
                {
                    m.Map(y => y.Address1, "CompanyAddress1");
                    m.Map(y => y.Address2, "CompanyAddress2");
                    m.Map(y => y.City, "CompanyCity");
                    m.Map(y => y.State, "CompanyState");
                    m.Map(y => y.ZipCode, "CompanyZipCode");
                    m.Map(y => y.Phone, "CompanyPhone");
                });
                a.HasMany(x => x.CourseProgress).LazyLoad().Cascade.AllDeleteOrphan();
                a.HasMany(x => x.Managers).LazyLoad().Cascade.AllDeleteOrphan();
                a.HasMany(x => x.StateLicensures).LazyLoad().Cascade.AllDeleteOrphan();
            });

            mapper.Add().TableFor<Certificate>(c => c.Map(x => x.EarnedUtc).CustomType<UtcDateTimeType>());

            mapper.Add().TableFor<Course>(c =>
            {
                c.Map(x => x.DateCreatedUtc).CustomType<UtcDateTimeType>();
                c.HasMany(x => x.StateCEUs).KeyColumn("CourseID").LazyLoad().Cascade.AllDeleteOrphan();
                c.HasManyToMany(x => x.PrerequisiteCourses)
                    .Table("PrerequisiteCourses")
                    .ParentKeyColumn("CourseID")
                    .ChildKeyColumn("PrerequisiteCourseID")
                    .LazyLoad()
                    .Cascade.None();
                c.HasMany(x => x.Sections).KeyColumn("CourseID").OrderBy("SortOrder").LazyLoad().Cascade.AllDeleteOrphan();
            });

            mapper.Add().TableForHierarchy<Category>(c =>
            {
                c.AddSubclass().OfType<MainCategory>(x =>
                    x.HasMany(y => y.SubCategories)
                        .KeyColumn("ParentCategoryID")
                        .Not.LazyLoad()
                        .Cascade.AllDeleteOrphan());
                c.AddSubclass().OfType<SubCategory>();
            });

            mapper.Add().TableFor<Document>();

            mapper.Add().TableForHierarchy<Option>(o =>
            {
                o.AddSubclass().OfType<TextOption>();
                o.AddSubclass().OfType<ImageOption>();
            });

            mapper.Add().TableFor<Manager>();

            mapper.Add().TableForHierarchy<Progress>(p =>
            {
                p.AddSubclass()
                    .OfType<CourseProgress>(x =>
                    {
                        x.HasMany(y => y.Sections).KeyColumn("ParentProgressID").Not.LazyLoad().Cascade.AllDeleteOrphan();
                        x.References(y => y.TestProgress).Not.LazyLoad().Cascade.All();
                        x.References(y => y.Certificate).Not.LazyLoad().Cascade.All();
                        x.References(y => y.Course).Column("ItemID").LazyLoad().Cascade.None();
                        x.Map(y => y.TotalSections).Column("Total");
                    });
                p.AddSubclass()
                    .OfType<SectionProgress>(x =>
                    {
                        x.References(y => y.Section).Column("ItemID").LazyLoad().Cascade.None();
                        x.HasMany(y => y.CompletedQuestions).KeyColumn("ParentProgressID").Not.LazyLoad().Cascade.AllDeleteOrphan();
                        x.Map(y => y.TotalQuestions).Column("Total");
                    });
                p.AddSubclass()
                    .OfType<TestProgress>(x =>
                    {
                        x.HasMany(y => y.CompletedQuestions).KeyColumn("ParentProgressID").Not.LazyLoad().Cascade.AllDeleteOrphan();
                        x.References(y => y.Test).Column("ItemID").LazyLoad().Cascade.None();
                        x.Map(y => y.TotalQuestions).Column("Total");
                    });
                p.AddSubclass()
                    .OfType<QuestionProgress>(x =>
                        x.References(y => y.Question).Column("ItemID").LazyLoad().Cascade.None());

                p.Map(x => x.LastActivityUtc).CustomType<UtcDateTimeType>();
            });

            mapper.Add().TableForHierarchy<Question>(q =>
            {
                q.Map(x => x.QuestionText).Length(Max);
                q.Map(x => x.CorrectResponseHeading).Length(Max);
                q.Map(x => x.CorrectResponseText).Length(Max);
                q.HasMany(x => x.Options).Not.LazyLoad().Cascade.AllDeleteOrphan();
                q.AddSubclass().OfType<SingleImageQuestion>();
                q.AddSubclass().OfType<VideoQuestion>();
                q.AddSubclass().OfType<MultiImageQuestion>();
                q.AddSubclass().OfType<TextQuestion>();
            });

            mapper.Add().TableForHierarchy<Questioned>(s =>
            {
                s.HasMany(x => x.Questions).OrderBy("SortOrder").Not.LazyLoad().Cascade.AllDeleteOrphan();
                s.AddSubclass().OfType<Section>(x => x.References(y => y.Document).Not.LazyLoad().Cascade.All());
                s.AddSubclass().OfType<Test>();
            });

            mapper.Add().TableFor<StateCEU>();

            mapper.Add().TableFor<StateLicensure>();
        }
    }
}