﻿using System;

namespace PCT.Declarations.Models
{
    public class certificate
    {
        public Guid course_id { get; set; }

        public string course_name { get; set; }

        public string pdf_url { get; set; }

        public string image_url { get; set; }

        public DateTime earned { get; set; }
    }
}