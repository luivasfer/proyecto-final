const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api'); // Importar el enrutador principal

const app = express();
// Configurar CORS
const allowedOrigins = [
  'http://localhost:5173', // Desarrollo local
  'https://proyecto-final-front-wmdc.onrender.com/api', // Dominio actual del frontend
  
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman) o desde orígenes permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS bloqueado para el origen: ${origin}`);
        callback(new Error(`No permitido por CORS: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Soporte para cookies o autenticación (si es necesario)
  })
);

app.use(express.json());

// Cargar rutas principales
app.use('/api', apiRoutes);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida con éxito');
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

const PORT = process.env.PORT || 3000;
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});