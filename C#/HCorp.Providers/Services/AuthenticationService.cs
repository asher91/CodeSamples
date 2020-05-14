using HCorp.Extensions;
using HCorp.Library.Cryptography;
using HCorp.Providers.Enum;
using HCorp.Providers.Models;
using HCorp.Providers.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;

namespace HCorp.Providers.Authentication
{
    public class AuthenticationService
    {
        public static string Ticket
        {
            get
            {
                HttpContext context = HttpContext.Current;
                return (context != null && context.Request.Cookies[FormsAuthentication.FormsCookieName] != null) ? context.Request.Cookies[FormsAuthentication.FormsCookieName].Value : null;
            }
        }
        public static User CurrentUser
        {
            get
            {
                if (Ticket.IsNullOrEmpty())
                {
                    return null;
                }
                return JsonConvert.DeserializeObject<User>(FormsAuthentication.Decrypt(Ticket).UserData);
            }
        }
        public static Dictionary<short, Permission> CurrentUserPermission
        {
            get
            {
                return CurrentUser == null ? new Dictionary<short, Permission>() : CurrentUser.Permissions;
            }
        }
        public static bool Login(out MembershipStatus status, out User user, string username, string password, bool rememberMe = false)
        {
            if (ValidateUser(out status, out user, username, password))
            {
                CreateTicket(user, rememberMe);
                return true;
            }
            return false;
        }
        public static void Logout()
        {
            DestroyTicket();
        }

        public static void RefreshTicket(User user, bool isPersistant = true)
        {
            CreateTicket(user, isPersistant);
        }
        private static void CreateTicket(User user, bool isPersistant = true)
        {
            user.Culture = user.StatusId = user.StatusName = user.StatusDescription = user.Comment = user.Password = user.Password1 = user.Password2 = user.PasswordSalt = "";
            user.PasswordFormat = 0; user.PasswordHashAlgorithm = 0;

            string userData = JsonConvert.SerializeObject(user);
            var ticket = new FormsAuthenticationTicket(1, user.Name, DateTime.Now, DateTime.Now + FormsAuthentication.Timeout, isPersistant, userData, FormsAuthentication.FormsCookiePath);
            var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket))
            {
                Domain = FormsAuthentication.CookieDomain,
                HttpOnly = true
            };
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
        private static void DestroyTicket()
        {
            var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, null)
            {
                Domain = FormsAuthentication.CookieDomain,
                HttpOnly = true,
                Expires = DateTime.Now.AddHours(-1)
            };
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
        public static Permission GetCurrentUserPermission(short entityType)
        {
            return CurrentUserPermission.ContainsKey(entityType) ? CurrentUserPermission[entityType] : Permission.NONE;
        }
        public static bool ValidateUser(out MembershipStatus status, out User user, string username, string password)
        {
            status = MembershipStatus.InvalidCredential;
            user = AccessRepository.GetUserByName(username);

            if (user != null && ValidatePassword(user, password))
            {
                status = MembershipStatus.Logged;
            }
            return status.GetBooleanValue();
        }
        private static bool ValidatePassword(User user, string password)
        {
            return user.Password.Equals(EncryptionService.CypherText(password, user.PasswordFormat, user.PasswordHashAlgorithm, user.PasswordSalt));
        }
    }
}
