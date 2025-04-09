const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100] // Título entre 1 y 100 caracteres
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  state: {
    type: DataTypes.ENUM('pendiente', 'en_progreso', 'completado'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Task;