using FluentNHibernate.Cfg;
using Prototype1.Foundation.Data.MagicMapper;
using PST.Declarations.Entities;

namespace PST.Data
{
    public class AutoMaps : IAutoMaps
    {
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
                a.Component(x => x.CompanyAddress, m =>
                {
                    m.Map(y => y.Address1, "CompanyAddress1");
                    m.Map(y => y.Address2, "CompanyAddress2");
                    m.Map(y => y.City, "CompanyCity");
                    m.Map(y => y.State, "CompanyState");
                    m.Map(y => y.ZipCode, "CompanyZipCode");
                    m.Map(y => y.Phone, "CompanyPhone");
                }));
        }
    }
}