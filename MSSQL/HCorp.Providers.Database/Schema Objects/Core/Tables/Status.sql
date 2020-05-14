CREATE TABLE [Core].[Status]
(
	[StatusId]		NVARCHAR(20) NOT NULL,
	[Type]			NVARCHAR(20) NOT NULL, 

    CONSTRAINT [PK_CoreStatus_StatusId_Type] PRIMARY KEY CLUSTERED ([StatusId] ASC, [Type] ASC),

	CONSTRAINT [FK_CoreStatus_Type] FOREIGN KEY ([Type]) REFERENCES [Entity].[Type]([Type])
)