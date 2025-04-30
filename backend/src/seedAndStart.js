const { spawn } = require('child_process');
const path = require('path');
const { startServer } = require('./server');

async function seedAndStart() {
    try {
        // Run seed script
        const seedProcess = spawn('node', [path.join(__dirname, 'seed.js')], {
            stdio: 'inherit'
        });

        // Wait for seed script to complete
        await new Promise((resolve, reject) => {
            seedProcess.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Seed process exited with code ${code}`));
                }
            });
        });

        // Start the server
        await startServer();

    } catch (error) {
        console.error('Error during startup:', error);
        process.exit(1);
    }
}

seedAndStart();