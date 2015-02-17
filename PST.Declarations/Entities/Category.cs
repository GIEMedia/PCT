using System;
using System.Collections.Generic;
using Prototype1.Foundation.Data;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Category : EntityBase
    {
        public virtual string Title { get; set; }
    }

    [Serializable]
    public class MainCategory : Category
    {
        public MainCategory()
        {
            this.SubCategories = new List<Category>();
        }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<Category> SubCategories { get; set; }
    }

    [Serializable]
    public class SubCategory : Category
    {
    }
}