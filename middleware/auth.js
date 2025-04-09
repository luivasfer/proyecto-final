const jwt = require('jsonwebtoken');

// Clave secreta para verificar el token (en producción, usa una variable de entorno)
const JWT_SECRET = 'tu_clave_secreta_aqui';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user; // Añade los datos del usuario al request
    next();
  });
};

module.exports = authenticateToken;