using System;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Unity;
using Microsoft.Practices.Unity;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Certificate : EntityBase
    {
        public virtual DateTime EarnedUtc { get; set; }
    }
}