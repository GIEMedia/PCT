using System;
using System.ComponentModel.DataAnnotations;
using PCT.Declarations.Models;

namespace PCT.Declarations.Entities.Components
{
    [Serializable]
    public class Address
    {
        public Address()
        {
        }

        public virtual string Address1 { get; set; }

        public virtual string Address2 { get; set; }

        public virtual string City { get; set; }

        public virtual string State { get; set; }

        [DataType(DataType.PostalCode)]
        public virtual string ZipCode { get; set; }

        [DataType(DataType.PhoneNumber)]
        public virtual string Phone { get; set; }

        public static implicit operator address(Address address)
        {
            if (address == null)
                return new address();

            return new address
            {
                address1 = address.Address1,
                address2 = address.Address2,
                city = address.City,
                state = address.State,
                zip_code = address.ZipCode,
                phone = address.Phone
            };
        }

        public static implicit operator Address(address address)
        {
            if (address == null)
                return new Address();

            return new Address
            {
                Address1 = address.address1,
                Address2 = address.address2,
                City = address.city,
                State = address.state,
                ZipCode = address.zip_code,
                Phone = address.phone
            };
        }
    }
}