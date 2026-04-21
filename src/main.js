import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongo-db.config.js';
import authRouter from './routes/auth.routes.js';
import workspaceRouter from './routes/workspace.routes.js';
import healthRouter from './routes/health.routes.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());


// Rutas
app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/health', healthRouter);

app.get('/api/health-check', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando' });
});

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use(errorHandlerMiddleware);

// Arranque
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
});