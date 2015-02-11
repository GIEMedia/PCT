using System;
using System.Collections;
using Prototype1.Foundation.Data;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class StateCEU : EntityBase
    {
        public virtual string StateAbbr { get; set; }

        public virtual string CategoryCode { get; set; }

        public virtual decimal Hours { get; set; }
    }
}