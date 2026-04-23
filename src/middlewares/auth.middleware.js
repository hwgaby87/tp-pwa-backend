import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import ServerError from '../helpers/error.helper.js'

function authMiddleware(request, response, next) {
    try {
        //El token se envía en el header de autorización con el formato "Bearer <token>"
        const auth_header = request.headers.authorization
        if (!auth_header) {
            throw new ServerError('Token requerido', 401)
        }

        const auth_header_parts = auth_header.split(' ')
        if (auth_header_parts.length !== 2 || auth_header_parts[0] !== 'Bearer') {
            throw new ServerError('Token ausente o mal formado', 401)
        }

        const auth_token = auth_header_parts[1]
        if (!auth_token) {
            throw new ServerError('Token ausente', 401)
        }

        //Valido el token
        const payload = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)

        //IMPORTANTE!!!, guardo en la request la sesion del usuario
        request.user = payload
        next()
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return response.status(401).json(
                {
                    ok: false,
                    status: 401,
                    message: 'Token inválido'
                }
            )
        }

        if (error instanceof ServerError) {
            return response.status(error.status).json(
                {
                    ok: false,
                    status: error.status,
                    message: error.message
                }
            )
        }
        else {
            console.error('Error inesperado en el registro', error)
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: "Error inesperado en el servidor"
                }
            )
        }
    }

}

export default authMiddleware