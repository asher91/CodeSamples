using HCorp.Enumerations;
using HCorp.Enumerations.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HCorp.Providers.Enum
{
    public enum MembershipStatus
    {
        [Name("Success"), MessageResourceName("UpdateProfileSuccess"), BooleanValue(true)]
        Success = 0,

        [Name("Login"), BooleanValue(true)]
        Logged = 1,

        [Name("InvalidCredential"), BooleanValue(false), MessageResourceName("FailedLoginAttempt")]
        InvalidCredential = 2,
        [Name("InvalidUserName"), BooleanValue(false), MessageResourceName("FailedLoginAttempt")]
        InvalidUserName = 2,
        [Name("InvalidUserName"), BooleanValue(false), MessageResourceName("FailedLoginAttempt")]
        InvalidPassword = 2,

        [Name("UnApproved"), BooleanValue(false), MessageResourceName("UnApproved")]
        UnApproved = 3,

        [Name("IsLocked"), BooleanValue(false), MessageResourceName("IsLocked")]
        IsLocked = 4,
        [Name("IsLocked"), BooleanValue(false), MessageResourceName("IsLocked")]
        UserRejected = 4,

        InvalidQuestion = 5,
        InvalidAnswer = 5,
        InvalidEmail = 5,
        DuplicateUserName = 5,
        DuplicateEmail = 5,
        InvalidProviderUserKey = 5,
        DuplicateProviderUserKey = 5,
        ProviderError = 5
    }
}