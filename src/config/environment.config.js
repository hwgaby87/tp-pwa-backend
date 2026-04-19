import dotenv from 'dotenv'; // Importa la biblioteca dotenv para cargar las variables de entorno desde un archivo .env

dotenv.config(); // Carga las variables de entorno desde el archivo .env ubicado en la raíz del proyecto

const ENVIRONMENT = {
    // Accede a la variable de entorno MONGO_DB_CONECTION_STRING que se ha cargado desde el archivo .env
    MONGO_DB_CONECTION_STRING: process.env.MONGO_DB_CONECTION_STRING,
    PORT: process.env.PORT,
    MAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    MAIL_USER: process.env.EMAIL_USER,
    URL_BACKEND: process.env.URL_BACKEND,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    URL_FRONTEND: process.env.URL_FRONTEND
}

export default ENVIRONMENT;