/**
 * Middleware para el manejo centralizado de errores.
 * Atrapa los errores que ocurren en otras partes de la aplicación (rutas o controladores)
 * y devuelve una respuesta estructurada al cliente.
 * 
 * @param {Error} error - El error que fue lanzado.
 * @param {Object} request - Objeto que representa la petición HTTP.
 * @param {Object} response - Objeto que representa la respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware (no se usa aquí porque es el final de la cadena).
 */
function errorHandlerMiddleware(error, request, response, next) {
    // Registramos el error en la consola para poder debuggearlo internamente
    console.error("Error capturado por middleware:", error)

    // Verifica si el error es de autenticación debido a un token JWT mal formado o adulterado
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            ok: false,
            status: 401,
            message: "Token inválido"
        });
    }

    // Verifica si el error es porque el token JWT expiró por tiempo
    if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            ok: false,
            status: 401,
            message: "Token expirado"
        });
    }

    // Si el error tiene una propiedad 'status' definida, asumimos que es un error controlado (como un 400 o 404 personalizado)
    if (error.status) {
        return response.status(error.status).json({
            ok: false,
            status: error.status,
            message: error.message
        });
    }

    // Si no cae en ninguno de los casos anteriores, es un error inesperado. Devolvemos 500 (Internal Server Error)
    return response.status(500).json({
        ok: false,
        status: 500,
        message: "Error interno del servidor"
    });
}

export default errorHandlerMiddleware