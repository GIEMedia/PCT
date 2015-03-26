using System;
using Prototype1.Foundation.Data;
using PST.Declarations.Models.Management;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class StateCEU : EntityBase
    {
        public virtual string StateAbbr { get; set; }

        public virtual string CategoryCode { get; set; }

        public virtual decimal Hours { get; set; }

        public static implicit operator m_state_ceu(StateCEU stateCEU)
        {
            if (stateCEU == null)
                return new m_state_ceu();

            return new m_state_ceu
            {
                id = stateCEU.ID,
                state = stateCEU.StateAbbr,
                category_code = stateCEU.CategoryCode,
                hours = stateCEU.Hours
            };
        }
    }
}