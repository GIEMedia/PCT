using System;
using System.Collections.Generic;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Interfaces;

namespace PST.Declarations.Entities
{
    [Serializable]
    public abstract class Questioned : EntityBase, IPermanentRecord
    {
        public Questioned()
        {
            this.Questions = new List<Question>();
        }

        public virtual string Title { get; set; }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<Question> Questions { get; set; }

        public abstract QuestionedProgress CreateAndAddProgress(CourseProgress courseProgress);

        public abstract QuestionedProgress GetProgress(CourseProgress courseProgress);
        public virtual bool Deleted { get; set; }
    }
}