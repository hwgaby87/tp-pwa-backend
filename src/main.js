import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongo-db.config.js';
import authRouter from './routes/auth.routes.js';
import workspaceRouter from './routes/workspace.routes.js';
import healthRouter from './routes/health.routes.js';
import userRouter from './routes/user.routes.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/workspaces', workspaceRouter);
app.use('/api/health', healthRouter);
app.use('/api/users', userRouter);

// Ruta no encontrada
app.use((req, res) => {
    console.log(`[404] No route matched for: ${req.method} ${req.path}`);
    res.status(404).json({ ok: false, status: 404, message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use(errorHandlerMiddleware);

// Arranque del servidor
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
});