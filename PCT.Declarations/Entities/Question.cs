using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Interfaces;
using PCT.Declarations.Interfaces;
using PCT.Declarations.Models;
using PCT.Declarations.Models.Management;

namespace PCT.Declarations.Entities
{
    [Serializable]
    public abstract class Question : EntityBase, ISorted, IPermanentRecord
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

        protected abstract void SetCustomModelProperties<TQuestion>(TQuestion question) where TQuestion : question_base;

        public virtual TQuestion ToModel<TQuestion>()
            where TQuestion : question_base, new()
        {
            var question = new TQuestion
            {
                question_id = ID,
                question_text = QuestionText,
                options = Options.Select(o => o.ToModel()).ToArray(),
                multi_select = Options.Count(o => o.Correct) > 1,
                option_type = question_base.option_types.text,
                tip = Tip
            };


            var questionWithAnswers = question as question_with_answers;
            if (questionWithAnswers != null)
                questionWithAnswers.answer = new answer_result(ID, true, CorrectResponseHeading, CorrectResponseText,
                    Options.Where(o => o.Correct).Select(o => o.ID).ToArray());

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
            QuestionText = CleanMarkdown(model.question_text);
            CorrectResponseHeading = CleanMarkdown(model.response_heading);
            CorrectResponseText = CleanMarkdown(model.response_message);
            Tip = CleanMarkdown(model.tip);
            SortOrder = sortOrder;

            SetCustomEntityProperties(model);

            SyncOptionsFromManagementModel(model);
        }

        public virtual bool Deleted { get; set; }

        private static string CleanMarkdown(string str)
        {
            if (str.IsNullOrEmpty()) return str;
            return Regex.Replace(str, @"\[[u,i,b]\][ ]*\[/[u,i,b]\]", "").Replace("  ", " ").Trim();
        }
    }

    [Serializable]
    public abstract class Question<TOption> : Question
        where TOption : Option, new()
    {
        public override void SyncOptionsFromManagementModel(m_question model)
        {
            if (model.options == null) return;

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

        protected override void SetCustomModelProperties<TQuestion>(TQuestion question)
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

        protected override void SetCustomModelProperties<TQuestion>(TQuestion question)
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

        protected override void SetCustomModelProperties<TQuestion>(TQuestion question)
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

        protected override void SetCustomModelProperties<TQuestion>(TQuestion question)
        {
            question.option_type = question_base.option_types.image;
        }

        protected override void SetCustomManagementModelProperties(m_question question)
        {
        }

        protected override void SetCustomEntityProperties(m_question model)
        {
        }
    }
}