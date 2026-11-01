/*
    DataBaseLavadero - Esquema de base de datos
    Motor: Microsoft SQL Server

    Descripcion:
        Crea la base de datos DataBaseLavadero con las tablas del dominio del
        lavadero de vehiculos, sus claves primarias, claves foraneas y relaciones.

    Alcance:
        Esquema y datos iniciales de los catalogos: utilerias, categorias y estados
        de lavado, categorias, marcas y modelos de vehiculo. Las inserciones son
        idempotentes y no destructivas.

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
/* 5. Datos iniciales de catalogos */

/* CategoriaVehiculo */
SET IDENTITY_INSERT dbo.CategoriaVehiculo ON;
IF NOT EXISTS (SELECT 1 FROM dbo.CategoriaVehiculo WHERE codigoCategoriaVehi = 43)
    INSERT INTO dbo.CategoriaVehiculo (codigoCategoriaVehi, categoriaVehi) VALUES (43, N'Camion');
IF NOT EXISTS (SELECT 1 FROM dbo.CategoriaVehiculo WHERE codigoCategoriaVehi = 44)
    INSERT INTO dbo.CategoriaVehiculo (codigoCategoriaVehi, categoriaVehi) VALUES (44, N'Automovil');
IF NOT EXISTS (SELECT 1 FROM dbo.CategoriaVehiculo WHERE codigoCategoriaVehi = 45)
    INSERT INTO dbo.CategoriaVehiculo (codigoCategoriaVehi, categoriaVehi) VALUES (45, N'Utilitario');
SET IDENTITY_INSERT dbo.CategoriaVehiculo OFF;
GO

/* MarcaVehiculo */
SET IDENTITY_INSERT dbo.MarcaVehiculo ON;
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 38)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (38, N'Iveco', 43);
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 39)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (39, N'Mercedes Benz', 43);
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 40)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (40, N'VolksWagen', 43);
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 41)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (41, N'Renault', 44);
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 42)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (42, N'Ford', 44);
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 43)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (43, N'Nissan', 44);
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 44)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (44, N'Toyota', 45);
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 45)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (45, N'Peugeot', 45);
IF NOT EXISTS (SELECT 1 FROM dbo.MarcaVehiculo WHERE codigoMarcaVehi = 46)
    INSERT INTO dbo.MarcaVehiculo (codigoMarcaVehi, marcaVehi, categoriaVehi) VALUES (46, N'Citroen', 45);
SET IDENTITY_INSERT dbo.MarcaVehiculo OFF;
GO

/* ModeloVehiculo */
SET IDENTITY_INSERT dbo.ModeloVehiculo ON;
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 43)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (43, N'Daily', 38);
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 44)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (44, N'Atego', 39);
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 45)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (45, N'Worker', 40);
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 46)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (46, N'Duster', 41);
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 47)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (47, N'Fiesta', 42);
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 48)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (48, N'Versa', 43);
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 49)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (49, N'Hilux', 44);
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 50)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (50, N'Partner', 45);
IF NOT EXISTS (SELECT 1 FROM dbo.ModeloVehiculo WHERE codigoModeloVehi = 51)
    INSERT INTO dbo.ModeloVehiculo (codigoModeloVehi, modeloVehi, marcaVehi) VALUES (51, N'Berlingo', 46);
SET IDENTITY_INSERT dbo.ModeloVehiculo OFF;
GO

/* Utileria */
IF NOT EXISTS (SELECT 1 FROM dbo.Utileria WHERE descripcionUtileria = N'Auxilio')
    INSERT INTO dbo.Utileria (descripcionUtileria, estadoUtileria) VALUES (N'Auxilio', 1);
IF NOT EXISTS (SELECT 1 FROM dbo.Utileria WHERE descripcionUtileria = N'Balizas')
    INSERT INTO dbo.Utileria (descripcionUtileria, estadoUtileria) VALUES (N'Balizas', 0);
IF NOT EXISTS (SELECT 1 FROM dbo.Utileria WHERE descripcionUtileria = N'Matafuegos')
    INSERT INTO dbo.Utileria (descripcionUtileria, estadoUtileria) VALUES (N'Matafuegos', 0);
GO

/* CategoriaLavado */
IF NOT EXISTS (SELECT 1 FROM dbo.CategoriaLavado WHERE descripcionLavado = N'Basico')
    INSERT INTO dbo.CategoriaLavado (descripcionLavado) VALUES (N'Basico');
IF NOT EXISTS (SELECT 1 FROM dbo.CategoriaLavado WHERE descripcionLavado = N'Completo')
    INSERT INTO dbo.CategoriaLavado (descripcionLavado) VALUES (N'Completo');
IF NOT EXISTS (SELECT 1 FROM dbo.CategoriaLavado WHERE descripcionLavado = N'Premium')
    INSERT INTO dbo.CategoriaLavado (descripcionLavado) VALUES (N'Premium');
GO

/* EstadoLavado */
IF NOT EXISTS (SELECT 1 FROM dbo.EstadoLavado WHERE descripcionEstado = N'En Espera')
    INSERT INTO dbo.EstadoLavado (descripcionEstado, estadoLavado) VALUES (N'En Espera', 1);
IF NOT EXISTS (SELECT 1 FROM dbo.EstadoLavado WHERE descripcionEstado = N'Lavando')
    INSERT INTO dbo.EstadoLavado (descripcionEstado, estadoLavado) VALUES (N'Lavando', 1);
IF NOT EXISTS (SELECT 1 FROM dbo.EstadoLavado WHERE descripcionEstado = N'Terminado')
    INSERT INTO dbo.EstadoLavado (descripcionEstado, estadoLavado) VALUES (N'Terminado', 1);
IF NOT EXISTS (SELECT 1 FROM dbo.EstadoLavado WHERE descripcionEstado = N'Entregado')
    INSERT INTO dbo.EstadoLavado (descripcionEstado, estadoLavado) VALUES (N'Entregado', 1);
GO
