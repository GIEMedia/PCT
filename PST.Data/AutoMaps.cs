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
            mapper.Add().TableFor<Account>();
        }
    }
}