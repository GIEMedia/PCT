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

        //public abstract QuestionedProgress<QuestionProgress> CreateAndAddProgress(CourseProgress courseProgress);

        //public abstract QuestionedProgress<QuestionProgress> GetProgress(CourseProgress courseProgress);
        
        public virtual bool Deleted { get; set; }
    }

    public abstract class Questioned<TQuestionProgress> : Questioned
        where TQuestionProgress : QuestionProgressBase
    {
        public abstract QuestionedProgress<TQuestionProgress> CreateAndAddProgress(CourseProgress courseProgress);

        public abstract QuestionedProgress<TQuestionProgress> GetProgress(CourseProgress courseProgress);
    }
}