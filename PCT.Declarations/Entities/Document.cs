using System;
using System.Collections.Generic;
using Prototype1.Foundation.Data;
using PCT.Declarations.Models;

namespace PCT.Declarations.Entities
{
    [Serializable]
    public class Document : EntityBase
    {
        public virtual string PDFUrl { get; set; }

        public virtual string PageImageUrlFormat { get; set; }

        public virtual int PageCount { get; set; }

        public static implicit operator document(Document document)
        {
            if(document == null)
                return new document();

            var pages = new List<string>();
            for (var p = 1; p <= document.PageCount; p++)
                pages.Add(string.Format(document.PageImageUrlFormat, p));
            
            return new document
            {
                pdf_url = document.PDFUrl,
                pages = pages.ToArray()
            };
        }
    }
}