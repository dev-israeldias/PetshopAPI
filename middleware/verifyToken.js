const jwt = require('jsonwebtoken');
require('dotenv').config();

// verificacao de token valido
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido. Faça login primeiro.' });
  }

  // filtra o token 
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ erro: 'Formato de token inválido.' });
  }

  const token = partes[1];

  jwt.verify(token, process.env.CHAVESECRETISSIMA, (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
    // Guarda os dados do cliente logado para uso nas próximas etapas da rota
    req.clienteId = decoded.id;
    next();
  });
}

module.exports = verifyToken;
