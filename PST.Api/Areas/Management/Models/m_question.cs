using System;
using PST.Declarations.Models;

namespace PST.Api.Areas.Management.Models
{
    public class m_question
    {
        public Guid id { get; set; }

        public string question_text { get; set; }

        public string response_heading { get; set; }

        public string response_message { get; set; }

        public string tip { get; set; }

        public m_option[] options { get; set; }

        /// <summary>
        /// Url to image (used for Single Image question only)
        /// </summary>
        public string image { get; set; }

        /// <summary>
        /// Url to video (used for Video question only)
        /// </summary>
        public video video { get; set; }
    }
}