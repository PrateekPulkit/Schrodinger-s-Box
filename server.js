const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const isWin = os.platform() === 'win32';

// Helper to reliably find uvicorn executable (checks virtualenv first)
const getUvicornCmd = () => {
    const venvUvicorn = isWin 
        ? path.join(__dirname, 'backend', 'venv', 'Scripts', 'uvicorn.exe')
        : path.join(__dirname, 'backend', 'venv', 'bin', 'uvicorn');
        
    if (fs.existsSync(venvUvicorn)) {
        return venvUvicorn;
    }
    // Fallback if they are using a global environment or conda
    return 'uvicorn';
};

console.log("🚀 Starting Schrödinger's Box Military Communications Platform...\n");

// 1. Start Backend (0.0.0.0 exposes it to all IPs on your WiFi)
const uvicornCmd = getUvicornCmd();
console.log(`[BACKEND] Executing: ${uvicornCmd} main:app --reload --host 0.0.0.0 --port 8000`);
const backend = spawn(uvicornCmd, ['main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: false
});

// 2. Start Frontend (--host exposes it to all IPs on your WiFi)
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
console.log(`[FRONTEND] Executing: ${npmCmd} run dev -- --host`);
const frontend = spawn(npmCmd, ['run', 'dev', '--', '--host'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
});

// 3. Graceful shutdown handler
const shutdown = () => {
    console.log("\n🛑 Shutting down systems...");
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

backend.on('error', (err) => console.error('[BACKEND ERROR]', err));
frontend.on('error', (err) => console.error('[FRONTEND ERROR]', err));
