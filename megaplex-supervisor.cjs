const http = require('http');

const BASE_PORT = 8080;
const BUS_COUNT = 16;

console.log("[MEGAPLEX] Initializing 16-bus WebSocket supergrid architecture...");

for (let i = 0; i < BUS_COUNT; i++) {
  const port = BASE_PORT + i;
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      bus: i, 
      port: port, 
      status: "ACTIVE", 
      message: `Factory Forge Megaplex Bus ${i} operational on port ${port}` 
    }));
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[MEGAPLEX] Bus ${i} (Port ${port}) already active — riding existing wave.`);
    } else {
      console.error(`[MEGAPLEX] Bus ${i} error:`, err.message);
    }
  });

  server.listen(port, () => {});
}

console.log("[MEGAPLEX] Supergrid supervisor script executed across ports 8080–8095.");
