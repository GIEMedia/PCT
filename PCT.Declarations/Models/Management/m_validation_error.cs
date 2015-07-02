using System;
using FluentNHibernate.Data;

namespace PCT.Declarations.Models.Management
{
    public class m_validation_error
    {
        public m_validation_error()
        {
        }

        public m_validation_error(Severity severity, Guid? sectionID, Guid? questionID, bool? noQuestions, string message, params object[] args)
        {
            this.severity = severity;
            this.message = string.Format(message, args);
            this.section_id = sectionID;
            this.question_id = questionID;
            this.no_questions = noQuestions;
        }

        public Severity severity { get; set; }

        public string message { get; set; }

        public Guid? section_id { get; set; }

        public Guid? question_id { get; set; }

        public bool? no_questions { get; set; }

        public enum Severity
        {
            Information = 1,
            Warning = 2,
            Error = 3
        }
    }
}