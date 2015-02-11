using System;
using System.Collections.Generic;
using System.Linq;
using NHibernate.Mapping;
using Prototype1.Foundation;
using Prototype1.Foundation.Data;
using PST.Declarations.Models;
using WebGrease.Css.Extensions;

namespace PST.Declarations.Entities
{
    [Serializable]
    public class Document : EntityBase
    {
        public virtual string PDFUrl { get; set; }

        public virtual string PageImageUrlFormat { get; set; }

        public virtual int PageCount { get; set; }

        public static implicit operator document(Document document)
        {
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