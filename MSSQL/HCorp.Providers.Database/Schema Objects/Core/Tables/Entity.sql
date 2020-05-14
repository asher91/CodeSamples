CREATE TABLE [Core].[Entity]
(
	[EntityId]			UNIQUEIDENTIFIER NOT NULL,
	[Name]				NVARCHAR(256) NOT NULL,
	[Url]				NVARCHAR(256) NOT NULL,
	[Avatar]			NTEXT NOT NULL,
	[Description]		NVARCHAR(MAX) NOT NULL,

	[Type]				NVARCHAR(20) NOT NULL,
	[Culture]			NVARCHAR(5) NOT NULL,
	[StatusId]			NVARCHAR(20) CONSTRAINT [DF_CoreEntity_StatusId]  DEFAULT 'HOLD' NOT NULL,
	
    CONSTRAINT [PK_CoreEntity_EntityId] PRIMARY KEY CLUSTERED ([EntityId] ASC),
	
	CONSTRAINT [FK_CoreEntity_StatusId_Type] FOREIGN KEY ([StatusId], [Type]) REFERENCES [Core].[Status]([StatusId],[Type]),
	CONSTRAINT [FK_CoreEntity_Culture] FOREIGN KEY ([Culture]) REFERENCES [Core].[Culture]([Culture]),

	CONSTRAINT [UQ_CoreEntity_EntityId_Type] UNIQUE NONCLUSTERED ([EntityId] ASC, [Type] ASC),
	CONSTRAINT [UQ_CoreEntity_Url] UNIQUE NONCLUSTERED ([Url] ASC)
)
