using System.Configuration;
using System.Linq;
using System.Web.Caching;

namespace PST.Api.Core.App_Start
{
    public class CacheConfig
    {
        private static readonly string[] _cacheNotifactionTables =
        {
            // add cache dependencies here
            // i.e.:   "dbo.MyTable"
        };

        private static readonly string _connectionString = ConfigurationManager.ConnectionStrings["Groupmatics"].ConnectionString;

        public static void RegisterCacheDependencies()
        {
            foreach (var table in _cacheNotifactionTables)
            {
                if (!SqlCacheDependencyAdmin.GetTablesEnabledForNotifications(_connectionString).Contains(table))
                    SqlCacheDependencyAdmin.EnableTableForNotifications(_connectionString, table);
            }
        }
    }
}