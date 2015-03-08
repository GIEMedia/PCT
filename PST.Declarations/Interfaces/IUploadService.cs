using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace PST.Declarations.Interfaces
{
    public interface IUploadService
    {
        Task<string> UploadImage(HttpContent requestContent, int? width = null, int? height = null,
            bool forceCanvas = false);

        Task<Tuple<Guid, int>> UploadDocument(HttpContent requestContent);
    }
}