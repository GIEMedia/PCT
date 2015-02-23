using System;

namespace PST.Declarations.Models
{
    public class section : questioned
    {
        public Guid section_id { get; set; }

        public document document { get; set; }
    }
}