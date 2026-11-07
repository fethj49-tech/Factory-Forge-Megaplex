const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const host = req.headers.host || '';
    if (host.includes('locprimegobot.techrolim.internal')) {
        return res.sendFile(path.join(__dirname, 'public', 'locprimegobot.html'));
    }
    next();
});

wss.on('connection', (ws) => {
    console.log('[bus] Client connected to WebSocket universal connector.');
    ws.send(JSON.stringify({ event: 'CONNECTED', message: 'Gobot-1.0 Bus Online' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('[daemon] Factory Forge Megaplex running on port ' + PORT);
});
