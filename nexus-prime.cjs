const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8097;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'Nexus-Prime Core Active', timestamp: Date.now() }));
});

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('[Nexus-Prime] Core connection established.');
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      ws.send(JSON.stringify({ agent: 'Nexus-Prime', status: 'synchronized', echo: data, time: Date.now() }));
    } catch (e) {
      console.error('[Nexus-Prime] Error parsing payload:', e.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[Nexus-Prime] Core server listening on port ${PORT}`);
});
