const config = require('./config');

// Middleware de autenticação por API Key
const authMiddleware = (req, res, next) => {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/health'];
  
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Verificar API Key no header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'API Key necessária',
      message: 'Inclua o header: Authorization: Bearer sua-api-key',
      publicEndpoints: ['GET /', 'GET /health']
    });
  }

  // Extrair a API key do header "Bearer api-key"
  const apiKey = authHeader.replace('Bearer ', '');
  
  if (apiKey !== config.API_KEY) {
    return res.status(403).json({
      error: 'API Key inválida',
      message: 'Verifique sua API Key e tente novamente'
    });
  }

  next();
};

module.exports = authMiddleware;
