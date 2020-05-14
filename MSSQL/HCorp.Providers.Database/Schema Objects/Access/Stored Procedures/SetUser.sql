CREATE PROCEDURE [Access].[SetUser]
    @UserId			UNIQUEIDENTIFIER,

    @Name			NVARCHAR(256),
    @Url		    NVARCHAR(256),
    @Description	NVARCHAR(MAX),

    @Type			NVARCHAR(100),
    @Culture		NVARCHAR(5),
    @StatusId		NVARCHAR(20),

    @Username		NVARCHAR(256),

    @Password		NVARCHAR(128),
    @PasswordFormat	INT,
    @PasswordHashAlgorithm		INT,
    @PasswordSalt	NVARCHAR(128),
    @Permissions	NVARCHAR(128)
AS
BEGIN
	MERGE INTO [Core].[Entity] [Target]
    USING 
    (
        VALUES   
        (
	        @UserId,

            @Name,
            @Url,
            @Description,

            @Type,
            @Culture,
            @StatusId
        )
    ) 
    AS [Source]
    (
        [EntityId]
		,[Name]
		,[Url]
		,[Description]

		,[Type]
		,[Culture]
		,[StatusId]
    ) 
    ON [Target].[EntityId] = [Source].[EntityId]
    WHEN MATCHED THEN
        UPDATE SET
            [Target].[Name]=ISNULL([Source].[Name],[Target].[Name]),

            [Target].[Url]=ISNULL([Source].[Url],[Target].[Url]),
            [Target].[Description]=ISNULL([Source].[Description],[Target].[Description]),
            [Target].[Type]=ISNULL([Source].[Type],[Target].[Type]),
            [Target].[Culture]=ISNULL([Source].[Culture],[Target].[Culture]),
            [Target].[StatusId]=ISNULL([Source].[StatusId],[Target].[StatusId])
    WHEN NOT MATCHED THEN
	    INSERT 
        (
            [EntityId]
		    ,[Name]
		    ,[Url]
		    ,[Description]

		    ,[Type]
		    ,[Culture]
		    ,[StatusId]
        )
	    VALUES 
        (
            [Source].[EntityId]
		    ,[Source].[Name]
		    ,[Source].[Url]
		    ,[Source].[Description]

		    ,[Source].[Type]
		    ,[Source].[Culture]
		    ,[Source].[StatusId]
	    );

	MERGE INTO [Access].[User] [Target]
    USING 
    (
        VALUES   
        (
            @UserId,
            @Username,
            @Password,
            @PasswordFormat,
            @PasswordHashAlgorithm,
            @PasswordSalt,
            @Permissions
	    )
    ) 
    AS [Source]
    (
        [UserId]
		,[Username]

		,[Password]
		,[PasswordFormat]
		,[PasswordHashAlgorithm]
		,[PasswordSalt]
        ,[Permissions]
    )
    ON [Target].[UserId] = [Source].[UserId]
    WHEN MATCHED THEN
        UPDATE SET
            [Target].[Username]=ISNULL([Source].[Username],[Target].[Username]),

            [Target].[Password]                 =ISNULL([Source].[Password],[Target].[Password]),
            [Target].[PasswordFormat]           =ISNULL([Source].[PasswordFormat],[Target].[PasswordFormat]),
            [Target].[PasswordHashAlgorithm]    =ISNULL([Source].[PasswordHashAlgorithm],[Target].[PasswordHashAlgorithm]),
            [Target].[PasswordSalt]             =ISNULL([Source].[PasswordSalt],[Target].[PasswordSalt]),
            [Target].[Permissions]              =ISNULL([Source].[Permissions],[Target].[Permissions])
    WHEN NOT MATCHED THEN
	    INSERT 
        (
            [UserId]
            ,[Username]
		    ,[Password]
		    ,[PasswordFormat]
		    ,[PasswordHashAlgorithm]
		    ,[PasswordSalt]
            ,[Permissions]
        )
	    VALUES 
        (
            [Source].[UserId]
            ,[Source].[Username]
		    ,[Source].[Password]
		    ,[Source].[PasswordFormat]
		    ,[Source].[PasswordHashAlgorithm]
		    ,[Source].[PasswordSalt]
            ,[Source].[Permissions]
	    );

    EXEC [Access].[GetUser] @UserId, @Username, 1, 1;

END