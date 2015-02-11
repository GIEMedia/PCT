using System;
using Prototype1.Foundation.Data;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Certificate : EntityBase
    {
        public virtual DateTime EarnedUtc { get; set; }
    }
}