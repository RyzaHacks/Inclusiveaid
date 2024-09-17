const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const token = req.url.split('=')[1];
    
    if (!token) {
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.userId = decoded.id;
    } catch (err) {
      ws.close();
      return;
    }

    ws.on('message', (message) => {
      // Handle incoming messages if needed
    });
  });

  return wss;
};