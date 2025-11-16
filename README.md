# 🎓 Thesis System

A modern full-stack web application built with Node.js, Express, and React, ready for deployment on Railway.

## 🚀 Features

- **Backend API**: Express.js server with RESTful endpoints
- **Frontend**: React application with modern UI
- **Real-time Status**: Server health monitoring
- **Data Management**: Create and view data items
- **Railway Ready**: Pre-configured for Railway deployment

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

   Or manually:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

## 🏃 Running Locally

### Development Mode (with hot reload)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3000`
- React app on `http://localhost:3001`

### Production Mode

1. Build the React app:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`

## 🚂 Deploying to Railway

### Method 1: Using Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Railway project:**
   ```bash
   railway init
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

### Method 2: Using Railway Dashboard

1. **Go to [Railway.app](https://railway.app)** and sign up/login

2. **Create a New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" (if you've pushed to GitHub)
   - OR select "Empty Project" and connect your GitHub repo

3. **Configure the Project:**
   - Railway will auto-detect Node.js
   - Set the **Root Directory** to the project root
   - Set the **Build Command**: `npm run install-all && npm run build`
   - Set the **Start Command**: `npm start`

4. **Set Environment Variables (if needed):**
   - `NODE_ENV=production`
   - `PORT` (Railway will set this automatically)

5. **Deploy:**
   - Railway will automatically build and deploy your app
   - You'll get a public URL once deployment is complete

## 📁 Project Structure

```
final-system-thesis/
├── server/
│   └── index.js          # Express server
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Styles
│   │   └── index.js      # React entry point
│   └── package.json
├── package.json          # Root package.json
├── railway.json          # Railway configuration
└── README.md
```

## 🔌 API Endpoints

- `GET /api/health` - Check server health status
- `GET /api/data` - Get all data items
- `POST /api/data` - Create a new data item
  ```json
  {
    "title": "Item Title",
    "description": "Item Description"
  }
  ```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
```

For Railway, set these in the Railway dashboard under "Variables".

## 📝 Notes

- The React app is built and served as static files in production
- The server handles both API routes and serves the React app
- Railway automatically provides a public URL after deployment

## 🎨 Customization

Feel free to customize:
- Colors and styling in `client/src/App.css`
- API endpoints in `server/index.js`
- React components in `client/src/App.js`

## 📄 License

ISC

---

Made with ❤️ for your thesis project





