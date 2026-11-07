const http = require('http');
const httpProxy = require('http-proxy');

const GATEWAY_PORT = 3080;
const proxy = httpProxy.createProxyServer({});

const BUS_ROUTES = {
    '/api/build': 'http://localhost:8087',
    '/api/telemetry': 'http://localhost:8081',
    '/api/orchestration': 'http://localhost:8080',
    '/api/assets': 'http://localhost:8083'
};

const server = http.createServer((req, res) => {
    let matchedPort = null;
    
    for (const route in BUS_ROUTES) {
        if (req.url.startsWith(route)) {
            matchedPort = BUS_ROUTES[route];
            break;
        }
    }

    if (matchedPort) {
        proxy.web(req, res, { target: matchedPort }, (err) => {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ERROR', message: `Megaplex Gateway failed to route to supergrid: ${err.message}` }));
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<!DOCTYPE html>
<html>
<head>
    <title>TechroLim Megaplex | External Gateway</title>
    <style>
        body { background: #0b0f19; color: #38ef7d; font-family: monospace; padding: 40px; }
        h1 { color: #11998e; text-transform: uppercase; letter-spacing: 2px; }
        .card { background: rgba(17, 153, 142, 0.1); border: 1px solid #11998e; padding: 20px; border-radius: 8px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>TechroLim Megaplex External Gateway</h1>
    <p>Status: Online & Routing 16-Bus Supergrid Operations</p>
    <div class="card">
        <h3>Active Endpoints:</h3>
        <ul>
            <li>/api/build &rarr; Port 8087 (Dean / APK Build Pipeline)</li>
            <li>/api/telemetry &rarr; Port 8081 (Janus / QA Telemetry)</li>
            <li>/api/orchestration &rarr; Port 8080 (Core Orchestration)</li>
            <li>/api/assets &rarr; Port 8083 (Dion & Anita / Asset Ledger)</li>
        </ul>
    </div>
</body>
</html>`);
    }
});

server.listen(GATEWAY_PORT, () => {
    console.log(`[Megaplex Gateway] Master Gateway active on port ${GATEWAY_PORT}, bridging external requests to 16-Bus Supergrid.`);
});
