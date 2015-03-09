using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace PST.Services
{
    public class EnumAttributedFactoryFactory<TType, TAttribute, TEnum>
    {
        private static readonly Dictionary<TEnum, Type> Map = InitializeMap();

        private static Dictionary<TEnum, Type> InitializeMap()
        {
            var map = new Dictionary<TEnum, Type>();

            var entryTypes = new List<Type>();
            foreach (
                var assemblyName in
                    Assembly.GetExecutingAssembly()
                        .GetReferencedAssemblies()
                        .Where(
                            a =>
                                a.FullName.StartsWith(
                                    Assembly.GetExecutingAssembly().FullName.Split('.').FirstOrDefault() ?? "Prototype1"))
                        .Select(a => a.FullName).Union(new[] {Assembly.GetExecutingAssembly().FullName}))
                entryTypes.AddRange(Assembly.Load(assemblyName)
                    .GetTypes()
                    .Where(t => typeof (TType).IsAssignableFrom(t)));

            foreach (var entryType in entryTypes)
            {
                var attribute =
                    entryType.GetCustomAttributes(typeof(TAttribute), false)
                        .OfType<TAttribute>()
                        .FirstOrDefault();

                if (attribute == null)
                    continue;

                var property = typeof(TAttribute).GetProperty(typeof(TEnum).Name);
                if (property == null)
                    continue;

                var enumValue = (TEnum)property.GetValue(attribute);

                if (map.ContainsKey(enumValue))
                    throw new Exception(
                        string.Format("Duplicate entry in factory map - TAttribute: {0}; {1}: {2}",
                            typeof(TAttribute).Name, typeof(TEnum).Name, enumValue));

                map.Add(enumValue, entryType);
            }

            return map;
        }

        public TType Create(TEnum enumValue)
        {
            if (!Map.ContainsKey(enumValue))
                throw new Exception(
                        string.Format("Attempting to create an unregistered instance - TAttribute: {0}; {1}: {2}",
                            typeof(TAttribute).Name, typeof(TEnum).Name, enumValue));

            var entryType = Map[enumValue];

            return (TType)Activator.CreateInstance(entryType);
        }
    }
}