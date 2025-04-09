const express = require('express');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

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

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});