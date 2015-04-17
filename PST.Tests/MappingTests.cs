using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using FluentNHibernate.Cfg;
using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PST.Data;
using NHibernate.Tool.hbm2ddl;
using Prototype1.Foundation.Data.NHibernate;
using PST.Declarations.Entities;

namespace PST.Tests
{
    [TestClass]
    public class MappingTests
    {
        [TestMethod]
        public void OutputMagicMappings()
        {
            var tw = new StringWriter();
            GetFluentConfiguration(tw).BuildConfiguration().BuildMappings();
            Console.Write(tw.ToString());
        }

        [TestMethod]
        public void GenerateSchema()
        {
            GetFluentConfiguration()
                .ExposeConfiguration(cfg => new SchemaExport(cfg).Create(true, false))
                .BuildSessionFactory();
        }

        [TestMethod]
        public void CanCreateSessionFactory()
        {
            GetFluentConfiguration()
                .BuildSessionFactory();
        }

        private static FluentConfiguration GetFluentConfiguration(TextWriter exportMappingsTo = null)
        {
            return
                new SessionFactoryFactory(null, new AutoMaps()).Configuration("PST")
                    .Mappings(m => m.FluentMappings.ExportTo(exportMappingsTo));
        }
    }
}