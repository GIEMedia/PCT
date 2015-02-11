using System;
using System.Collections.Generic;
using Prototype1.Foundation.Data;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Category : EntityBase
    {
        public Category()
        {
            this.SubCategories = new List<Category>();
        }

        public virtual string Title { get; set; }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<Category> SubCategories { get; set; }
    }
}