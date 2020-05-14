using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using HCorp.Cryptography.Enum;
using HCorp.Extensions;
using HCorp.Library.Cryptography;
using HCorp.Providers.Authentication;
using HCorp.Providers.Enum;
using HCorp.Providers.Models;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;

namespace HCorp.Providers.Repository
{
    public static class AccessRepository
    {
        public static User Add(User user)
        {
            return Set(user);
        }
        public static bool UpdatePassword(User user)
        {
            if (AuthenticationService.ValidateUser(out _, out User userex, user.UserName, user.Password))
            {
                userex.Password = EncryptionService.CypherText(user.Password1, userex.PasswordFormat, userex.PasswordHashAlgorithm, userex.PasswordSalt);
                try
                {
                    Set(userex);
                    return true;
                }
                catch (SqlException)
                {
                    return false;
                }
            }
            return false;
        }
        public static User Delete(User user)
        {
            user.UserName = $"{DateTime.Now:YYYYmmdd}-{AuthenticationService.CurrentUser.Name}-{user.UserName}";
            user.StatusId = STATUS.DELETED;
            return Set(user);
        }


        public static User GetUserById(Guid userId)
        {
            return Get(new User { UserId = userId }, count: 1).FirstOrDefault();

        }
        public static User GetUserByName(string username = null)
        {
            return Get(new User { UserName = username }, count: 1).FirstOrDefault();
        }

        #region Methods
        public static User Set(User user)
        {
            return DatabaseFactory.CreateDatabase().ExecuteSprocAccessor(
                "[Access].[SetUser]"
                , new UserRowMapper()
                , user.UserId
                , user.Name
                , user.Url
                , user.Description

                , user.Type
                , user.Culture
                , user.StatusId

                , user.UserName
                , user.Password
                , user.PasswordFormat
                , user.PasswordHashAlgorithm
                , user.PasswordSalt

                , JsonConvert.SerializeObject(user.Permissions)
            ).ToList().FirstOrDefault();
        }

        public static IEnumerable<User> Get(User user, int page = 1, int size = 1000, int? count = null)
        {
            if (count.HasValue)
            {
                page = 1;
                size = count.Value;
            }

            return DatabaseFactory.CreateDatabase().ExecuteSprocAccessor(
                "[Access].[GetUser]"
                , new UserRowMapper()
                , user.UserId
                , user.UserName
                , page
                , size
            );
        }

        private sealed class UserRowMapper : IRowMapper<User>
        {
            public User MapRow(IDataRecord row)
            {
                User user = new User
                {
                    UserId = row.GetGuid("UserId"),

                    Name = row.GetString("Name"),
                    Url = row.GetString("Url"),
                    Description = row.GetString("Description"),
                    Type = row.GetString("Type"),
                    Culture = row.GetString("Culture"),

                    StatusId = row.GetString("StatusId"),
                    StatusName = row.GetString("StatusName"),
                    StatusDescription = row.GetString("StatusDescription"),

                    UserName = row.GetString("Username"),
                    Avatar = row.GetString("Avatar"),

                    Password = row.GetString("Password"),
                    PasswordFormat = (EncryptionFormat)row.GetInt("PasswordFormat"),
                    PasswordHashAlgorithm = (EncryptionHashAlgorithm)row.GetInt("PasswordHashAlgorithm"),
                    PasswordSalt = row.GetString("PasswordSalt"),
                    Permissions = JsonConvert.DeserializeObject<Dictionary<short, Permission>>(row.GetString("Permissions"))
                };

                return user;
            }
        }
        #endregion
    }
}