using System;

namespace PST.Declarations.Models
{
    public class section : questioned
    {
        public Guid section_id { get; set; }

        public bool complete { get; set; }

        public string title { get; set; }

        public document document { get; set; }
    }
}