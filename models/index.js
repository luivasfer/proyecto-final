const sequelize = require('../config/database');
const User = require('./user');
const Task = require('./task');

// Definir relaciones
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Task
};