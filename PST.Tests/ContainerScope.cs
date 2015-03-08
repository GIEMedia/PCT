using System;
using Microsoft.Practices.Unity;
using Prototype1.Foundation.Unity;
using PST.Declarations.Models.Management;

namespace PST.Tests
{
    public static class ContainerScope
    {
        private static readonly IContainerProvider TransientContainerProvider = new TransientContainerProvider();
        private static readonly IContainerProvider DevelopmentApiContainerProvider = new DevelopmentApiContainerProvider();

        /// <summary>
        /// Creates a ContainerScope with a TransientDataContext and TransientContextManager
        /// </summary>
        /// <returns>ContainerScope</returns>
        public static IUnityContainer CreateDefault()
        {
            var container = new Lazy<IUnityContainer>(() => TransientContainerProvider.GetContainer().AddNewExtension<HierarchicalLifetimeBaseExtension>().CreateChildContainer());
            Container.SetContainer(container);
            return container.Value;
        }

        public static IUnityContainer CreateDevelopment()
        {
            var container = new Lazy<IUnityContainer>(() => DevelopmentApiContainerProvider.GetContainer().AddNewExtension<HierarchicalLifetimeBaseExtension>().CreateChildContainer());
            Container.SetContainer(container);
            return container.Value;
        }
    }
}