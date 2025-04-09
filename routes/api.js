const express = require('express');
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

// Rutas de usuarios (sin prefijo adicional)
router.use('/', userRoutes);

// Rutas de tareas (prefijadas con /tasks)
router.use('/tasks', taskRoutes);

module.exports = router;