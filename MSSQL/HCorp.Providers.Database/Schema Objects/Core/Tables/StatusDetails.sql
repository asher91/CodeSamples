CREATE TABLE [Core].[StatusDetails]
(
	[StatusId]		NVARCHAR(20) NOT NULL,
	[Type]			NVARCHAR(20) NOT NULL,
	[Culture]		NVARCHAR(5) NOT NULL,
	[Name]			NVARCHAR(20) NOT NULL,
	[Description]	NVARCHAR(50) NOT NULL,
	
	CONSTRAINT [PK_StatusDetails_StatusId_Type_Culture] PRIMARY KEY CLUSTERED ([StatusId] ASC, [Type] ASC, [Culture] ASC),
	
	CONSTRAINT [FK_StatusDetails_StatusId_Type] FOREIGN KEY ([StatusId], [Type]) REFERENCES [Core].[Status]([StatusId], [Type]),
	CONSTRAINT [FK_StatusDetails_Culture] FOREIGN KEY ([Culture]) REFERENCES [Core].[Culture]([Culture])
)
