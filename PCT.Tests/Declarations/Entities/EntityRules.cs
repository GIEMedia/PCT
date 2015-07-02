using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization.Formatters.Binary;
using PCT.Declarations.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Providers;

namespace PCT.Tests.Declarations.Entities
{
    [TestClass]
    public class EntityRules
    {
        public static readonly Type[] TestTypes = new[] {typeof (Account), typeof (AccountBase)};

        [TestMethod]
        public void AllEntitiesInheritEntityBase()
        {
            var failed = false;
            var exclusions = new Type[] { };
            foreach (var testType in TestTypes)
            {
                var types =
                    testType.Assembly.GetTypes().Where(t => t.Namespace.IfNullOrEmpty("").Contains(".Entities")).OrderBy(t => t.Name);
                foreach (var type in types)
                {
                    if (exclusions.Contains(type) || type.IsAbstract || type.IsSealed || type.IsEnum || type.Namespace.IfNullOrEmpty("").EndsWith("Entities.Components"))
                        continue;

                    if(typeof (EntityBase).IsAssignableFrom(type))
                    {
                        Debug.WriteLine("PASS | " + type.Name);
                        continue;
                    }

                    failed = true;
                    Debug.WriteLine("FAIL | " + type.Name);
                }
            }
            Assert.IsFalse(failed);
        }

        [TestMethod]
        public void AllEntitiesInitializeLists()
        {
            var failed = false;
            var exclusions = new Type[] { };
            foreach (var testType in TestTypes)
            {
                var types =
                    testType.Assembly.GetTypes().Where(t => t.Namespace.IfNullOrEmpty("").Contains(".Entities")).OrderBy(t => t.Name);
                foreach (var type in types)
                {
                    if (exclusions.Contains(type) || type.IsAbstract || type.IsSealed || type.IsEnum || type.Namespace.IfNullOrEmpty("").EndsWith("Entities.Components"))
                        continue;

                    if (typeof(EntityBase).IsAssignableFrom(type))
                    {
                        var lists = type.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                            .Where(t => t.PropertyType.GetInterfaces()
                                .Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof (ICollection<>)));

                        if (lists.Any())
                        {
                            var obj = Activator.CreateInstance(type);
                            foreach (var list in lists)
                            {
                                var val = list.GetValue(obj, null);
                                if (val == null)
                                {
                                    Debug.WriteLine("FAIL | " + type.Name + "." + list.Name);
                                    failed = true;
                                }
                                else
                                    Debug.WriteLine("PASS | " + type.Name + "." + list.Name);
                            }
                        }
                    }
                }
            }
            Assert.IsFalse(failed);
        }

        [TestMethod]
        public void AllEntitiesInitializeComponents()
        {
            var failed = false;
            var exclusions = new Type[] { };
            foreach (var testType in TestTypes)
            {
                var types =
                    testType.Assembly.GetTypes().Where(t => t.Namespace.IfNullOrEmpty("").Contains(".Entities")).OrderBy(t => t.Name);
                foreach (var type in types)
                {
                    if (exclusions.Contains(type) || type.IsAbstract || type.IsSealed || type.IsEnum || type.Namespace.IfNullOrEmpty("").EndsWith("Entities.Components"))
                        continue;

                    if (typeof(EntityBase).IsAssignableFrom(type))
                    {
                        var components = type.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                            .Where(t => t.PropertyType.Namespace.EndsWith("Entities.Components"));

                        if (components.Any())
                        {
                            var obj = Activator.CreateInstance(type);
                            foreach (var list in components)
                            {
                                var val = list.GetValue(obj, null);
                                if (val == null)
                                {
                                    Debug.WriteLine("FAIL | " + type.Name + "." + list.Name);
                                    failed = true;
                                }
                                else
                                    Debug.WriteLine("PASS | " + type.Name + "." + list.Name);
                            }
                        }
                    }
                }
            }
            Assert.IsFalse(failed);
        }

        [TestMethod]
        public void CanSerializeAllEntities()
        {
            var success = true;
            foreach (var testType in TestTypes)
            {
                var declarations = testType.Assembly;
                var types = declarations.GetTypes().Where(
                    t => t.Namespace != null
                         && t.Namespace.Contains("Entities")
                         && (typeof (EntityBase).IsAssignableFrom(t) || t.Namespace.EndsWith("Entities.Components"))
                         && !t.IsAbstract).OrderBy(t => t.Name);

                foreach (var type in types)
                {
                    try
                    {
                        var storage = new byte[5242880];
                        var obj = Activator.CreateInstance(type);
                        Serialize(obj, storage);
                        var des = Deserialize(storage);

                        Assert.IsTrue(des.GetType() == type);

                        Debug.WriteLine("PASS | " + type.Name);
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine("FAIL | " + type.Name + " | " + ex.GetType().Name + " | " + ex.Message);
                        success = false;
                    }
                }
            }

            Assert.IsTrue(success);
        }

        private static void Serialize(object o, byte[] storage)
        {
            using (var fs = new MemoryStream(storage))
            {
                var formatter = new BinaryFormatter();
                formatter.Serialize(fs, o);
                fs.Close();
            }
        }

        private static object Deserialize(byte[] storage)
        {
            object blah;
            using (var fs = new MemoryStream(storage))
            {
                var formatter = new BinaryFormatter();
                blah = formatter.Deserialize(fs);
                fs.Close();
            }
            return blah;
        }
    }
}
