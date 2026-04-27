import userRepository from "../repositories/user.repository.js";
import authService from "../services/auth.service.js";
import { getSuccessHTML, getErrorHTML } from "../helpers/html-response.helper.js";

/**
 * AuthController
 * Los controladores se encargan de manejar las peticiones HTTP que llegan al servidor.
 * Extraen los datos de la petición (req.body, req.params, req.query), se los pasan
 * a la capa de Servicios (authService) que contiene la lógica de negocio, y finalmente
 * devuelven una respuesta (res) al cliente.
 */
class AuthController {
    
    /**
     * Maneja la petición para registrar un nuevo usuario.
     */
    async register(req, res, next) {
        try {
            // Se extraen los datos enviados por el cliente en el cuerpo de la petición (body)
            const { email, name, password } = req.body;

            // Se delega la lógica de negocio (crear usuario, encriptar contraseña) al servicio
            await authService.register({ name, email, password })

            // Si todo salió bien, devolvemos un estado 201 (Created) con un mensaje de éxito
            return res.status(201).json({
                ok: true,
                status: 201,
                message: "El usuario se ha creado exitosamente",
            });
        }
        catch (error) {
            // Si ocurre un error, 'next' se lo pasa al middleware manejador de errores global
            next(error)
        }
    }


    /**
     * Maneja la petición de inicio de sesión (login).
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            // El servicio verifica las credenciales y, si son correctas, devuelve un token
            const auth_token = await authService.login({ email, password })
            
            return res.status(200).json({
                message: "Inicio de sesión exitoso",
                status: 200,
                ok: true,
                data: {
                    auth_token: auth_token
                }
            });
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Maneja la petición que llega cuando el usuario hace clic en el enlace de 
     * verificación enviado a su correo electrónico.
     */
    async verifyEmail(request, response, next) {
        try {
            // En este caso el token viene en la URL (query params)
            const { verify_email_token } = request.query

            // El servicio se encarga de marcar al usuario como verificado
            await authService.verifyEmail({ verify_email_token })

            // En vez de JSON, aquí se devuelve un documento HTML para que 
            // el usuario lo vea en su navegador web
            const htmlResponse = getSuccessHTML(
                "¡Correo verificado!",
                "Tu correo electrónico ha sido verificado con éxito. Ya puedes cerrar esta pestaña o volver a la aplicación para iniciar sesión."
            );

            response.status(200).send(htmlResponse)
        }
        catch (error) {
            // Si el token es inválido o expiró, mostramos un HTML de error
            const htmlResponse = getErrorHTML(
                "Error de verificación",
                error.message || "No se pudo verificar tu correo electrónico. Es posible que el enlace haya expirado o sea inválido."
            );
            response.status(error.status || 500).send(htmlResponse)
        }

    }

    /**
     * Maneja la petición para solicitar la recuperación de contraseña.
     */
    async resetPasswordRequest(req, res, next) {
        try {
            const { email } = req.body;
            
            // Se invoca el servicio que buscará al usuario y enviará el email
            await authService.resetPasswordRequest({ email });
            
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Se ha enviado un correo electrónico para restablecer la contraseña",
            });
        } catch (error) {
            next(error)
        }
    }

    /**
     * Maneja la petición para actualizar la contraseña con un token de reseteo.
     */
    async resetPassword(req, res, next) {
        try {
            // El token de reseteo viene en los parámetros de la URL (params)
            const { reset_password_token } = req.params;
            const { password } = req.body;
            
            // El servicio verifica el token y actualiza la contraseña
            await authService.resetPassword({ reset_password_token, password });
            
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "La contraseña se ha restablecido exitosamente",
            });
        } catch (error) {
            next(error)
        }
    }


}

// Exportamos una única instancia del controlador (Patrón Singleton)
const authController = new AuthController();
export default authController
