IF OBJECT_ID(N'[User]', N'U') IS NULL
BEGIN
  CREATE TABLE [User] (
    [id] INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_User] PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(320) NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    [role] NVARCHAR(32) NOT NULL CONSTRAINT [DF_User_role] DEFAULT N'ADMIN',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DF_User_createdAt] DEFAULT SYSUTCDATETIME(),
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_User_updatedAt] DEFAULT SYSUTCDATETIME(),
    CONSTRAINT [UQ_User_email] UNIQUE ([email]),
    CONSTRAINT [CK_User_role] CHECK ([role] IN (N'ADMIN'))
  );
END
GO

IF OBJECT_ID(N'[MenuItem]', N'U') IS NULL
BEGIN
  CREATE TABLE [MenuItem] (
    [id] INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_MenuItem] PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NOT NULL,
    [price] DECIMAL(10, 2) NOT NULL,
    [category] NVARCHAR(120) NOT NULL,
    [imageUrl] NVARCHAR(2048) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DF_MenuItem_createdAt] DEFAULT SYSUTCDATETIME(),
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_MenuItem_updatedAt] DEFAULT SYSUTCDATETIME()
  );
END
GO

IF OBJECT_ID(N'[RestaurantTable]', N'U') IS NULL
BEGIN
  CREATE TABLE [RestaurantTable] (
    [id] INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_RestaurantTable] PRIMARY KEY,
    [tableNumber] INT NOT NULL,
    [capacity] INT NOT NULL,
    [status] NVARCHAR(32) NOT NULL CONSTRAINT [DF_RestaurantTable_status] DEFAULT N'AVAILABLE',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DF_RestaurantTable_createdAt] DEFAULT SYSUTCDATETIME(),
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_RestaurantTable_updatedAt] DEFAULT SYSUTCDATETIME(),
    CONSTRAINT [UQ_RestaurantTable_tableNumber] UNIQUE ([tableNumber]),
    CONSTRAINT [CK_RestaurantTable_status] CHECK ([status] IN (N'AVAILABLE', N'RESERVED', N'OCCUPIED'))
  );
END
GO

IF OBJECT_ID(N'[Reservation]', N'U') IS NULL
BEGIN
  CREATE TABLE [Reservation] (
    [id] INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_Reservation] PRIMARY KEY,
    [customerName] NVARCHAR(255) NOT NULL,
    [customerEmail] NVARCHAR(320) NOT NULL,
    [customerPhone] NVARCHAR(80) NOT NULL,
    [reservationDate] DATETIME2 NOT NULL,
    [reservationTime] NVARCHAR(20) NOT NULL,
    [guests] INT NOT NULL,
    [notes] NVARCHAR(MAX) NULL,
    [tableId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DF_Reservation_createdAt] DEFAULT SYSUTCDATETIME(),
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_Reservation_updatedAt] DEFAULT SYSUTCDATETIME(),
    CONSTRAINT [FK_Reservation_RestaurantTable_tableId]
      FOREIGN KEY ([tableId]) REFERENCES [RestaurantTable] ([id]),
    CONSTRAINT [UQ_Reservation_reservationDate_reservationTime_tableId]
      UNIQUE ([reservationDate], [reservationTime], [tableId])
  );
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE [name] = N'IX_Reservation_reservationDate_reservationTime'
    AND [object_id] = OBJECT_ID(N'[Reservation]')
)
BEGIN
  CREATE INDEX [IX_Reservation_reservationDate_reservationTime]
    ON [Reservation] ([reservationDate], [reservationTime]);
END
GO

IF OBJECT_ID(N'[Testimonial]', N'U') IS NULL
BEGIN
  CREATE TABLE [Testimonial] (
    [id] INT IDENTITY(1,1) NOT NULL CONSTRAINT [PK_Testimonial] PRIMARY KEY,
    [customerName] NVARCHAR(255) NOT NULL,
    [comment] NVARCHAR(MAX) NOT NULL,
    [rating] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DF_Testimonial_createdAt] DEFAULT SYSUTCDATETIME()
  );
END
GO
