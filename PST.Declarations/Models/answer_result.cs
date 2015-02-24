using System;

namespace PST.Declarations.Models
{
    public class answer_result : question_progress
    {
        public answer_result(Guid questionID, bool correct, string correctResonseHeading = "", string correctResponseText = "", Guid[] correctOptions = null)
        {
            this.question_id = questionID;
            this.correct = correct;
            if (correct)
            {
                this.correct_response_heading = correctResonseHeading;
                this.correct_response_text = correctResponseText;
                this.correct_options = correctOptions;
            }
        }

        public bool correct { get; protected set; }
    }
}
