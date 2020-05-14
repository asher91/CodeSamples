CREATE TABLE [Core].[Culture]
(
	[Culture]		NVARCHAR(5) NOT NULL,
	[IsActive]		BIT CONSTRAINT [DF_CoreStatus_IsActive]  DEFAULT (0) NOT NULL
	
    CONSTRAINT [PK_CoreCulture_Culture] PRIMARY KEY CLUSTERED ([Culture])
)