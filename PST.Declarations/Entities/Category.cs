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
            this.SubCategories = new List<SubCategory>();
        }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<SubCategory> SubCategories { get; set; }
    }

    [Serializable]
    public class SubCategory : Category
    {
    }
}