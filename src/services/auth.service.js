import jwt from 'jsonwebtoken'
import ENVIRONMENT from "../config/environment.config.js";
import mailerTransporter from "../config/mailer.config.js";
import ServerError from "../helpers/error.helper.js";
import userRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import getEmailTemplate from "../helpers/email-template.helper.js";

/**
 * AuthService
 * La capa de "Servicios" es donde reside la "lógica de negocio" de la aplicación.
 * A diferencia del controlador, que solo maneja peticiones y respuestas HTTP, 
 * el servicio realiza el trabajo pesado: validaciones, encriptación, y llamadas 
 * a la base de datos (a través de los repositorios).
 */
class AuthService {

    /**
     * Registra a un nuevo usuario.
     * @param {Object} param0 - Datos del usuario (nombre, email, contraseña).
     */
    async register({ name, email, password }) {
        // 1. Verificamos que todos los campos requeridos estén presentes
        if (!name || !email || !password) {
            throw new ServerError("Email, nombre de usuario y contraseña son obligatorios", 400);
        }

        // 2. Buscamos en la base de datos si el email ya existe
        const userByEmail = await userRepository.getByEmail(email);
        if (userByEmail) {
            throw new ServerError('El email ya está en uso', 400)
        }

        // 3. Buscamos en la base de datos si el nombre de usuario ya existe
        const userByUsername = await userRepository.getByUsername(name);
        if (userByUsername) {
            throw new ServerError('El nombre de usuario ya está en uso', 400)
        }

        // 4. Encriptamos la contraseña usando bcrypt antes de guardarla (muy importante por seguridad)
        const passwordHashed = await bcrypt.hash(password, 12)
        
        // 5. Creamos y guardamos el usuario en la base de datos a través del repositorio
        const userCreated = await userRepository.create(name, email, passwordHashed);
        
        // 6. Enviamos un correo de verificación al nuevo usuario
        await this.sendVerifyEmail({ email, name })
    }

    /**
     * Verifica la cuenta del usuario a través de un token enviado a su correo.
     */
    async verifyEmail({ verify_email_token }) {
        if (!verify_email_token) {
            throw new ServerError('El token no se ha proporcionado', 400)
        }

        // Método de verificación de JWT (JSON Web Token). Este método verifica la firma del token.
        // Si el token es válido y no expiró, devuelve su contenido (payload: email y name).
        // Si no es válido o expiró, lanza un error que atrapamos en el bloque catch.
        try {
            const { email, name } = jwt.verify(verify_email_token, ENVIRONMENT.JWT_SECRET_KEY)
            
            // Buscamos al usuario en la base de datos
            const user = await userRepository.getByEmail(email)
            if (!user) {
                throw new ServerError('El usuario no existe', 404)
            }
            else if (user.email_verified) {
                throw new ServerError('El email del usuario ya ha sido validado', 400)
            }
            else {
                // Actualizamos el estado de verificación del usuario en la base de datos
                const user_updated = await userRepository.updateById(
                    user._id,
                    { email_verified: true }
                )
                if (!user_updated.email_verified) {
                    throw new ServerError('El usuario no se pudo actualizar', 400)
                }
                else {
                    return user_updated
                }
            }
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                // Si el token expiró, lo decodificamos (sin verificar la firma temporal) 
                // para saber el email del usuario y poder enviarle otro correo nuevo
                const { email, name } = jwt.decode(verify_email_token)
                
                // Enviar otro mail de verificación automáticamente
                await this.sendVerifyEmail({ email, name })
                throw new ServerError('El token de verificación expiró. Se ha enviado uno nuevo a tu correo.', 401)
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError('Token inválido', 401)
            }
            else {
                throw error
            }
        }
    }

    /**
     * Genera un token JWT para un usuario.
     * @param {Object} user - El objeto usuario de la base de datos.
     * @returns {string} Token JWT.
     */
    generateToken(user) {
        return jwt.sign(
            {
                email: user.email,
                name: user.name,
                id: user._id,
                image: user.image || '',
                created_at: user.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY
        );
    }

    /**
     * Autentica al usuario verificando su email y contraseña.
     */
    async login({ email, password }) {
        // Buscamos al usuario
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Usuario no encontrado', 404);
        }

        // El usuario no puede iniciar sesión si no ha verificado su cuenta de correo
        if (!user.email_verified) {
            throw new ServerError('Usuario no verificado', 401);
        }

        // Comparamos la contraseña en texto plano enviada por el usuario con el "hash" seguro en la base de datos
        const is_same_password = await bcrypt.compare(password, user.password)
        if (!is_same_password) {
            throw new ServerError('Contraseña incorrecta', 401);
        }

        // Si todo es correcto, generamos un token JWT de autorización (auth_token)
        return this.generateToken(user);
    }


    /**
     * Envía el correo electrónico de verificación.
     */
    async sendVerifyEmail({ email, name }) {
        // Se crea un token firmado por el backend válido por 7 días
        const verify_email_token = jwt.sign(
            { email: email, name: name },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        // Se utiliza la librería nodemailer (mailerTransporter) para enviar el correo real
        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: `Bienvenido ${name} verifica tu correo electrónico`,
            html: getEmailTemplate(`
                <div class="content-block">
                    <h2>¡Bienvenido, ${name}!</h2>
                    <p>Te has registrado correctamente en <strong>Conecta</strong>. Para completar tu registro y asegurar tu cuenta, necesitamos verificar tu correo electrónico.</p>
                </div>
                <div class="content-block text-center">
                    <a href="${ENVIRONMENT.URL_BACKEND + `/api/auth/verify-email?verify_email_token=${verify_email_token}`}" class="btn btn-primary">Verificar mi correo</a>
                </div>
                <div class="content-block" style="margin-top: 20px; font-size: 13px; color: #64748b;">
                    <span>Si no reconoces este registro, puedes desestimar este correo con seguridad.</span>
                </div>
            `, 'Verificación de correo')
        })
    }

    /**
     * Solicita el restablecimiento de contraseña enviando un correo al usuario.
     */
    async resetPasswordRequest({ email }) {
        if (!email) {
            throw new ServerError("El email es obligatorio", 400)
        }
        try {
            const user = await userRepository.getByEmail(email);
            if (!user) {
                throw new ServerError("El usuario no existe", 404)
            }

            // Generamos un token temporal solo válido por 1 día
            const reset_password_token = jwt.sign(
                { email },
                ENVIRONMENT.JWT_SECRET_KEY,
                { expiresIn: "1d" }
            )

            await mailerTransporter.sendMail({
                from: ENVIRONMENT.MAIL_USER,
                to: email,
                subject: "Restablecimiento de contraseña",
                html: getEmailTemplate(`
                    <div class="content-block">
                        <h2>Restablecimiento de contraseña</h2>
                        <p>Has solicitado restablecer tu contraseña para tu cuenta en <strong>Conecta</strong>.</p>
                        <p>Haz clic en el siguiente botón para elegir una nueva contraseña:</p>
                    </div>
                    <div class="content-block text-center">
                        <a href="${ENVIRONMENT.URL_FRONTEND + `/reset-password/${reset_password_token}`}" class="btn btn-primary">Restablecer contraseña</a>
                    </div>
                    <div class="content-block" style="margin-top: 20px; font-size: 13px; color: #64748b;">
                        <span>Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña actual no cambiará.</span>
                    </div>
                `, 'Restablecimiento de contraseña')
            })
        } catch (error) {
            if (error instanceof ServerError) {
                throw error
            }
            else {
                throw new ServerError("Error al solicitar el restablecimiento de contraseña", 500)
            }
        }
    }

    /**
     * Actualiza la contraseña en la base de datos tras verificar el token de reseteo.
     */
    async resetPassword({ reset_password_token, password }) {
        if (!reset_password_token || !password) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }
        try {
            // Verificamos si el token de restablecimiento es válido
            const { email } = jwt.verify(reset_password_token, ENVIRONMENT.JWT_SECRET_KEY);
            
            const user = await userRepository.getByEmail(email);
            if (!user) {
                throw new ServerError("El usuario no existe", 404)
            }
            
            // Encriptamos la nueva contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(password, 12);
            await userRepository.updateById(user._id, { password: hashedPassword });

        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError("Token de restablecimiento de contraseña inválido", 400)
            }
            else if (error instanceof jwt.TokenExpiredError) {
                throw new ServerError("Token de restablecimiento de contraseña expirado", 400)
            }
            throw error
        }
    }
}

const authService = new AuthService()

export default authService