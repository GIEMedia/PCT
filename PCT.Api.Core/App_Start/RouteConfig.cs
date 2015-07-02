using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PCT.Api.Core.App_Start
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes, Type baseType)
        {
            var controllerNamespace = baseType.Namespace + ".Controllers";

            routes.IgnoreRoute("{*allhtml}", new { allaspx = @".*\.html(/.*)?" });

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("Custom/{*pathInfo}");
            routes.IgnoreRoute("Content/{*pathInfo}");
            routes.IgnoreRoute("{*allaspx}", new { allaspx = @".*\.aspx(/.*)?" });
            routes.IgnoreRoute("{*allashx}", new { allashx = @".*\.ashx(/.*)?" });
            routes.IgnoreRoute("{*allasmx}", new { allashx = @".*\.asmx(/.*)?" });
            routes.IgnoreRoute("{*favicon}", new { favicon = @"(.*/)?favicon.ico(/.*)?" });
            routes.IgnoreRoute("{*alljpg}", new { alljpg = @".*\.jpg(/.*)?" });
            routes.IgnoreRoute("{*allgif}", new { allgif = @".*\.gif(/.*)?" });
            routes.IgnoreRoute("{*allpng}", new { allpng = @".*\.png(/.*)?" });
            routes.IgnoreRoute("{*allcss}", new { allcss = @".*\.css(/.*)?" });
            routes.IgnoreRoute("{*alljs}", new { alljs = @".*\.js(/.*)?" });

            routes.MapRoute(
                "Default",
                "{controller}/{action}/{id}",
                new {controller = "Home", action = "Index", id = UrlParameter.Optional},
                new[] {controllerNamespace}
                );
            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
            //    namespaces: new[] { controllerNamespace },
            //    constraints: new { controller = new FromNamespaceConstraint(baseType) }
            //    );
        }

        private class FromNamespaceConstraint : IRouteConstraint
        {
            private readonly string[] _values;

            public FromNamespaceConstraint(Type baseType)
            {
                _values = baseType.Assembly.GetTypes()
                    .Where(t => t.IsClass && typeof (Controller).IsAssignableFrom(t) && t.Name.EndsWith("Controller"))
                    .Select(t => t.Name.Substring(0, t.Name.Length - "Controller".Length))
                    .ToArray();
            }

            public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values,
                RouteDirection routeDirection)
            {
                // Get the value called "parameterName" from the RouteValueDictionary called "value"
                var value = values[parameterName].ToString();

                // Return true is the list of allowed values contains this value.
                return _values.Any(t => SContains(t, value, StringComparison.OrdinalIgnoreCase));
            }

            private static bool SContains(string source, string toCheck, StringComparison comp)
            {
                return source.IndexOf(toCheck, comp) >= 0;
            }
        }
    }
}
