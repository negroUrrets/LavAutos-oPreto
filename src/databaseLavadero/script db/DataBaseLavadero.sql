/*
    DataBaseLavadero - Esquema de base de datos
    Motor: Microsoft SQL Server

    Descripcion:
        Crea la base de datos DataBaseLavadero con las tablas del dominio del
        lavadero de vehiculos, sus claves primarias, claves foraneas y relaciones.

    Alcance:
        Solo esquema. No inserta datos iniciales ni semilla.

    Caracteristicas:
        - Idempotente y no destructivo: crea la base y las tablas solo si no
          existen. No elimina objetos ni datos.
        - La herencia Cliente/Persona se implementa como tabla por tipo (TPT):
          Cliente comparte la clave primaria codigoPersona de Persona.
        - Se preserva la relacion Lavado -> Vehiculo -> Cliente, sin una clave
          foranea directa de Lavado hacia Cliente.

    Uso:
        Revisar el script y ejecutarlo manualmente en SQL Server Management
        Studio o sqlcmd sobre una instancia de SQL Server accesible.
*/

SET NOCOUNT ON;
GO

/* 1. Base de datos */
IF DB_ID(N'DataBaseLavadero') IS NULL
BEGIN
    CREATE DATABASE [DataBaseLavadero] COLLATE Modern_Spanish_CI_AS;
END
GO

USE [DataBaseLavadero];
GO

/* 2. Personas y clientes (herencia TPT) */

IF OBJECT_ID(N'dbo.Persona', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Persona
    (
        codigoPersona BIGINT IDENTITY(1,1) NOT NULL,
        nombre        VARCHAR(100) NOT NULL,
        apellido      VARCHAR(100) NOT NULL,
        dni           BIGINT       NOT NULL,
        email         VARCHAR(150) NULL,
        celular       BIGINT       NULL,
        CONSTRAINT PK_Persona PRIMARY KEY (codigoPersona)
    );
END
GO

IF OBJECT_ID(N'dbo.Cliente', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Cliente
    (
        codigoPersona BIGINT NOT NULL,
        estadoCliente BIT    NOT NULL,
        CONSTRAINT PK_Cliente PRIMARY KEY (codigoPersona),
        CONSTRAINT FK_Cliente_Persona FOREIGN KEY (codigoPersona)
            REFERENCES dbo.Persona (codigoPersona)
    );
END
GO

/* 3. Catalogo de vehiculos */

IF OBJECT_ID(N'dbo.CategoriaVehiculo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CategoriaVehiculo
    (
        codigoCategoriaVehi BIGINT       IDENTITY(1,1) NOT NULL,
        categoriaVehi       VARCHAR(100) NOT NULL,
        CONSTRAINT PK_CategoriaVehiculo PRIMARY KEY (codigoCategoriaVehi)
    );
END
GO

IF OBJECT_ID(N'dbo.MarcaVehiculo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.MarcaVehiculo
    (
        codigoMarcaVehi BIGINT       IDENTITY(1,1) NOT NULL,
        marcaVehi       VARCHAR(100) NOT NULL,
        categoriaVehi   BIGINT       NOT NULL,
        CONSTRAINT PK_MarcaVehiculo PRIMARY KEY (codigoMarcaVehi),
        CONSTRAINT FK_MarcaVehiculo_CategoriaVehiculo FOREIGN KEY (categoriaVehi)
            REFERENCES dbo.CategoriaVehiculo (codigoCategoriaVehi)
    );
END
GO

IF OBJECT_ID(N'dbo.ModeloVehiculo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ModeloVehiculo
    (
        codigoModeloVehi BIGINT       IDENTITY(1,1) NOT NULL,
        modeloVehi       VARCHAR(100) NOT NULL,
        marcaVehi        BIGINT       NOT NULL,
        CONSTRAINT PK_ModeloVehiculo PRIMARY KEY (codigoModeloVehi),
        CONSTRAINT FK_ModeloVehiculo_MarcaVehiculo FOREIGN KEY (marcaVehi)
            REFERENCES dbo.MarcaVehiculo (codigoMarcaVehi)
    );
END
GO

IF OBJECT_ID(N'dbo.Vehiculo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Vehiculo
    (
        codigoVehi  BIGINT      IDENTITY(1,1) NOT NULL,
        patenteVehi VARCHAR(20) NOT NULL,
        estadoVehi  BIT         NOT NULL,
        cliente     BIGINT      NOT NULL,
        modeloVehi  BIGINT      NOT NULL,
        CONSTRAINT PK_Vehiculo PRIMARY KEY (codigoVehi),
        CONSTRAINT FK_Vehiculo_Cliente FOREIGN KEY (cliente)
            REFERENCES dbo.Cliente (codigoPersona),
        CONSTRAINT FK_Vehiculo_ModeloVehiculo FOREIGN KEY (modeloVehi)
            REFERENCES dbo.ModeloVehiculo (codigoModeloVehi)
    );
END
GO

/* 4. Usuarios, login, categorias y lavados */

IF OBJECT_ID(N'dbo.Usuario', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Usuario
    (
        codigoUsuario BIGINT       IDENTITY(1,1) NOT NULL,
        nombreUsuario VARCHAR(100) NOT NULL,
        [contraseña]  VARCHAR(255) NOT NULL,
        CONSTRAINT PK_Usuario PRIMARY KEY (codigoUsuario)
    );
END
GO

IF OBJECT_ID(N'dbo.Login', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Login
    (
        codigoLogin BIGINT IDENTITY(1,1) NOT NULL,
        usuario     BIGINT NOT NULL,
        CONSTRAINT PK_Login PRIMARY KEY (codigoLogin),
        CONSTRAINT FK_Login_Usuario FOREIGN KEY (usuario)
            REFERENCES dbo.Usuario (codigoUsuario)
    );
END
GO

IF OBJECT_ID(N'dbo.CategoriaLavado', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CategoriaLavado
    (
        codigoCategoriaLavado BIGINT       IDENTITY(1,1) NOT NULL,
        descripcionLavado     VARCHAR(200) NOT NULL,
        CONSTRAINT PK_CategoriaLavado PRIMARY KEY (codigoCategoriaLavado)
    );
END



GO

IF OBJECT_ID(N'dbo.EstadoLavado', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.EstadoLavado
    (
        codigoEstado      BIGINT       IDENTITY(1,1) NOT NULL,
        descripcionEstado VARCHAR(200) NOT NULL,
        estadoLavado      BIT          NOT NULL,
        CONSTRAINT PK_EstadoLavado PRIMARY KEY (codigoEstado)
    );
END
GO

IF OBJECT_ID(N'dbo.Utileria', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Utileria
    (
        codigoUtileria      BIGINT       IDENTITY(1,1) NOT NULL,
        descripcionUtileria VARCHAR(200) NOT NULL,
        estadoUtileria      BIT          NOT NULL,
        CONSTRAINT PK_Utileria PRIMARY KEY (codigoUtileria)
    );
END
GO

IF OBJECT_ID(N'dbo.Lavado', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Lavado
    (
        codigoLavado    BIGINT       IDENTITY(1,1) NOT NULL,
        fechaHoraLavado DATETIME2    NOT NULL,
        vehi            BIGINT       NOT NULL,
        categoriaLavado BIGINT       NOT NULL,
        login           BIGINT       NOT NULL,
        estado          BIGINT       NOT NULL,
        utileria        BIGINT       NOT NULL,
        detallesLavado  VARCHAR(255) NULL,
        fechaHoraLavadoTerminado DATETIME2    NOT NULL,
        CONSTRAINT PK_Lavado PRIMARY KEY (codigoLavado),
        CONSTRAINT FK_Lavado_Vehiculo FOREIGN KEY (vehi)
            REFERENCES dbo.Vehiculo (codigoVehi),
        CONSTRAINT FK_Lavado_CategoriaLavado FOREIGN KEY (categoriaLavado)
            REFERENCES dbo.CategoriaLavado (codigoCategoriaLavado),
        CONSTRAINT FK_Lavado_Login FOREIGN KEY (login)
            REFERENCES dbo.Login (codigoLogin),
        CONSTRAINT FK_Lavado_EstadoLavado FOREIGN KEY (estado)
            REFERENCES dbo.EstadoLavado (codigoEstado),
        CONSTRAINT FK_Lavado_Utileria FOREIGN KEY (utileria)
            REFERENCES dbo.Utileria (codigoUtileria)
    );
END

GO



