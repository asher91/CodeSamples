﻿CREATE TABLE [Entity].[Type]
(
	[Group]				NVARCHAR(20) NOT NULL,
	[Type]				NVARCHAR(20) NOT NULL
	
	,CONSTRAINT [PK_EntityType_Type] PRIMARY KEY CLUSTERED ([Type] ASC)
)