const { spawn } = require('child_process');
const fs = require('fs');
const WebSocket = require('ws');

if (process.argv[2] !== '--daemonized') {
    const child = spawn(process.execPath, [__filename, '--daemonized'], {
        detached: true,
        stdio: 'ignore'
    });
    child.unref();
    console.log(`[DAEMON LAUNCHED]: Background PID ${child.pid}`);
    process.exit(0);
}

const AGENT_ROSTER = {
    8087: { name: 'Dean', role: 'Build & Code Dispatch' },
    8086: { name: 'Janus', role: 'Telemetry & QA Control' },
    8089: { name: 'Anita', role: 'Secretary Workstation & Ledger' }
};

Object.keys(AGENT_ROSTER).forEach(port => {
    const agent = AGENT_ROSTER[port];
    const wss = new WebSocket.Server({ port: parseInt(port) });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            try {
                const packet = JSON.parse(message);
                ws.send(JSON.stringify({
                    event: 'AGENT_ACKNOWLEDGEMENT',
                    handledBy: agent.name,
                    status: 'SUCCESS',
                    timestamp: new Date().toISOString()
                }));
                fs.appendFileSync('agent-execution.log', `[${new Date().toISOString️}] ${agent.name} handled ${packet.command || 'SYNC'}\n`);
            } catch (err) {
                console.error(`[${agent.name} - ERROR]: Bad packet`);
            }
        });
    });
});
