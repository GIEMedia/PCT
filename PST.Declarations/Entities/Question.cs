using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation.Data;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    [Serializable]
    public abstract class Question : EntityBase
    {
        public Question()
        {
            this.Options = new List<Option>();
            this.Answered = false;
        }

        public virtual string QuestionText { get; set; }

        public virtual string CorrectResponseHeading { get; set; }

        public virtual string CorrectResponseText { get; set; }

        public virtual string Tip { get; set; }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<Option> Options { get; set; }

        [Transient]
        public virtual bool Answered { get; set; }
    }

    [Serializable]
    public abstract class Question<TOption> : Question
        where TOption : Option
    {
        protected abstract void SetCustomModelProperties(question question);

        public question ToModel()
        {
            var question = new question
            {
                question_id = ID,
                question_text = QuestionText,
                options = Options.OfType<TOption>().Select(o => o.ToModel()).ToArray(),
                multi_select = Options.Count(o => o.Correct) > 1,
                option_type = Models.question.option_types.text,
                answered = Answered
            };

            SetCustomModelProperties(question);

            return question;
        }
    }

    [Serializable]
    public class SingleImageQuestion : Question<TextOption>
    {
        public virtual string ImageUrl { get; set; }

        protected override void SetCustomModelProperties(question question)
        {
            question.image = ImageUrl;
        }
    }

    [Serializable]
    public class VideoQuestion : Question<TextOption>
    {
        public virtual string Mp4Url { get; set; }

        protected override void SetCustomModelProperties(question question)
        {
            question.video = new video { mp4 = Mp4Url };
        }
    }

    [Serializable]
    public class TextQuestion : Question<TextOption>
    {
        protected override void SetCustomModelProperties(question question)
        {
        }
    }

    [Serializable]
    public class MultiImageQuestion : Question<ImageOption>
    {
        protected override void SetCustomModelProperties(question question)
        {
            question.option_type = question.option_types.image;
        }
    }
}