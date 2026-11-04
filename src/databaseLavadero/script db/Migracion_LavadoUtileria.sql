/*
    Migracion_LavadoUtileria - Utilerias por lavado
    Motor: Microsoft SQL Server

    Descripcion:
        Crea la tabla DetalleUtileria, copia la utileria escalar de cada lavado
        existente, verifica que todos los lavados tengan su detalle y recien
        entonces elimina la columna Lavado.utileria y su clave foranea.

    Uso:
        Revisar, respaldar la base y ejecutar manualmente en SQL Server
        Management Studio o sqlcmd. Es segura de reejecutar: si la columna ya
        no existe, no intenta copiar ni eliminar nada.
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

IF OBJECT_ID(N'dbo.DetalleUtileria', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DetalleUtileria
    (
        codigoLavado   BIGINT NOT NULL,
        codigoUtileria BIGINT NOT NULL,
        CONSTRAINT PK_DetalleUtileria PRIMARY KEY (codigoLavado, codigoUtileria),
        CONSTRAINT FK_DetalleUtileria_Lavado FOREIGN KEY (codigoLavado)
            REFERENCES dbo.Lavado (codigoLavado) ON DELETE CASCADE,
        CONSTRAINT FK_DetalleUtileria_Utileria FOREIGN KEY (codigoUtileria)
            REFERENCES dbo.Utileria (codigoUtileria)
    );
END
GO

IF COL_LENGTH(N'dbo.Lavado', N'utileria') IS NOT NULL
BEGIN
    DECLARE @migrar nvarchar(max) = N'
        BEGIN TRANSACTION;

        INSERT INTO dbo.DetalleUtileria (codigoLavado, codigoUtileria)
        SELECT l.codigoLavado, l.utileria
        FROM dbo.Lavado l
        WHERE l.utileria IS NOT NULL
          AND NOT EXISTS (
              SELECT 1
              FROM dbo.DetalleUtileria d
              WHERE d.codigoLavado = l.codigoLavado
                AND d.codigoUtileria = l.utileria
          );

        IF EXISTS (
            SELECT 1
            FROM dbo.Lavado l
            WHERE l.utileria IS NOT NULL
              AND NOT EXISTS (
                  SELECT 1
                  FROM dbo.DetalleUtileria d
                  WHERE d.codigoLavado = l.codigoLavado
              )
        )
        BEGIN
            ;THROW 51002, N''Hay lavados sin detalle de utileria. No se elimina Lavado.utileria.'', 1;
        END

        DECLARE @fk sysname;

        SELECT @fk = fk.name
        FROM sys.foreign_keys fk
        JOIN sys.foreign_key_columns fkc
          ON fkc.constraint_object_id = fk.object_id
        WHERE fk.parent_object_id = OBJECT_ID(N''dbo.Lavado'')
          AND COL_NAME(fkc.parent_object_id, fkc.parent_column_id) = N''utileria'';

        IF @fk IS NOT NULL
        BEGIN
            DECLARE @sql nvarchar(max);
            SET @sql = N''ALTER TABLE dbo.Lavado DROP CONSTRAINT '' + QUOTENAME(@fk);
            EXEC(@sql);
        END

        ALTER TABLE dbo.Lavado DROP COLUMN utileria;

        COMMIT TRANSACTION;
    ';

    BEGIN TRY
        EXEC(@migrar);
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
