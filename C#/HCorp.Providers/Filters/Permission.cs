using HCorp.Providers.Authentication;
using HCorp.Providers.Enum;
using HCorp.Providers.Extensions;
using System;
using System.Web.Http.Controllers;
using System.Web.Mvc;

namespace HCorp.Providers.Filters.API
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class PermissionAttribute : System.Web.Http.AuthorizeAttribute
    {
        private readonly short entityType;
        private readonly Permission[] permissionRequired;
        public PermissionAttribute(short EntityType, params Permission[] PermissionRequired)
        {
            entityType = EntityType;
            permissionRequired = PermissionRequired;
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext == null || !AuthenticationService.CurrentUserPermission.HasPermission(entityType, permissionRequired))
            {
                HandleUnauthorizedRequest(actionContext);
            }
        }
    }
}

namespace HCorp.Providers.Filters.WEB
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class PermissionAttribute : System.Web.Mvc.AuthorizeAttribute
    {
        private readonly short entityType;
        private readonly Permission[] permissionRequired;
        public PermissionAttribute(short EntityType, params Permission[] PermissionRequired)
        {
            entityType = EntityType;
            permissionRequired = PermissionRequired;
        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext == null || !AuthenticationService.CurrentUserPermission.HasPermission(entityType, permissionRequired))
            {
                HandleUnauthorizedRequest(filterContext);
            }
        }
    }
}