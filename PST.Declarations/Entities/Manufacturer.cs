using Prototype1.Foundation.Data;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    public class Manufacturer : EntityBase
    {
        public virtual string Name { get; set; }

        public virtual string ImageUrl { get; set; }

        public static implicit operator manufacturer(Manufacturer manufacturer)
        {
            if(manufacturer == null)
                return new manufacturer();

            return new manufacturer
            {
                manufacturer_id = manufacturer.ID,
                name = manufacturer.Name,
                image_url = manufacturer.ImageUrl
            };
        }
    }
}