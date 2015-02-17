using System;

namespace PST.Api.Areas.Management.Models
{
    public class m_option
    {
        public Guid id { get; set; }

        public string text { get; set; }

        /// <summary>
        /// Url to image (used for Multi-Image question only)
        /// </summary>
        public string image { get; set; }

        public bool correct { get; set; }
    }
}