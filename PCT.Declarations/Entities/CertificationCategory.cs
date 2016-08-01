using PCT.Declarations.Models;
using PCT.Declarations.Models.Management;
using Prototype1.Foundation.Data;

namespace PCT.Declarations.Entities
{
    public class CertificationCategory : EntityBase
    {
        public virtual string StateAbbr { get; set; }

        public virtual string Name { get; set; }

        public virtual string Number { get; set; }

        public static implicit operator certification_category(CertificationCategory category)
        {
            if (category == null)
                return new certification_category();

            return new certification_category
            {
                id = category.ID,
                state = category.StateAbbr,
                name = category.Name,
                number = category.Number
            };
        }

        public static implicit operator CertificationCategory(certification_category model)
        {
            var category = new CertificationCategory();
            category.SyncFromModel(model);
            category.ID = model.id;
            return category;
        }

        public virtual void SyncFromModel(certification_category category)
        {
            StateAbbr = category.state;
            Name = category.name;
            Number = category.number;
        }
    }
}