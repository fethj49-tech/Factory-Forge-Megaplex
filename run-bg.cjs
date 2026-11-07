const { exec } = require('child_process');
const fs = require('fs');

const scriptName = process.argv[2];
const logName = process.argv[3] || 'megaplex-service.log';

if (!scriptName) {
    console.log('[USAGE]: node run-bg.cjs <script.cjs> [logfile.log]');
    process.exit(1);
}

const cmd = `nohup node ${scriptName} > ${logName} 2>&1 & echo $! > service.pid`;

exec(cmd, (err, stdout, stderr) => {
    if (err) {
        console.error(`[BACKGROUND ERROR]: ${err.message}`);
        return;
    }
    const pid = fs.existsSync('service.pid') ? fs.readFileSync('service.pid', 'utf8').trim() : 'UNKNOWN';
    console.log(`[DAEMON STARTED]: ${scriptName} running in background [PID: ${pid}]`);
    console.log(`[LOGS]: Redirected to ${logName}`);
});
