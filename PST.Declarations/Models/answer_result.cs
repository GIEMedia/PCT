using System;

namespace PST.Declarations.Models
{
    public class answer_result
    {
        public answer_result(Guid questionID, bool correct, string correctResonseHeading = "", string correctResponseText = "")
        {
            this.question_id = questionID;
            this.correct = correct;
            if (correct)
            {
                this.correct_response_heading = correctResonseHeading;
                this.correct_response_text = correctResponseText;
            }
        }

        public Guid question_id { get; protected set; }

        public bool correct { get; protected set; }

        public string correct_response_heading { get; protected set; }

        public string correct_response_text { get; protected set; }
    }
}
