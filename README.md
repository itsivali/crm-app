

# CRM Invoice Manager

A modern, full-stack CRM system for managing clients, services, invoices, and receipts. Built with React, Material UI, Node.js, Express, and MongoDB.

## Features

- 🎨 Modern Material UI interface with dark/light theme
- 👥 Client management
- 🛠️ Service catalog
- 📄 Invoice generation and management
- 💳 Payment tracking and receipts
- 📊 Dashboard with key metrics
- 📧 Automated email notifications
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18
- Material UI 5
- React Router 6
- Axios for API calls

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- SendGrid for emails
- PDFKit for document generation

## Project Structure

```
crm-app/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── api/       # API integration
│   │   ├── components/# Reusable components
│   │   └── pages/     # Main page components
│   └── public/        # Static assets
└── backend/           # Node.js backend
    ├── src/
    │   ├── config/    # Configuration
    │   ├── models/    # Database models
    │   ├── routes/    # API routes
    │   ├── controllers/# Business logic
    │   └── utils/     # Helper functions
    └── migrations/    # Database migrations
```

## Getting Started

1. Clone the repository:
```bash
git clone <https://github.com/itsivali/crm-app>
cd crm-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to .env in both frontend and backend directories
   - Update the variables with your configuration

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

## Environment Variables

### Frontend
```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_USE_MOCKS=false
```

### Backend
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/crm-app
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=your_email@domain.com
```

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create new invoice
- `PATCH /api/invoices/:id/status` - Update invoice status
- `DELETE /api/invoices/:id` - Delete invoice

### Receipts
- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt
- `DELETE /api/receipts/:id` - Delete receipt

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Material UI for the component library
- MongoDB for the database
- SendGrid for email services

