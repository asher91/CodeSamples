CREATE TABLE [Entity].[Link]
(
	[EntityId]			UNIQUEIDENTIFIER	NOT NULL
	,[ParentEntityId]	UNIQUEIDENTIFIER	NOT NULL
	,[Category]			NVARCHAR(20)		NOT NULL
	,[StatusId]			NVARCHAR(20)		CONSTRAINT [DF_EntityLink_StatusId]  DEFAULT 'HOLD' NOT NULL
    ,[Type]				NVARCHAR(20)		NOT NULL
	,[Level]			INT					CONSTRAINT [DF_EntityLink_Level]  DEFAULT 1 NOT NULL

    CONSTRAINT [PK_EntityLink_EntityId_ParentEntityId] PRIMARY KEY CLUSTERED ([EntityId] ASC,[ParentEntityId] ASC)
	
	,CONSTRAINT [FK_EntityLink_EntityId] FOREIGN KEY ([EntityId]) REFERENCES [Core].[Entity]([EntityId])
	,CONSTRAINT [FK_EntityLink_ParentEntityId] FOREIGN KEY ([ParentEntityId]) REFERENCES [Core].[Entity]([EntityId])
	,CONSTRAINT [FK_EntityLink_StatusId_Type] FOREIGN KEY ([StatusId],[Type]) REFERENCES [Core].[Status]([StatusId],[Type])
)