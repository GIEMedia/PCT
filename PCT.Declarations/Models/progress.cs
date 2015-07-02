using System;

namespace PCT.Declarations.Models
{
    public abstract class questioned_progress
    {
        protected questioned_progress()
        {
            correctly_answered_questions = new question_progress[0];
        }

        public question_progress[] correctly_answered_questions { get; set; }
    }

    public class section_progress : questioned_progress
    {
        public Guid section_id { get; set; }

        public bool complete { get; set; }
    }

    public class test_progress : questioned_progress
    {
        public Guid test_id { get; set; }

        public Guid course_id { get; set; }

        public int max_tries { get; set; }

        public int tries_left { get; set; }
    }

    public class question_progress
    {
        public question_progress()
        {
            correct_options = null;
        }

        public Guid question_id { get; set; }

        public Guid[] correct_options { get; set; }

        public string correct_response_heading { get; set; }

        public string correct_response_text { get; set; }
    }

    public class course_progress
    {
        public course_progress()
        {
            sections = new section_progress[0];
        }

        public Guid course_id { get; set; }

        public bool complete { get; set; }

        public section_progress[] sections { get; set; }
    }
}