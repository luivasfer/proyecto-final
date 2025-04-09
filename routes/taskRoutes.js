const express = require('express');
const { Task } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Crear una tarea
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, state } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const validStates = ['pendiente', 'en_progreso', 'completado'];
    if (state && !validStates.includes(state)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const task = await Task.create({
      title,
      description,
      state: state || 'pendiente',
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Tarea creada con éxito',
      task: { id: task.id, title: task.title, description: task.description, state: task.state }
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Listar todas las tareas del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (error) {
    console.error('Error al listar tareas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener una tarea específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar una tarea
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, state } = req.body;

  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Regla 3: No se puede modificar una tarea completada
    if (task.state === 'completado') {
      return res.status(403).json({ error: 'No se puede modificar una tarea completada' });
    }

    // Validar el estado si se proporciona
    if (state) {

      console.log('Estado proporcionado:', state);
      const validStates = ['pendiente', 'en_progreso', 'completado'];
      if (!validStates.includes(state)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      // Regla 1: Solo se puede pasar de "pendiente" a "en_progreso"
      
      if (state === 'en_progreso' && task.state !== 'pendiente') {
        return res.status(403).json({ error: 'Solo se puede pasar a "en_progreso" desde "pendiente"' });
      }

      // Regla 2: No se puede volver a "pendiente" desde "en_progreso" o "completado"
      if (state === 'pendiente' && task.state !== 'pendiente') {
        return res.status(403).json({ error: 'No se puede volver a "pendiente" desde otro estado' });
      }
    }

    // Actualizar la tarea
    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      state: state || task.state
    });

    res.json({
      message: 'Tarea actualizada con éxito',
      task: { id: task.id, title: task.title, description: task.description, state: task.state }
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar una tarea
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    await task.destroy();
    res.json({ message: 'Tarea eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;