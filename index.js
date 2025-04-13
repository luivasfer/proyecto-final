const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api'); // Importar el enrutador principal

const app = express();

// Configurar CORS globalmente
app.use(cors({
  origin: 'http://localhost:5173', // Solo permitir este origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Incluir OPTIONS para preflight
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

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