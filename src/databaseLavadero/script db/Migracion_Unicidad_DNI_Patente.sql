/*
    Migracion_Unicidad_DNI_Patente - Restricciones de unicidad
    Motor: Microsoft SQL Server

    Descripcion:
        Agrega el indice unico de DNI y la clave normalizada de patente con su indice unico
        sobre una base DataBaseLavadero existente. Es idempotente y no borra datos.

    Uso:
        Revisar y ejecutar manualmente en SQL Server Management Studio o sqlcmd.
        Si existen DNI o patentes duplicadas, el script aborta sin crear las restricciones.
*/

SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET NUMERIC_ROUNDABORT OFF;
GO

USE [DataBaseLavadero];
GO

/* Abortar si hay DNI duplicados */
IF EXISTS (
    SELECT 1 FROM dbo.Persona GROUP BY dni HAVING COUNT(*) > 1
)
BEGIN
    ;THROW 51000, N'Hay DNI duplicados en Persona. Resuelva los duplicados antes de crear UQ_Persona_Dni.', 1;
END
GO

/* Abortar si hay patentes duplicadas normalizadas */
IF EXISTS (
    SELECT 1
    FROM dbo.Vehiculo
    GROUP BY UPPER(REPLACE(REPLACE(patenteVehi, '-', ''), ' ', ''))
    HAVING COUNT(*) > 1
)
BEGIN
    ;THROW 51001, N'Hay patentes duplicadas normalizadas en Vehiculo. Resuelva los duplicados antes de crear UQ_Vehiculo_PatenteClave.', 1;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'UQ_Persona_Dni' AND object_id = OBJECT_ID(N'dbo.Persona')
)
    CREATE UNIQUE INDEX UQ_Persona_Dni ON dbo.Persona (dni);
GO

IF COL_LENGTH(N'dbo.Vehiculo', N'patenteClave') IS NULL
    ALTER TABLE dbo.Vehiculo
        ADD patenteClave AS (CAST(UPPER(REPLACE(REPLACE(patenteVehi, '-', ''), ' ', '')) AS VARCHAR(20))) PERSISTED;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'UQ_Vehiculo_PatenteClave' AND object_id = OBJECT_ID(N'dbo.Vehiculo')
)
    CREATE UNIQUE INDEX UQ_Vehiculo_PatenteClave ON dbo.Vehiculo (patenteClave);
GO
