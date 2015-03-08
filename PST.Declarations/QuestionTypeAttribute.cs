using System;

namespace PST.Declarations
{
    [AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple = false)]
    public class QuestionTypeAttribute : Attribute
    {
        public QuestionTypeAttribute(QuestionType questionType)
        {
            this.QuestionType = questionType;
        }

        public QuestionType QuestionType { get; set; }
    }
}
