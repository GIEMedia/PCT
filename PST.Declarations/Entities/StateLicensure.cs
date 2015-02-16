using Prototype1.Foundation.Data;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    public class StateLicensure : EntityBase
    {
        public virtual string StateAbbr { get; set; }

        public virtual string Category { get; set; }

        public virtual string LicenseNum { get; set; }

        public static implicit operator state_licensure(StateLicensure licensure)
        {
            return new state_licensure
            {
                state = licensure.StateAbbr,
                category = licensure.Category,
                license_num = licensure.LicenseNum
            };
        }

        public static implicit operator StateLicensure(state_licensure licensure)
        {
            return new StateLicensure
            {
                StateAbbr = licensure.state,
                Category = licensure.category,
                LicenseNum = licensure.license_num
            };
        }
    }
}