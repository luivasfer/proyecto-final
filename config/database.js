const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'proyecto_final',
  username: 'postgres',
  password: 'dondeestas',
});

module.exports = sequelize;