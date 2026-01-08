# Acity Challenge - Sistema de Autenticación

Este proyecto es una solución técnica para el desafío de **Atlantic City**, desarrollada bajo los principios de **Arquitectura Limpia (Clean Architecture)** y **CQRS** utilizando .NET 9.

## 🚀 Tecnologías Utilizadas

* **Framework:** .NET 9 (ASP.NET Core API)
* **Arquitectura:** Clean Architecture (Domain, Application, Infrastructure, Api)
* **Persistencia:** Entity Framework Core con SQL Server
* **Seguridad:** BCrypt para hashing de contraseñas y JWT (JSON Web Tokens) para autorización
* **Patrones:** CQRS con MediatR
* **Entorno:** Desarrollado en WSL2 (Ubuntu) con conexión a SQL Server en Host Windows

## 🛠️ Configuración e Instalación

1.  **Base de Datos:**
    * Asegúrese de tener una instancia de SQL Server activa.
    * Actualice la cadena de conexión en `AcityChallenge.Api/appsettings.json`.
    * Ejecute las migraciones (opcional si la BD ya existe): `dotnet ef database update --project AcityChallenge.Infrastructure --startup-project AcityChallenge.Api`.

2.  **Secretos JWT:**
    * La API utiliza una clave secreta configurada en `appsettings.json` para firmar los tokens.

## 🏃 Cómo Ejecutar

Desde la raíz del proyecto, ejecute:
```bash
dotnet run --project AcityChallenge.Api