import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongo-db.config.js';
import authRouter from './routes/auth.route.js';
import workspaceRouter from './routes/workspace.route.js';
import healthRouter from './routes/health.route.js';
import userRouter from './routes/user.route.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

// Carga las variables de entorno desde el archivo .env para que estén disponibles en process.env
dotenv.config();

// Crea la aplicación principal de Express
const app = express();

// ==========================================
// Middlewares globales (se ejecutan en todas las peticiones)
// ==========================================

// CORS permite que el frontend (que puede estar en otro dominio o puerto) se comunique con este backend
app.use(cors({
    origin: process.env.URL_FRONTEND,
    credentials: true
}));

// Permite a la aplicación entender los datos enviados en formato JSON en el cuerpo (body) de las peticiones
app.use(express.json());

// Middleware para registrar (loguear) todas las peticiones entrantes en la consola
// Muy útil para saber qué rutas se están consultando y con qué método (GET, POST, etc.)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next(); // Pasa el control al siguiente middleware o ruta
});

// ==========================================
// Definición de Rutas (Endpoints)
// ==========================================

// Ruta raíz para verificar que la API está en línea y evitar errores 404 en los logs de Vercel
app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Bienvenido a la API de CONECTA',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Manejo de favicon para evitar ruidos en los logs
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Todas las peticiones que empiecen con '/api/auth' serán manejadas por authRouter
app.use('/api/auth', authRouter);

// Todas las peticiones que empiecen con '/api/workspaces' serán manejadas por workspaceRouter
app.use('/api/workspaces', workspaceRouter);

// Ruta para verificar que el servidor está funcionando (Health check)
app.use('/api/health', healthRouter);

// Rutas relacionadas a la gestión de usuarios
app.use('/api/users', userRouter);

// ==========================================
// Manejo de Rutas No Encontradas (404)
// ==========================================

// Si la petición no coincidió con ninguna de las rutas anteriores, caerá aquí
app.use((req, res) => {
    console.log(`[404] Ruta no encontrada para: ${req.method} ${req.path}`);
    res.status(404).json({ ok: false, status: 404, message: 'Ruta no encontrada' });
});

// ==========================================
// Middleware Global de Manejo de Errores
// ==========================================

// Captura cualquier error lanzado en las rutas o middlewares anteriores
app.use(errorHandlerMiddleware);

// ==========================================
// Arranque del Servidor y Conexión a Base de Datos
// ==========================================

// Conectamos a la DB al iniciar (sin bloquear el export)
connectDB().catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});

// En entorno local, levantamos el servidor normalmente
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
}

// Vercel necesita el export default para manejar las requests
export default app;