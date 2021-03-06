﻿using System;
using Prototype1.Foundation.Data;
using Prototype1.Foundation.Interfaces;
using PCT.Declarations.Interfaces;
using PCT.Declarations.Models;
using PCT.Declarations.Models.Management;

namespace PCT.Declarations.Entities
{
    [Serializable]
    public abstract class Option : EntityBase, ISorted, IPermanentRecord
    {
        public virtual string Text { get; set; }

        public virtual bool Correct { get; set; }

        protected abstract void SetCustomModelProperties(option option);

        public virtual int SortOrder { get; set; }

        public virtual option ToModel()
        {
            var option = new option
            {
                option_id = ID,
                text = Text
            };

            SetCustomModelProperties(option);

            return option;
        }

        protected abstract void SetCustomManagementModelProperties(m_option option);

        public virtual m_option ToManagementModel()
        {
            var option = new m_option
            {
                id = ID,
                text = Text,
                correct = Correct
            };

            SetCustomManagementModelProperties(option);

            return option;
        }

        protected abstract void SetCustomEntityProperties(m_option model);

        public virtual Option FromManagementModel(m_option model, int sortOrder)
        {
            Text = model.text;
            SortOrder = sortOrder;
            Correct = model.correct;

            SetCustomEntityProperties(model);

            return this;
        }

        public virtual bool Deleted { get; set; }
    }

    [Serializable]
    public class TextOption : Option
    {
        protected override void SetCustomModelProperties(option option)
        {
        }

        protected override void SetCustomManagementModelProperties(m_option option)
        {
        }

        protected override void SetCustomEntityProperties(m_option model)
        {
        }
    }

    [Serializable]
    public class ImageOption : Option
    {
        public virtual string ImageUrl { get; set; }
        protected override void SetCustomModelProperties(option option)
        {
            option.image = ImageUrl;
        }

        protected override void SetCustomManagementModelProperties(m_option option)
        {
            option.image = ImageUrl;
        }

        protected override void SetCustomEntityProperties(m_option model)
        {
            ImageUrl = model.image;
        }
    }
}