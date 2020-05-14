using HCorp.Cryptography.Enum;
using HCorp.Providers.Enum;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HCorp.Providers.Models
{
    public class User : Entity
    {
        public Guid? UserId
        {
            get
            {
                return Id;
            }
            set
            {
                Id = value;
            }
        }

        [Required(ErrorMessageResourceName = "RequiredEmail", ErrorMessageResourceType = typeof(Localization.Messages))]
        public string UserName { get; set; }

        [Required(ErrorMessageResourceName = "RequiredPassword", ErrorMessageResourceType = typeof(Localization.Messages))]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password2", ErrorMessageResourceName = "NotEqualPassword", ErrorMessageResourceType = typeof(Localization.Messages))]
        public string Password1 { get; set; }

        [DataType(DataType.Password)]
        public string Password2 { get; set; }

        public EncryptionFormat PasswordFormat { get; set; }

        public EncryptionHashAlgorithm PasswordHashAlgorithm { get; set; }

        public string PasswordSalt { get; set; }

        public Dictionary<short, Permission> Permissions = new Dictionary<short, Permission>();
    }
}