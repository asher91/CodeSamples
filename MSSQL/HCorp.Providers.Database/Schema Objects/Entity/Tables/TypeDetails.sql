CREATE TABLE [Entity].[TypeDetails]
(
	[Type]			NVARCHAR(20) NOT NULL,
	[Culture]		NVARCHAR(5) NOT NULL,
	[Name]			NVARCHAR(20) NOT NULL,
	[Description]	NVARCHAR(50) NOT NULL,
	
	CONSTRAINT [PK_EntityTypeDetails_Type_Culture] PRIMARY KEY CLUSTERED ([Type] ASC, [Culture] ASC),
	
	CONSTRAINT [FK_EntityTypeDetails_Type] FOREIGN KEY ([Type]) REFERENCES [Entity].[Type]([Type]),
	CONSTRAINT [FK_EntityTypeDetails_Culture] FOREIGN KEY ([Culture]) REFERENCES [Core].[Culture]([Culture])
)
