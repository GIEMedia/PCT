using System;
using Microsoft.Practices.Unity;
using Prototype1.Foundation.Unity;

namespace PST.Tests
{
    public static class ContainerScope
    {
        private static readonly IContainerProvider ContainerProvider = new TestContainerProvider();
        /// <summary>
        /// Creates a ContainerScope with a TransientDataContext and TransientContextManager
        /// </summary>
        /// <returns>ContainerScope</returns>
        public static IUnityContainer CreateDefault()
        {
            var container = new Lazy<IUnityContainer>(() => ContainerProvider.GetContainer().AddNewExtension<HierarchicalLifetimeBaseExtension>().CreateChildContainer());
            Container.SetContainer(container);
            return container.Value;
        }
    }
}