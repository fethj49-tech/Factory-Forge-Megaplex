const fs = require('fs');
const WebSocket = require('ws');

const GUNK_INDEX_DIRECTORY = {
    'WARP_SUB': { bus: 8087, action: 'TRIGGER_SUB_BASS_PROCESS' },
    'TRIP_WARP': { bus: 8086, action: 'INITIATE_TELEMETRY_QA' },
    'GUNK_SYNC': { bus: 8083, action: 'LEDGER_SYNC_ASSETS' },
    'CORE_PULSE': { bus: 8080, action: 'ORCHESTRATION_DISPATCH' }
};

class SheetPowderShield {
    constructor() {
        this.shieldActive = true;
    }

    sanitize(line) {
        if (!this.shieldActive) return { clean: line, shielded: false };
        const trimmed = line.trim();
        if (trimmed.includes('__proto__') || trimmed.includes('eval(') || trimmed.includes('process.')) {
            return { clean: '# SHIELDED_BY_SHEET_POWDER: Neutralized -> ' + trimmed, shielded: true };
        }
        return { clean: line, shielded: false };
    }
}

class GunkParser {
    constructor(indexDirectory) {
        this.directory = indexDirectory;
        this.shield = new SheetPowderShield();
    }

    parseLine(rawLine) {
        const shieldResult = this.shield.sanitize(rawLine);
        const trimmed = shieldResult.clean.trim();

        if (!trimmed || trimmed.startsWith('#')) {
            return {
                status: 'SHIELDED_OR_SKIPPED',
                original: rawLine,
                shielded: shieldResult.shielded,
                timestamp: new Date().toISOString()
            };
        }

        const parts = trimmed.split(/\s+/);
        const command = parts[0];
        const target = parts[1];

        if (this.directory[command]) {
            const route = this.directory[command];
            return {
                status: 'PARSED_SUCCESS',
                command: command,
                targetArg: target || 'DEFAULT',
                dispatchBus: route.bus,
                mappedAction: route.action,
                shielded: shieldResult.shielded,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                status: 'PARSER_ERROR',
                message: 'Unknown Gunk Token: ' + command,
                shielded: shieldResult.shielded
            };
        }
    }

    parseScript(scriptContent) {
        const lines = scriptContent.split('\n');
        const executionLog = [];
        for (const line of lines) {
            const result = this.parseLine(line);
            if (result) executionLog.push(result);
        }
        return executionLog;
    }
}

async function dispatchToSupergrid(parsedResults) {
    console.log('[GUNK PIPELINE]: Dispatching parsed payloads to 16-Bus Supergrid...\n');

    for (const res of parsedResults) {
        if (res.status === 'PARSED_SUCCESS') {
            const wsUrl = `ws://localhost:${res.dispatchBus}`;
            await new Promise((resolve) => {
                const ws = new WebSocket(wsUrl);

                ws.on('open', () => {
                    const payload = {
                        action: 'SUPER_PIPELINE_BROADCAST',
                        source: 'GUNK_PARSER',
                        command: res.command,
                        targetArg: res.targetArg,
                        mappedAction: res.mappedAction,
                        shielded: res.shielded,
                        timestamp: res.timestamp
                    };
                    ws.send(JSON.stringify(payload));
                    console.log(`[DISPATCHED -> Bus ${res.dispatchBus}]: Command '${res.command}' sent successfully.`);
                    ws.close();
                    resolve();
                });

                ws.on('error', (err) => {
                    console.log(`[DISPATCH ERROR -> Bus ${res.dispatchBus}]: Could not connect (Is bus active?).`);
                    resolve();
                });
            });
        } else {
            console.log(`[SKIPPED/SHIELDED]: Line status -> ${res.status}`);
        }
    }
}

async function run() {
    const parser = new GunkParser(GUNK_INDEX_DIRECTORY);
    const sampleGunkScript = `
        # Gunk Supergrid Automation Sequence
        WARP_SUB sub_bass_profile_9
        eval('exploit_test')
        TRIP_WARP qa_telemetry_check
        CORE_PULSE dean_orchestrate
    `;

    const results = parser.parseScript(sampleGunkScript);
    console.log('[GUNK PARSER OUTPUT]:', JSON.stringify(results, null, 2), '\n');
    await dispatchToSupergrid(results);
}

run();
