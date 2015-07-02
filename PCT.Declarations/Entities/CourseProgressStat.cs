using System;
using Prototype1.Foundation.Data;

namespace PCT.Declarations.Entities
{
    public class CourseProgressStat : EntityBase
    {
        public virtual int CourseInProgress { get; set; }

        public virtual int CourseCompleted { get; set; }

        public virtual int TestInProgress { get; set; }

        public virtual int TestCompleted { get; set; }

        public virtual DateTime? LastActivityUtc { get; set; }
    }
}