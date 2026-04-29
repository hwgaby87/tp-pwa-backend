# Conecta API - Backend

Este es el backend de **Conecta**, una plataforma de comunicación en tiempo real inspirada en Slack, desarrollada como proyecto final para la Diplomatura de Desarrollo FullStack (Backend) de la UTN.

La aplicación permite gestionar espacios de trabajo, canales, mensajería directa y un sistema robusto de roles y permisos.

## 🚀 Tecnologías Utilizadas

*   **Entorno de ejecución:** [Node.js](https://nodejs.org/)
*   **Framework Web:** [Express.js](https://expressjs.com/)
*   **Base de Datos:** [MongoDB](https://www.mongodb.com/) con [Mongoose](https://mongoosejs.com/)
*   **Autenticación:** [JSON Web Tokens (JWT)](https://jwt.io/) y [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
*   **Envío de Correos:** [Nodemailer](https://nodemailer.com/)
*   **Validación:** [Express-validator](https://express-validator.github.io/docs/)
*   **CORS:** Habilitado para integración con el frontend.

## ✨ Funcionalidades Principales

*   **Autenticación y Seguridad:**
    *   Registro de usuarios con validación de datos.
    *   Verificación de cuenta vía correo electrónico.
    *   Inicio de sesión seguro con JWT.
    *   Recuperación de contraseña mediante tokens temporales.
*   **Gestión de Workspaces (Espacios de Trabajo):**
    *   Creación, edición y eliminación (archivado) de workspaces.
    *   Sistema de invitaciones por correo electrónico.
    *   Roles definidos: **Owner** (dueño), **Admin** (administrador) y **User** (miembro).
*   **Canales de Comunicación:**
    *   Creación de canales públicos dentro de un workspace.
    *   Gestión de mensajes en tiempo real.
    *   Funcionalidad de "marcar como leído" y "recibido".
*   **Mensajería Directa:**
    *   Conversaciones privadas uno a uno entre miembros del mismo workspace.
*   **Perfil de Usuario:**
    *   Gestión de datos personales y visualización de perfiles.

## 🛠️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd tp-pwa-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente estructura:
    ```env
    PORT=8080
    MONGO_DB_CONECTION_STRING=tu_cadena_de_conexion_mongodb
    URL_FRONTEND=http://localhost:5173
    URL_BACKEND=http://localhost:8080
    JWT_SECRET_KEY=tu_clave_secreta_para_jwt
    EMAIL_USER=tu_correo_gmail@gmail.com
    EMAIL_PASSWORD=tu_app_password_de_google
    ```

4.  **Iniciar el servidor en modo desarrollo:**
    ```bash
    npm run dev
    ```

El servidor estará disponible en `http://localhost:8080`.

## 📂 Estructura del Proyecto

```text
src/
├── config/         # Configuraciones (DB, etc.)
├── constants/      # Constantes globales (Roles, etc.)
├── controllers/    # Lógica de manejo de peticiones
├── dtos/           # Objetos de Transferencia de Datos
├── helpers/        # Funciones de utilidad
├── middlewares/    # Middlewares de Express (Auth, Validaciones)
├── models/         # Modelos de Mongoose (Esquemas)
├── repositories/   # Capa de acceso a datos
├── routes/         # Definición de rutas/endpoints
├── services/       # Lógica de negocio
└── main.js         # Punto de entrada de la aplicación
```

## 📖 Documentación de Endpoints

### 🔐 Autenticación (`/api/auth`)
*   `POST /register`: Registra un nuevo usuario.
*   `POST /login`: Inicia sesión y devuelve un token JWT.
*   `GET /verify-email`: Verifica el correo del usuario (usado desde el email).
*   `POST /reset-password-request`: Solicita recuperación de contraseña.
*   `POST /reset-password/:reset_password_token`: Establece una nueva contraseña.

### 🏢 Workspaces (`/api/workspaces`)
*   `GET /`: Lista los workspaces del usuario autenticado.
*   `POST /`: Crea un nuevo workspace.
*   `GET /:workspace_id`: Obtiene detalles de un workspace específico.
*   `PUT /:workspace_id`: Actualiza datos del workspace (Admin/Owner).
*   `DELETE /:workspace_id`: Archiva un workspace (Owner).
*   `POST /:workspace_id/restore`: Restaura un workspace archivado (Owner).
*   `GET /respond-invitation`: Procesa la respuesta a una invitación.

### 💬 Canales (`/api/workspaces/:workspace_id/channels`)
*   `GET /`: Lista todos los canales del workspace.
*   `POST /`: Crea un nuevo canal (Admin/User).
*   `PUT /:channel_id`: Actualiza un canal.
*   `DELETE /:channel_id`: Elimina un canal (Admin).

### 📧 Mensajes de Canal (`/api/workspaces/:workspace_id/channels/:channel_id/messages`)
*   `GET /`: Obtiene los mensajes del canal.
*   `POST /`: Envía un mensaje al canal.
*   `PUT /:message_id/read`: Marca un mensaje como leído.
*   `DELETE /:message_id`: Elimina un mensaje.

### 👥 Miembros (`/api/workspaces/:workspace_id/members`)
*   `GET /`: Lista los miembros del workspace.
*   `POST /`: Invita a un nuevo miembro (Admin).
*   `PUT /:memberId`: Actualiza el rol de un miembro (Admin).
*   `DELETE /:memberId`: Elimina a un miembro del workspace (Admin).

### ✉️ Mensajes Directos (`/api/workspaces/:workspace_id/direct-messages`)
*   `GET /:other_member_id`: Obtiene la conversación con otro miembro.
*   `POST /:receiver_member_id`: Envía un mensaje directo.

### 👤 Usuarios (`/api/users`)
*   `GET /`: Lista usuarios (requiere auth).
*   `GET /:id`: Obtiene datos de un usuario.
*   `PUT /`: Actualiza perfil del usuario actual.

---
© 2026 - Conecta API. Proyecto desarrollado para UTN.
