using HCorp.Enumerations.Attributes;

namespace HCorp.Providers.Enum
{
    public enum Level : long
    {
        [Name("LEVEL0")]
        L0 = 0,
    }

    public enum Permission : short
    {
        [Name("NONE")]
        NONE = 0,

        [Name("READ")]
        READ = 1,

        [Name("EDIT")]
        EDIT = 2,

        [Name("CREATE")]
        CREATE = 4,

        [Name("DELETE")]
        DELETE = 8,

        [Name("ALL")]
        ALL = 15,

        [Name("SCHEDULE")]
        SCHEDULE = 16
    }
}
