const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8084;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'Gobot-1.0 Active', timestamp: Date.now() }));
});

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('[Gobot-1.0] Sentinel connection established.');
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      ws.send(JSON.stringify({ agent: 'Gobot-1.0', status: 'acknowledged', echo: data, time: Date.now() }));
    } catch (e) {
      console.error('[Gobot-1.0] Error parsing frame:', e.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[Gobot-1.0] Sentinel server listening on port ${PORT}`);
});
