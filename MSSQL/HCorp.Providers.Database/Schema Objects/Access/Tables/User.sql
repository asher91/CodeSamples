CREATE TABLE [Access].[User] (
    [UserId]                            UNIQUEIDENTIFIER    NOT NULL,
    [Username]                          NVARCHAR (256)      NOT NULL,

    [Password]							NVARCHAR (128)      NOT NULL,
    [PasswordFormat]                    INT                 CONSTRAINT [DF_AccessUser_PasswordFormat]  DEFAULT (0) NOT NULL,
    [PasswordHashAlgorithm]             INT                 CONSTRAINT [DF_AccessUser_PasswordHashAlgorith] DEFAULT (0) NOT NULL,
    [PasswordSalt]                      NVARCHAR (128)      NULL,

    [Permissions]                       NTEXT NULL, 
    CONSTRAINT [PK_AccessUser_UserId] PRIMARY KEY CLUSTERED ([UserId] ASC),
    CONSTRAINT [FK_AccessUser_UserId] FOREIGN KEY ([UserId]) REFERENCES [Core].[Entity]([EntityId]),
    CONSTRAINT [UQ_AccessUser_Username] UNIQUE NONCLUSTERED ([Username] ASC)
);
GO