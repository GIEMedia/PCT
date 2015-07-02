using System.Collections.Generic;
using System.Diagnostics;
using Prototype1.Foundation;
using Prototype1.Foundation.Web;

namespace PCT.Tests.ManagementTests
{
    public abstract class ApiTestControllerBase
    {
        protected abstract string UrlBase { get; }
        protected T ExecuteGetRequest<T>(string url)
        {
            string r;
            HttpRequestExecutor.ExecuteGetRequest(out r, UrlBase + url);

            Debug.WriteLine("GET " + UrlBase + url);
            Debug.WriteLine(r);
            Debug.WriteLine("");
            Debug.WriteLine("--------------------------------------------");
            Debug.WriteLine("");

            return r.FromJson<T>();
        }

        private readonly Dictionary<string, string> Headers = new Dictionary<string, string>
            {
                {"Accept", "application/json"},
                {"content-type", "application/json"},
                {"Accept-Encoding", "gzip, deflate"}
            };

        protected void ExecutePutRequest(string url, object obj)
        {
            string r;
            HttpRequestExecutor.ExecutePutRequest(out r, UrlBase + url, obj.ToJson(), true, Headers);

            Debug.WriteLine("PUT " + UrlBase + url);
            Debug.WriteLine(r);
            Debug.WriteLine("");
            Debug.WriteLine("--------------------------------------------");
            Debug.WriteLine("");
        }

        protected T ExecutePutRequest<T>(string url, object obj)
        {
            string r;
            HttpRequestExecutor.ExecutePutRequest(out r, UrlBase + url, obj.ToJson(), true, Headers);

            Debug.WriteLine("PUT " + UrlBase + url);
            Debug.WriteLine(r);
            Debug.WriteLine("");
            Debug.WriteLine("--------------------------------------------");
            Debug.WriteLine("");

            return r.FromJson<T>();
        }

        protected void ExecuteDeleteRequest(string url)
        {
            string r;
            Dictionary<string, string> outHeaders;
            HttpRequestExecutor.ExecuteWebRequest(out r, out outHeaders, UrlBase + url, "", true, Headers, null, "DELETE");

            Debug.WriteLine("DELETE " + UrlBase + url);
            Debug.WriteLine(r);
            Debug.WriteLine("");
            Debug.WriteLine("--------------------------------------------");
            Debug.WriteLine("");
        }
    }
}