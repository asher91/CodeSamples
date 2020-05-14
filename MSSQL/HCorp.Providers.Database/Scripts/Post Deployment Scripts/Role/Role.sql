MERGE INTO [Role].[Role] AS [Target]
USING(VALUES 
	('00000000-0000-0000-0000-000000000000', 'ACTIVE' ,'ADMIN', 'Administrator Management Company') -- TECHNICIAL

	--RECEP
	--ACCOUNT
	--SECRETARY

	--PHARMACY
	--XRAY

	,('00000000-0000-0000-0000-000000000001', 'ACTIVE' ,'NURSE', 'Nurse Management Company')
	,('00000000-0000-0000-0000-000000000002', 'ACTIVE' ,'CHARGE NURSE', 'Nurse in Charge Management Company')
	,('00000000-0000-0000-0000-000000000003', 'ACTIVE' ,'GENERAL DOCTOR', 'General Doctor Management Company')
	,('00000000-0000-0000-0000-000000000004', 'ACTIVE' ,'ON CALL DOCTOR', 'General On Call Doctor Management Company')
	,('00000000-0000-0000-0000-000000000005', 'ACTIVE' ,'SPECIALIZED DOCTOR', 'Specialized Doctor Management Company')
	,('00000000-0000-0000-0000-000000000006', 'ACTIVE' ,'GENERAL SURGEON', 'General Surgeon Management Company')
) [Source]([RoleId], [RoleName], [LoweredRoleName], [Description])
ON [Target].[RoleId] = [Source].[RoleId]
WHEN MATCHED THEN
	UPDATE SET
		[Target].[RoleName]		= [Source].[RoleName]
		,[Target].[LoweredRoleName]	= [Source].[LoweredRoleName]
		,[Target].[Description]		= [Source].[Description]
WHEN NOT MATCHED THEN
	INSERT ([RoleId], [RoleName], [LoweredRoleName], [Description])
	VALUES (
		[Source].[RoleId]
		,[Source].[RoleName]
		,[Source].[LoweredRoleName]
		,[Source].[Description]
	)
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;