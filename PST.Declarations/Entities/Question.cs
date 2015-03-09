using System;
using System.Collections.Generic;
using System.Linq;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using PST.Declarations.Interfaces;
using PST.Declarations.Models;
using PST.Declarations.Models.Management;

namespace PST.Declarations.Entities
{
    [Serializable]
    public abstract class Question : EntityBase, ISorted
    {
        public Question()
        {
            this.Options = new List<Option>();
        }

        public virtual string QuestionText { get; set; }

        public virtual string CorrectResponseHeading { get; set; }

        public virtual string CorrectResponseText { get; set; }

        public virtual string Tip { get; set; }

        [Ownership(Ownership.Exclusive)]
        public virtual IList<Option> Options { get; set; }

        public virtual int SortOrder { get; set; }

        [Transient]
        public abstract QuestionType QuestionType { get; }

        protected abstract void SetCustomModelProperties(question question);

        public virtual question ToModel()
        {
            var question = new question
            {
                question_id = ID,
                question_text = QuestionText,
                options = Options.Select(o => o.ToModel()).ToArray(),
                multi_select = Options.Count(o => o.Correct) > 1,
                option_type = Models.question.option_types.text,
                tip = Tip
            };

            SetCustomModelProperties(question);

            return question;
        }

        protected abstract void SetCustomManagementModelProperties(m_question question);

        public virtual m_question ToManagementModel()
        {
            var question = new m_question
            {
                id = ID,
                question_text = QuestionText,
                options = Options.Select(o => o.ToManagementModel()).ToArray(),
                response_heading = CorrectResponseHeading,
                response_message = CorrectResponseText,
                tip = Tip,
                question_type = QuestionType
            };

            SetCustomManagementModelProperties(question);

            return question;
        }

        protected abstract void SetCustomEntityProperties(m_question model);

        public abstract void SyncOptionsFromManagementModel(m_question model);

        public virtual void FromManagementModel(m_question model, int sortOrder)
        {
            QuestionText = model.question_text;
            CorrectResponseHeading = model.response_heading;
            CorrectResponseText = model.response_message;
            Tip = model.tip;
            SortOrder = sortOrder;

            SetCustomEntityProperties(model);

            SyncOptionsFromManagementModel(model);
        }
    }

    [Serializable]
    public abstract class Question<TOption> : Question
        where TOption : Option, new()
    {
        public override void SyncOptionsFromManagementModel(m_question model)
        {
            // Remove any options that existed but no longer in the model
            this.Options.Where(o => !model.options.Select(x => x.id).Contains(o.ID))
                .ToList()
                .Apply(o => this.Options.Remove(o));

            for (var i = 0; i < model.options.Length; i++)
            {
                var o = model.options[i];
                var found = false;
                Option option = null;
                if (!o.id.IsNullOrEmpty())
                {
                    option = this.Options.FindById(o.id);
                    found = true;
                }
                if (option == null)
                    option = new TOption();
                option.FromManagementModel(o, i);

                if (!found)
                    this.Options.Add(option);
            }
        }
    }

    [Serializable]
    [QuestionType(QuestionType.SingleImage)]
    public class SingleImageQuestion : Question<TextOption>
    {
        public virtual string ImageUrl { get; set; }

        [Transient]
        public override QuestionType QuestionType
        {
            get { return QuestionType.SingleImage; }
        }

        protected override void SetCustomModelProperties(question question)
        {
            question.image = ImageUrl;
        }

        protected override void SetCustomManagementModelProperties(m_question question)
        {
            question.image = ImageUrl;
        }

        protected override void SetCustomEntityProperties(m_question model)
        {
            ImageUrl = model.image;
        }
    }

    [Serializable]
    [QuestionType(QuestionType.Video)]
    public class VideoQuestion : Question<TextOption>
    {
        public virtual string Mp4Url { get; set; }

        [Transient]
        public override QuestionType QuestionType
        {
            get { return QuestionType.Video; }
        }

        protected override void SetCustomModelProperties(question question)
        {
            question.video = new video { mp4 = Mp4Url };
        }

        protected override void SetCustomManagementModelProperties(m_question question)
        {
            question.video = new video { mp4 = Mp4Url };
        }

        protected override void SetCustomEntityProperties(m_question model)
        {
            Mp4Url = (model.video ?? new video()).mp4;
        }
    }

    [Serializable]
    [QuestionType(QuestionType.Text)]
    public class TextQuestion : Question<TextOption>
    {
        [Transient]
        public override QuestionType QuestionType
        {
            get { return QuestionType.Text; }
        }

        protected override void SetCustomModelProperties(question question)
        {
        }

        protected override void SetCustomManagementModelProperties(m_question question)
        {
        }

        protected override void SetCustomEntityProperties(m_question model)
        {
        }
    }

    [Serializable]
    [QuestionType(QuestionType.MultiImage)]
    public class MultiImageQuestion : Question<ImageOption>
    {
        [Transient]
        public override QuestionType QuestionType
        {
            get { return QuestionType.MultiImage; }
        }

        protected override void SetCustomModelProperties(question question)
        {
            question.option_type = question.option_types.image;
        }

        protected override void SetCustomManagementModelProperties(m_question question)
        {
        }

        protected override void SetCustomEntityProperties(m_question model)
        {
        }
    }
}