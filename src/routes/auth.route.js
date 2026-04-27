import express from 'express'
import authController from '../controllers/auth.controller.js'

// express.Router() nos permite crear un conjunto de rutas modular y montable
// que luego conectaremos en main.js (ej: app.use('/api/auth', authRouter))
const authRouter = express.Router()

// Ruta simple de prueba para verificar que el enrutador funciona
authRouter.get('/test', (req, res) => res.json({ok: true}))

// ==========================================
// Rutas de Autenticación
// ==========================================

// Ruta POST para registrar un nuevo usuario.
// Cuando el cliente hace una petición POST a '/api/auth/register',
// Express llama al método 'register' del 'authController'.
authRouter.post(
    '/register',
    authController.register
)

// Ruta POST para iniciar sesión (Login).
authRouter.post(
    '/login',
    authController.login
)

// Ruta GET para verificar el email.
// Se usa GET porque normalmente el usuario hace clic en un enlace desde su correo electrónico.
authRouter.get(
    '/verify-email',
    authController.verifyEmail
)

// Ruta POST para solicitar el reseteo de contraseña (se envía un correo).
authRouter.post(
    '/reset-password-request',
    authController.resetPasswordRequest
)

// Ruta POST para establecer una nueva contraseña usando el token.
// ':reset_password_token' es un parámetro dinámico en la URL (req.params).
authRouter.post(
    '/reset-password/:reset_password_token',
    authController.resetPassword
)

export default authRouter
