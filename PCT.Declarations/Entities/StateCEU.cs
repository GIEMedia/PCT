using System;
using Prototype1.Foundation.Data;
using PCT.Declarations.Models.Management;

namespace PCT.Declarations.Entities
{
    [Serializable]
    public class StateCEU : EntityBase
    {
        public virtual string StateAbbr { get; set; }

        public virtual CertificationCategory Category { get; set; }

        public virtual string ActivityID { get; set; }

        public virtual string ActivityType { get; set; }

        public virtual decimal Hours { get; set; }

        public static implicit operator m_state_ceu(StateCEU stateCEU)
        {
            if (stateCEU == null)
                return new m_state_ceu();

            return new m_state_ceu
            {
                id = stateCEU.ID,
                state = stateCEU.StateAbbr,
                activity_id = stateCEU.ActivityID,
                activity_type = stateCEU.ActivityType,
                category_id = stateCEU.Category?.ID,
                hours = stateCEU.Hours
            };
        }
    }
}