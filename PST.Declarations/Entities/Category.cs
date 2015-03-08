using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation.Data;
using PST.Declarations.Models.Management;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Category : EntityBase
    {
        public virtual string Title { get; set; }

        public static implicit operator m_category(Category category)
        {
            if (category == null)
                return new m_category();
            return new m_category
            {
                id = category.ID,
                title = category.Title
            };
        }
    }

    [Serializable]
    public class MainCategory : Category
    {
        public MainCategory()
        {
            this.SubCategories = new List<SubCategory>();
        }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<SubCategory> SubCategories { get; set; }

        public static implicit operator m_main_category(MainCategory category)
        {
            if (category == null)
                return new m_main_category();
            return new m_main_category
            {
                id = category.ID,
                title = category.Title,
                sub_categories = category.SubCategories.Select(s => (m_category) s).ToArray()
            };
        }

        public static implicit operator m_category(MainCategory category)
        {
            return (Category) category;
        }
    }

    [Serializable]
    public class SubCategory : Category
    {
        public SubCategory()
        {
        }

        public SubCategory(MainCategory parentCategory)
        {
            this.ParentCategory = parentCategory;
        }

        [Ownership(Ownership.None)]
        public virtual MainCategory ParentCategory { get; set; }
    }
}