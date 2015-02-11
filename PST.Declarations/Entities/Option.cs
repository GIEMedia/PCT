using System;
using Prototype1.Foundation.Data;
using PST.Declarations.Models;

namespace PST.Declarations.Entities
{
    [Serializable]
    public abstract class Option : EntityBase
    {
        public virtual string Text { get; set; }

        public virtual bool Correct { get; set; }

        protected abstract void SetCustomModelProperties(option option);

        public option ToModel()
        {
            var option = new option
            {
                option_id = ID,
                text = Text
            };

            SetCustomModelProperties(option);

            return option;
        }
    }

    [Serializable]
    public class TextOption : Option
    {
        protected override void SetCustomModelProperties(option option)
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
    }
}