# Conecta API - Backend 🚀

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

## 📝 Descripción

**Conecta API** es el motor de backend desarrollado para una plataforma de comunicación y colaboración en tiempo real orientada a equipos de trabajo. El sistema expone una API REST robusta que gestiona la persistencia de datos, la autenticación de usuarios y la orquestación de espacios de trabajo, canales de comunicación y mensajería directa. Este proyecto fue desarrollado como trabajo final para la **Diplomatura en Desarrollo Web FullStack** de la **Universidad Tecnológica Nacional (UTN)**.

El sistema resuelve la necesidad de centralizar la comunicación corporativa en una interfaz fluida (PWA), permitiendo la gestión jerárquica de permisos mediante roles y el almacenamiento persistente de archivos multimedia en la nube.

---

## 🎓 Contexto Académico

*   **Institución:** Universidad Tecnológica Nacional (UTN)
*   **Programa:** Diplomatura en Desarrollo Web FullStack (Especialización Backend)
*   **Año de Entrega:** 2026
*   **Integrantes:** Haberkorn, Gabriela

### Módulos Aplicados
En el desarrollo de esta API se integraron los conocimientos adquiridos en los siguientes módulos:
*   **Servidores con Node.js y Express:** Configuración de middlewares, ruteo avanzado y manejo de peticiones asíncronas.
*   **Bases de Datos NoSQL:** Modelado de datos con Mongoose y persistencia en MongoDB Atlas.
*   **Seguridad:** Implementación de hashing de contraseñas con Bcrypt y generación de tokens stateless con JWT.
*   **Arquitectura:** Aplicación del patrón de capas (Controller-Service-Repository) para separar la lógica de negocio del acceso a datos.


## 📡 URL Base

*   **Producción:** `https://tp-pwa-backend.vercel.app/api`
*   **Desarrollo:** `http://localhost:3000/api`

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Rol en el Proyecto |
| :--- | :--- | :--- |
| **Node.js** | LTS | Entorno de ejecución de JavaScript. |
| **Express** | ^5.2.1 | Framework web para la creación de la API REST. |
| **MongoDB** | ^9.4.1 (Mongoose) | Base de datos NoSQL y ODM para modelado. |
| **JSON Web Token** | ^9.0.3 | Estándar para la transmisión segura de información de identidad. |
| **Bcrypt** | ^6.0.0 | Algoritmo de hashing para seguridad de contraseñas. |
| **Cloudinary** | ^1.41.3 | Gestión de almacenamiento de archivos multimedia en la nube. |
| **Nodemailer** | ^8.0.5 | Servicio para el envío de correos electrónicos (recuperación de contraseña). |
| **Multer** | ^2.1.1 | Middleware para la gestión de datos de formulario (archivos). |

---

## ⚙️ Configuración del Entorno

Para que la API funcione correctamente, se deben configurar las siguientes variables de entorno en un archivo `.env`:

| Variable | Descripción | Ejemplo | Requerida |
| :--- | :--- | :--- | :---: |
| `PORT` | Puerto en el que correrá el servidor local. | `3000` | Sí |
| `MONGODB_URI` | Cadena de conexión a MongoDB Atlas o local. | `mongodb+srv://...` | Sí |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT. | `tu_secreto_super_seguro` | Sí |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token. | `7d` | Sí |
| `GMAIL_USER` | Cuenta de Gmail para enviar correos. | `user@gmail.com` | Sí |
| `GMAIL_PASS` | Contraseña de aplicación de Gmail. | `xxxx xxxx xxxx xxxx` | Sí |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la cuenta en Cloudinary. | `my_cloud_name` | Sí |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary. | `123456789` | Sí |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary. | `xxxxxxxxxx` | Sí |
| `CORS_ORIGIN` | URL permitida para el frontend. | `http://localhost:5173` | Sí |

---

## 📦 Instalación y Ejecución Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/hwgaby87/tp-pwa-backend.git
    cd tp-pwa-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Cree un archivo `.env` en la raíz del proyecto basándose en los campos descritos anteriormente.

4.  **Iniciar en modo desarrollo:**
    ```bash
    npm run dev
    ```

5.  **Iniciar en modo producción:**
    ```bash
    npm start
    ```

---

## 📂 Estructura del Proyecto

```text
src/
├── config/             # Conexión a DB y variables de entorno
├── constants/          # Constantes globales y enums (roles, estados)
├── controllers/        # Lógica de manejo de peticiones HTTP
├── dtos/               # Objetos de transferencia de datos (limpieza de modelos)
├── helpers/            # Funciones auxiliares y generadores de HTML
├── middlewares/        # Validaciones, autenticación y manejo de errores
│   └── validators/     # Esquemas de validación (express-validator)
├── models/             # Esquemas de Mongoose para la base de datos
├── repositories/       # Capa de acceso a datos (patrón Repository)
├── routes/             # Definición de rutas y endpoints
├── services/           # Lógica de negocio core
└── main.js             # Punto de entrada de la aplicación
```

---

## 💾 Modelos de Datos

### User (Usuario)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | String | Sí | Nombre de visualización del usuario. |
| `email` | String | Sí | Correo electrónico (único). |
| `password` | String | Sí | Contraseña hasheada. |
| `image` | String | No | URL de la foto de perfil (Cloudinary). |

### Workspace (Espacio de Trabajo)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | String | Sí | Título del espacio. |
| `description`| String | Sí | Descripción corta del propósito. |
| `url_image` | String | No | Imagen representativa. |
| `active` | Boolean | Sí | Estado del espacio (borrado lógico). |

---

## 🔐 Autenticación

La API utiliza **JSON Web Tokens (JWT)** para proteger los recursos. Para acceder a rutas protegidas:
1.  Se debe realizar un `POST` a `/api/auth/login` con credenciales válidas.
2.  La API devolverá un `auth_token`.
3.  Este token debe incluirse en la cabecera de todas las peticiones siguientes:
    `Authorization: Bearer <TOKEN_AQUÍ>`

---

## 🛰️ Documentación de Endpoints

### 🔐 Autenticación (Auth)
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :---: |
| POST | `/api/auth/register` | Registra un nuevo usuario en el sistema. | ❌ |
| POST | `/api/auth/login` | Autentica un usuario y devuelve un token JWT. | ❌ |
| POST | `/api/auth/reset-password-request` | Envía un correo con un link de recuperación. | ❌ |
| POST | `/api/auth/reset-password/:token` | Establece una nueva contraseña usando el token. | ❌ |

### 🏢 Espacios de Trabajo (Workspaces)
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :---: |
| GET | `/api/workspaces` | Obtiene los espacios donde el usuario es miembro. | ✅ |
| POST | `/api/workspaces` | Crea un nuevo espacio de trabajo. | ✅ |
| GET | `/api/workspaces/:workspace_id` | Obtiene el detalle y miembros de un espacio. | ✅ |
| PUT | `/api/workspaces/:workspace_id` | Actualiza datos del espacio (Admin/Owner). | ✅ |
| POST | `/api/workspaces/:workspace_id/image` | Sube imagen del workspace (Multipart/Form). | ✅ |

### 📢 Canales (Channels)
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :---: |
| GET | `/api/workspaces/:workspace_id/channels` | Lista los canales activos del espacio. | ✅ |
| POST | `/api/workspaces/:workspace_id/channels` | Crea un canal en el espacio indicado. | ✅ |
| PUT | `/api/workspaces/:workspace_id/channels/:channel_id` | Actualiza la información del canal. | ✅ |
| DELETE | `/api/workspaces/:workspace_id/channels/:channel_id` | Archiva un canal (borrado lógico). | ✅ |

### 💬 Mensajes (Messages)
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :---: |
| GET | `.../channels/:channel_id/messages` | Obtiene el historial de mensajes del canal. | ✅ |
| POST | `.../channels/:channel_id/messages` | Envía un nuevo mensaje al canal. | ✅ |
| DELETE | `.../messages/:message_id` | Elimina un mensaje propio. | ✅ |

### 👤 Usuarios (Users)
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :---: |
| GET | `/api/users` | Lista todos los usuarios (solo Admin). | ✅ |
| PUT | `/api/users` | Actualiza el perfil del usuario autenticado. | ✅ |
| POST | `/api/users/profile/image` | Actualiza la foto de perfil en Cloudinary. | ✅ |

---

## ⚠️ Manejo de Errores

El sistema utiliza un middleware global para capturar y estandarizar los errores. Todas las respuestas de error siguen este formato:

```json
{
  "ok": false,
  "status": 403,
  "message": "No tienes permisos para realizar esta acción",
  "data": null
}
```

### Códigos Comunes
*   `400 Bad Request`: Error en los datos enviados (validaciones fallidas).
*   `401 Unauthorized`: Token faltante o inválido.
*   `403 Forbidden`: El usuario no tiene el rol necesario (ej: no es Admin).
*   `404 Not Found`: El recurso solicitado no existe.
*   `500 Internal Server Error`: Error inesperado en el servidor.


---

## 📄 Licencia

Este proyecto se encuentra bajo la Licencia **MIT**. Consulte el archivo [LICENSE](LICENSE) para más detalles.

&copy; 2026 Conecta API - UTN Diplomatura FullStack.
