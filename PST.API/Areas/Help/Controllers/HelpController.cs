using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Mvc;
using System.Web.Security;
using Prototype1.Foundation;
using PST.Api.Areas.Help.Models;

namespace PST.Api.Areas.Help.Controllers
{
    public class HelpController : Controller
    {
        public HelpController()
        {
            Configuration = GlobalConfiguration.Configuration;
        }

        public HttpConfiguration Configuration { get; private set; }

        [HelpAuthorizationAttribute]
        public ActionResult Index()
        {
            ViewBag.Types = GetTypes(Configuration.Services.GetApiExplorer().ApiDescriptions);

            return View(Configuration.Services.GetApiExplorer().ApiDescriptions);
        }

        private static List<Type> _types;

        private static List<Type> GetTypes(Collection<ApiDescription> apiDescriptions)
        {
            var types =
                ((from m in apiDescriptions
                  let type = m.ResponseDescription.ResponseType ?? m.ResponseDescription.DeclaredType
                  where m.ResponseDescription != null && type != null
                  select type.IsArray ? type.GetElementType() : type)
                    .Union(
                        from m in apiDescriptions
                        from p in m.ParameterDescriptions
                        where p.ParameterDescriptor != null && p.ParameterDescriptor.ParameterType != null
                        select p.ParameterDescriptor.ParameterType.IsArray ? p.ParameterDescriptor.ParameterType.GetElementType() : p.ParameterDescriptor.ParameterType))
                    .Where(x => x != null && !x.IsPrimitive && ((x.IsClass && !x.Namespace.IfNullOrEmpty("").StartsWith("System")) || (x.IsGenericType && !x.GetGenericArguments()[0].Namespace.IfNullOrEmpty("").StartsWith("System"))))
                    .Distinct()
                    .ToList();

            while (true)
            {
                foreach (var gen in types.Where(t => t.IsGenericType).ToArray())
                {
                    types.Remove(gen);
                    types.Add(gen.GetGenericArguments()[0]);
                }

                foreach (var abs in types.Where(t => t.IsAbstract).ToArray())
                {
                    types.Remove(abs);
                    types.AddRange(Assembly.GetAssembly(abs).GetTypes().Where(myType => myType.IsClass && !myType.IsAbstract && myType.IsSubclassOf(abs)));
                }

                var newTypes = new List<Type>();
                foreach (var subTypes in types.Select(t => t.GetProperties(
                    BindingFlags.Instance | BindingFlags.Public | BindingFlags.SetProperty)
                    .Where(x => x.CustomAttributes.All(c => c.AttributeType != typeof(IgnoreDataMemberAttribute)))
                    .Select(p => p.PropertyType.IsArray ? p.PropertyType.GetElementType() : p.PropertyType)
                    .Where(x => x != null && !types.Contains(x) && !newTypes.Contains(x))
                    .Where(x => !x.IsPrimitive && ((x.IsClass && !x.Namespace.IfNullOrEmpty("").StartsWith("System")) || (x.IsGenericType && !x.GetGenericArguments()[0].Namespace.IfNullOrEmpty("").StartsWith("System"))))
                    .ToList()).Where(subTypes => subTypes.Any()))
                {
                    newTypes.AddRange(subTypes);
                }

                if (newTypes.Any())
                {
                    types.AddRange(newTypes);
                    continue;
                }

                break;
            }

            return types.OrderBy(x => x.Name).Distinct().ToList();
        }

        public ActionResult Login()
        {
            var host = HttpContext != null && HttpContext.Request != null && HttpContext.Request.Url != null
                ? HttpContext.Request.Url.Host
                : "";
            if (host != "localhost") return View();

            FormsAuthentication.SetAuthCookie("localhost", false);
            return RedirectToAction("Index");
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Login(HelpLogin helpLogin)
        {
            if (helpLogin.Username.IsNullOrEmpty() || helpLogin.Password.IsNullOrEmpty())
                return View();

            user[] users;
            using (
                var streamReader =
                    new StreamReader(HostingEnvironment.MapPath("/") + "Areas/Help/AuthorizedUsers.json.protected"))
                users = streamReader.ReadToEnd().FromJson<user[]>();

            if (users.Any(u => u.username == helpLogin.Username && u.password == helpLogin.Password))
            {
                FormsAuthentication.SetAuthCookie(helpLogin.Username, false);
                return RedirectToAction("Index");
            }

            ModelState.AddModelError("", "The username or password you provided is not valid.");
            return View(helpLogin);
        }

        private class user
        {
            public string username { get; set; }
            public string password { get; set; }
        }
    }
}