const { spawn } = require('child_process');
const path = require('path');
const server = require('./server');
const connectDB = require('./config/db');

async function seedAndStart() {
    try {
        // Connect to database
        await connectDB();

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
        const port = process.env.PORT || 4000;
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {
        console.error('Error during startup:', error);
        process.exit(1);
    }
}

seedAndStart();