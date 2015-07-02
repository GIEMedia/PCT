using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Data.NHibernate;
using Prototype1.Foundation.Interfaces;

namespace PCT.Tests
{
    public class TransientEntityRepository : IEntityRepository
    {
        private readonly Dictionary<Guid, IIdentifiable<Guid>> _entities = new Dictionary<Guid, IIdentifiable<Guid>>();

        public void Save<T>(T obj) where T : IIdentifiable<Guid>
        {
            ExtractEntities(obj);
            SaveEntity(obj);
        }

        public void Delete<T>(T obj) where T : IIdentifiable<Guid>
        {
            if (_entities.ContainsKey(obj.ID))
                _entities.Remove(obj.ID);
        }

        public T GetByID<T>(Guid id) where T : IIdentifiable<Guid>
        {
            return _entities.ContainsKey(id) ? _entities[id].As<T>() : default(T);
        }

        public IIdentifiable<Guid> GetByID(Guid id, Type type)
        {
            if (_entities.ContainsKey(id) && type.IsAssignableFrom(_entities[id].GetType()))
                return _entities[id];

            return null;
        }

        public IEnumerable<T> GetAll<T>() where T : IIdentifiable<Guid>
        {
            return _entities.Values.OfType<T>();
        }

        public IQueryable<T> Queryable<T>() where T : IIdentifiable<Guid>
        {
            return _entities.Values.OfType<T>().AsQueryable();
        }

        private void ExtractEntities<T>(T entity)
            where T : IIdentifiable<Guid>
        {
            var processedEntities = new List<EntityBase>();
            foreach (var child in (entity as EntityBase).ExtractAllEntities(processedEntities, true, false))
            {
                SaveEntity(child);
            }
        }

        private void SaveEntity(IIdentifiable<Guid> entity)
        {
            if (entity.ID.Equals(Guid.Empty) && entity is EntityBase)
                ((EntityBase)entity).SetID(Guid.NewGuid());

            if (entity is IVersioned)
            {
                IncrementVersion(entity.As<IVersioned>());
            }

            _entities[entity.ID] = entity;
        }

        private void IncrementVersion(IVersioned entity)
        {
            var version = entity.Version;
            if (version < 0)
            {
                if (entity.GetType().GetField("_version", BindingFlags.Instance | BindingFlags.NonPublic) == null)
                {
                    //let's check to see if the property exists on the base type if it is a child
                    var t = entity.GetType().BaseType;
                    while (t != null && t.GetField("_version", BindingFlags.Instance | BindingFlags.NonPublic) == null)
                    {
                        t = t.BaseType;
                    }

                    if (t == null || t.GetField("_version", BindingFlags.Instance | BindingFlags.NonPublic) == null)
                        throw new Exception("_version field not found");

                    t.GetField("_version", BindingFlags.Instance | BindingFlags.NonPublic).SetValue(entity, ++version);

                    return;
                }
                entity.GetType()
                      .GetField("_version", BindingFlags.Instance | BindingFlags.NonPublic)
                      .SetValue(entity, ++version);
            }
        }
    }

    public static class EntityPropertyHelper
    {
        //TODO: this could be further optimized by splitting the collection in two, references and collections, and refactoring ExtractAllEntitiesREcursive to take advantage.
        private static readonly Dictionary<Type, IEnumerable<PropertyInfo>> _propertyMap = new Dictionary<Type, IEnumerable<PropertyInfo>>();
        private static readonly object _propertyMapLock = new object();

        public static IEnumerable<EntityBase> ExtractAllEntities(this EntityBase entity, IList<Guid> processedObjects, bool recursive = false, bool includeTransient = false)
        {
            var properties = GetEntityProperties<EntityBase>(entity).ToList();

            if (!includeTransient)
                properties = properties.Where(p => !p.IsTransient()).ToList();

            var references = (from property in properties
                              where property.PropertyType.IsSubclassOf(typeof(EntityBase))
                              let item = property.GetValue(entity, null) as EntityBase
                              where item != null
                              select item).Distinct().ToArray();

            var collections = (from property in properties
                               where typeof(IEnumerable<EntityBase>).IsAssignableFrom(property.PropertyType)
                               let list = property.GetValue(entity, null) as IEnumerable<EntityBase>
                               where list != null
                               from item in list
                               where item != null
                               select item).Distinct().ToArray();

            foreach (var item in collections.Union(references))
            {
                if (!processedObjects.Contains(item.ID))
                {
                    processedObjects.Add(item.ID);
                    yield return item;
                    if (recursive)
                    {
                        foreach (var child in ExtractAllEntities(item, processedObjects, true))
                        {
                            yield return child;
                        }
                    }
                }
            }
        }

        public static IEnumerable<T> ExtractAllEntities<T>(this T entity, IList<T> processedObjects, bool recursive = false, bool includeTransient = false)
            where T : class
        {
            var properties = GetEntityProperties<T>(entity).ToList();

            if (!includeTransient)
                properties = properties.Where(p => !p.IsTransient()).ToList();

            var references = (from property in properties
                              where property.PropertyType.IsSubclassOf(typeof(T))
                              let item = property.GetValue(entity, null) as T
                              where item != null
                              select item).Distinct().ToArray();

            var collections = (from property in properties
                               where typeof(IEnumerable<T>).IsAssignableFrom(property.PropertyType)
                               let list = property.GetValue(entity, null) as IEnumerable<T>
                               where list != null
                               from item in list
                               where item != null
                               select item).Distinct().ToArray();

            foreach (var item in collections.Union(references))
            {
                if (!processedObjects.Contains(item))
                {
                    processedObjects.Add(item);
                    yield return item;
                    if (recursive)
                    {
                        foreach (var child in ExtractAllEntities<T>(item, processedObjects, true))
                        {
                            yield return child;
                        }
                    }
                }
            }
        }

        public static IEnumerable<PropertyInfo> GetEntityProperties<T>(this object obj)
        {
            if (obj == null)
                return new PropertyInfo[0];

            Type t = obj.GetType();
            IEnumerable<PropertyInfo> properties = null;
            if (!_propertyMap.ContainsKey(t))
            {
                lock (_propertyMapLock)
                {
                    if (!_propertyMap.ContainsKey(t))
                    {
                        properties = BuildPropertyMap<T>(t).ToArray();
                        _propertyMap[t] = properties;
                    }
                }
            }
            else
            {
                properties = _propertyMap[t];
            }
            return properties;
        }

        public static void SetID(this EntityBase entityBase, Guid id)
        {
            var property = typeof(EntityBase).GetProperty("ID");
            property.SetValue(entityBase, id);
        }

        private static IEnumerable<PropertyInfo> BuildPropertyMap<T>(Type t)
        {
            return t.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => (p.PropertyType.IsSubclassOf(typeof(T)) || typeof(IEnumerable<T>).IsAssignableFrom(p.PropertyType)));
        }
    }
}