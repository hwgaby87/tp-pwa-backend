import userRepository from "../repository/user.repository.js";
import authService from "../services/auth.services.js";
import { getSuccessHTML, getErrorHTML } from "../helpers/html-response.helper.js";

class AuthController {
    async register(req, res, next) {

        try {

            const { email, name, password } = req.body;

            await authService.register({ name, email, password })

            return res.status(201).json({
                ok: true,
                status: 201,
                message: "El usuario se ha creado exitosamente",
            });
        }
        catch (error) {
            next(error)
        }
    }


    async login(req, res, next) {
        try {
            const { email, password } = req.body;
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

    async verifyEmail(request, response, next) {
        try {
            const { verify_email_token } = request.query

            await authService.verifyEmail({ verify_email_token })

            const htmlResponse = getSuccessHTML(
                "¡Correo verificado!",
                "Tu correo electrónico ha sido verificado con éxito. Ya puedes cerrar esta pestaña o volver a la aplicación para iniciar sesión."
            );

            response.status(200).send(htmlResponse)
        }
        catch (error) {
            const htmlResponse = getErrorHTML(
                "Error de verificación",
                error.message || "No se pudo verificar tu correo electrónico. Es posible que el enlace haya expirado o sea inválido."
            );
            response.status(error.status || 500).send(htmlResponse)
        }

    }

    async resetPasswordRequest(req, res, next) {
        try {
            const { email } = req.body;
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

    async resetPassword(req, res, next) {
        try {
            const { reset_password_token } = req.params;
            const { password } = req.body;
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

const authController = new AuthController();

export default authController
