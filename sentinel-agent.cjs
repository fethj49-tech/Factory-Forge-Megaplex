const WebSocket = require('ws');

class SentinelAgent {
    constructor(config) {
        this.name = config.name || 'Outpost-Sentinel';
        this.factoryBusUrl = config.factoryBusUrl || 'ws://localhost:8080';
        this.sentinelKey = config.sentinelKey || 'default-token';
        this.ws = null;
    }

    connectToFactory() {
        console.log(`[${this.name}]: Connecting to Factory Forge Megaplex bus at ${this.factoryBusUrl}...`);
        this.ws = new WebSocket(this.factoryBusUrl);

        this.ws.on('open', () => {
            console.log(`[${this.name}]: Connected successfully to the factory floor! Authenticating...`);
            this.ws.send(JSON.stringify({
                action: 'SUPER_PIPELINE_BROADCAST',
                payload: {
                    event: 'SENTINEL_HANDSHAKE',
                    name: this.name,
                    key: this.sentinelKey,
                    status: 'OUTPOST_ONLINE',
                    timestamp: new Date().toISOString()
                }
            }));
        });

        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                console.log(`[${this.name} - MSG RECEIVED]:`, message);
            } catch (err) {
                console.error(`[${this.name} - ERROR]: Failed to parse incoming factory transmission.`);
            }
        });

        this.ws.on('close', () => {
            console.log(`[${this.name}]: Connection lost. Reconnecting in 5 seconds...`);
            setTimeout(() => this.connectToFactory(), 5000);
        });

        this.ws.on('error', (err) => {
            console.error(`[${this.name} - SOCKET ERROR]:`, err.message);
        });
    }
}

if (require.main === module) {
    const outpostSentinel = new SentinelAgent({
        name: 'James-Outpost-Sentinel',
        factoryBusUrl: 'ws://localhost:8080',
        sentinelKey: 'techrolim-sentinel-token-2026'
    });
    outpostSentinel.connectToFactory();
}
