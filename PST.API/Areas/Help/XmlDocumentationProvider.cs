using System;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web.Http.Controllers;
using System.Web.Http.Description;
using System.Xml.XPath;

namespace PST.Api.Areas.Help
{
    /// <summary>
    /// A custom <see cref="IDocumentationProvider"/> that reads the API documentation from an XML documentation file.
    /// </summary>
    public class XmlDocumentationProvider : IDocumentationProvider
    {
        private XPathNavigator _documentNavigator;
        private const string MethodExpression = "/doc/members/member[@name='M:{0}']";
        private const string TypeExpression = "/doc/members/member[@name='T:{0}']";
        private const string ParameterExpression = "param[@name='{0}']";

        private static readonly Regex _attributeExtractorRegex =
            new Regex("(\\S+)=[\"']?((?:.(?![\"']?\\s+(?:\\S+)=|[>\"']))+.)[\"']?", RegexOptions.Singleline);


        /// <summary>
        /// Initializes a new instance of the <see cref="XmlDocumentationProvider"/> class.
        /// </summary>
        /// <param name="documentPath">The physical path to XML document.</param>
        public XmlDocumentationProvider(string documentPath)
        {
            if (documentPath == null)
            {
                throw new ArgumentNullException("documentPath");
            }
            XPathDocument xpath = new XPathDocument(documentPath);
            _documentNavigator = xpath.CreateNavigator();
        }

        public string GetDocumentation(HttpControllerDescriptor controllerDescriptor)
        {
            string doc = string.Empty;
            var controllerNode = GetControllerNode(controllerDescriptor);
            if (controllerNode != null)
            {
                var summaryNode = controllerNode.SelectSingleNode("summary");
                if (summaryNode != null)
                {
                    doc += "<p class='summary'>" + summaryNode.Value.Trim() + "</p>";
                }
                var remarksNode = controllerNode.SelectSingleNode("remarks");
                if (remarksNode != null)
                {
                    doc += "<p class='remarks'>" + remarksNode.Value.Trim() + "</p>";
                }
            }

            return doc;
        }

        

        public virtual string GetDocumentation(HttpActionDescriptor actionDescriptor)
        {
            string doc = string.Empty;
            XPathNavigator methodNode = GetMethodNode(actionDescriptor);
            if (methodNode != null)
            {
                var summaryNode = methodNode.SelectSingleNode("summary");
                if (summaryNode != null)
                {
                    doc += "<h4 class='summary'>" + summaryNode.Value.Trim() + "</h4>";
                }
                var remarksNode = methodNode.SelectSingleNode("remarks");
                if (remarksNode != null)
                {
                    doc += "<p class='remarks'>" + remarksNode.Value.Trim() + "</p>";
                }
            }

            return doc;
        }

        public virtual string GetDocumentation(HttpParameterDescriptor parameterDescriptor)
        {
            ReflectedHttpParameterDescriptor reflectedParameterDescriptor = parameterDescriptor as ReflectedHttpParameterDescriptor;
            if (reflectedParameterDescriptor != null)
            {
                XPathNavigator methodNode = GetMethodNode(reflectedParameterDescriptor.ActionDescriptor);
                if (methodNode != null)
                {
                    string parameterName = reflectedParameterDescriptor.ParameterInfo.Name;
                    XPathNavigator parameterNode = methodNode.SelectSingleNode(String.Format(CultureInfo.InvariantCulture, ParameterExpression, parameterName));
                    if (parameterNode != null)
                    {
                        return parameterNode.InnerXml.Trim();
                    }
                }
            }

            return null;
        }

        public string GetResponseDocumentation(HttpActionDescriptor actionDescriptor)
        {
            XPathNavigator methodNode = GetMethodNode(actionDescriptor);
            if (methodNode != null)
            {
                XPathNavigator returnsNode = methodNode.SelectSingleNode("returns");
                if (returnsNode != null)
                {
                    return returnsNode.InnerXml.Trim();
                }
            }

            return null;
        }
        private XPathNavigator GetControllerNode(HttpControllerDescriptor controllerDescriptor)
        {
            var selectExpression = string.Format(CultureInfo.InvariantCulture, TypeExpression,
                controllerDescriptor.ControllerType.FullName);

            return _documentNavigator.SelectSingleNode(selectExpression);
        }

        private XPathNavigator GetMethodNode(HttpActionDescriptor actionDescriptor)
        {
            ReflectedHttpActionDescriptor reflectedActionDescriptor = actionDescriptor as ReflectedHttpActionDescriptor;
            if (reflectedActionDescriptor != null)
            {
                string selectExpression = String.Format(CultureInfo.InvariantCulture, MethodExpression, GetMemberName(reflectedActionDescriptor.MethodInfo));
                return _documentNavigator.SelectSingleNode(selectExpression);
            }

            return null;
        }

        private static string GetMemberName(MethodInfo method)
        {
            string name = String.Format(CultureInfo.InvariantCulture, "{0}.{1}", method.DeclaringType.FullName, method.Name);
            ParameterInfo[] parameters = method.GetParameters();
            if (parameters.Length != 0)
            {
                string[] parameterTypeNames = parameters.Select(param => GetTypeName(param.ParameterType)).ToArray();
                name += String.Format(CultureInfo.InvariantCulture, "({0})", String.Join(",", parameterTypeNames));
            }

            return name;
        }

        private static string GetTypeName(Type type)
        {
            if (type.IsGenericType)
            {
                // Format the generic type name to something like: Generic{System.Int32,System.String}
                Type genericType = type.GetGenericTypeDefinition();
                Type[] genericArguments = type.GetGenericArguments();
                string typeName = genericType.FullName;

                // Trim the generic parameter counts from the name
                typeName = typeName.Substring(0, typeName.IndexOf('`'));
                string[] argumentTypeNames = genericArguments.Select(t => GetTypeName(t)).ToArray();
                return String.Format(CultureInfo.InvariantCulture, "{0}{{{1}}}", typeName, String.Join(",", argumentTypeNames));
            }

            return type.FullName;
        }
    }
}
