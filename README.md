# Atlantic City Challenge - Sistema de Gestión de Pedidos y Usuarios

Este proyecto es una solución técnica integral desarrollada bajo los principios de Arquitectura Limpia (Clean Architecture) y CQRS utilizando .NET 9.

## 🚀 Tecnologías Utilizadas

### Backend (.NET 9)
* Framework: ASP.NET Core API con Clean Architecture.
* Patrones: CQRS con MediatR para la separación de comandos y consultas.
* Persistencia: Entity Framework Core con SQL Server.
* Seguridad: Autenticación JWT y Hashing de contraseñas con BCrypt.

### Frontend (React + Vite)
* UI: Tailwind CSS para un diseño moderno y responsivo.
* Iconografía: Lucide-react.
* Cliente API: Axios con interceptores para el manejo seguro de tokens.

---

## 🛠️ Configuración e Instalación

### 1. Requisitos Previos
* SDK de .NET 9.0 o superior.
* Node.js (LTS) y npm.
* Instancia de SQL Server activa.

### 2. Configuración del Backend
1. Base de Datos: Actualice la cadena de conexión en AcityChallenge.Api/appsettings.json con sus credenciales de SQL Server.
2. Migraciones: Ejecute el siguiente comando para crear las tablas necesarias:

   ```bash
   dotnet ef database update --project AcityChallenge.Infrastructure --startup-project AcityChallenge.Api
   ```

3. Ejecución: Desde la raíz del proyecto, ejecute:

   ```bash
   dotnet run --project AcityChallenge.Api
   ```

4. La API estará disponible en: http://localhost:5187.
   
   *Nota: El sistema cuenta con un DbInitializer que creará automáticamente al usuario administrador si la tabla está vacía.*

### 3. Configuración del Frontend
1. Instalación:

   ```bash
   cd frontend && npm install
   ```

2. Ejecución:

   ```bash
   npm run dev
   ```

3. Acceso: http://localhost:5173.

---

## 🔑 Credenciales de Acceso (Seeder)

El sistema inicializa los siguientes datos por defecto:
* Usuario: seguridad@ejemplo.com
* Contraseña: 12345678

---

## 📋 Funcionalidades Implementadas

* Autenticación JWT: Login seguro y cierre de sesión con invalidación de sesión.
* Gestión de Usuarios (CRUD): Listado dinámico, creación y eliminación física.
* Gestión de Pedidos (CRUD): Creación, actualización, listado y eliminación lógica.
* Perfil Dinámico: Identificación automática del usuario logueado en la cabecera.
* UI Consistente: Sidebar con resaltado dinámico y botones de refresco.