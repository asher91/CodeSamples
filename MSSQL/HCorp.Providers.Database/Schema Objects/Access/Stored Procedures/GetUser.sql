CREATE PROCEDURE [Access].[GetUser]
	@UserId		UNIQUEIDENTIFIER,
	@Username	[NVARCHAR](256),
	
	@Page				INT = 1,
	@PageSize			INT = 10000
AS        
BEGIN
	SELECT 
		[E].[EntityId][UserId]
		,[E].[Name]
		,[E].[Url]
		,[E].[Avatar]
		,[E].[Description]
		,[E].[Type]
		,[E].[Culture]

		,[SD].[StatusId]
		,[SD].[Name] [StatusName]
		,[SD].[Description] [StatusDescription]

		,[U].[Username]
		,[U].[Password]
		,[U].[PasswordFormat]
		,[U].[PasswordHashAlgorithm]
		,[U].[PasswordSalt]
		,[U].[Permissions]
	FROM [Access].[User] [U]
		INNER JOIN [Core].[Entity] [E]
			ON [UserId] = ISNULL(@UserId, [UserId]) 
				AND [Username] = ISNULL(@Username, [Username])
				AND [U].[UserId] = [E].[EntityId]
		INNER JOIN [Core].[StatusDetails] [SD]
			ON [SD].[StatusId] = [E].[StatusId]
				AND [SD].[Type] = [E].[Type]
				AND [SD].[Culture] = [E].[Culture]
	ORDER BY [Username]
	OFFSET ((@Page - 1) * @PageSize) ROWS
	FETCH NEXT @PageSize ROWS ONLY;
	
	IF (@@ROWCOUNT = 0) -- User not found
       RETURN -1

    RETURN 0
END