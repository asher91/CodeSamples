CREATE TABLE [Access].[Roles] (
    [Role]              NVARCHAR (25)       NOT NULL,
    [SectionId]         UNIQUEIDENTIFIER    NOT NULL,
    [Description]       NVARCHAR (256)      NULL,
    CONSTRAINT [PK_AccessRoles_Role] PRIMARY KEY NONCLUSTERED ([Role] ASC),
    CONSTRAINT [FK_AccessRoles_SectionId] FOREIGN KEY ([SectionId]) REFERENCES [Core].[Entity]([EntityId])
);
