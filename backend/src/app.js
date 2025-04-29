const cors = require('cors');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://your-netlify-app.netlify.app',
    credentials: true
}));