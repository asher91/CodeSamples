using HCorp.Providers.Enum;
using System.Collections.Generic;
using System.Linq;

namespace HCorp.Providers.Extensions
{
    public static class PermissionExtensions
    {
        public static bool HasPermission(this Dictionary<short, Permission> perms, short section, params Permission[] permission)
        {
            return perms.ContainsKey(section) ? permission.ToList().Any(p => perms[section].HasFlag(p)) : false;
        }
    }
}
