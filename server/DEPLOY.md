# Deploying AutomateEasy to Railway

This guide explains how to deploy the AutomateEasy backend to Railway.

## Prerequisites

1. A Railway account (https://railway.app)
2. Railway CLI installed (optional, for local development)
3. Git installed

## Deployment Steps

### 1. Create a New Project in Railway

1. Log in to your Railway account
2. Create a new project
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select the AutomateEasy repository

### 2. Add a PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Wait for the database to be provisioned

### 3. Configure Environment Variables

1. Go to your service settings (the backend service)
2. Navigate to the "Variables" tab
3. Add the following variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_strong_jwt_secret`
   - `JWT_EXPIRES_IN=15m`
   - `JWT_REFRESH_EXPIRES_IN=7d`
   - `MAKE_API_KEY=your_make_api_key` (if applicable)
   - `LOG_LEVEL=info`

   Note: Railway automatically adds the `DATABASE_URL` variable for your PostgreSQL instance.

### 4. Deploy the Application

1. Railway will automatically deploy your application when you push to your connected GitHub repository
2. You can also manually deploy from the "Deployments" tab

### 5. Verify Deployment

1. After deployment is complete, go to the "Settings" tab
2. Find your service's domain (e.g., `https://automateeasy-production.up.railway.app`)
3. Test the API by accessing the health endpoint: `https://your-domain.up.railway.app/health`

## Post-Deployment Tasks

### Running Database Migrations

Migrations will run automatically on startup thanks to our Procfile, but you can also run them manually:

1. Go to the "Deployments" tab
2. Click on your latest deployment
3. Open the Shell tab
4. Run: `npm run migrate`

### Troubleshooting

If you encounter any issues:

1. Check the logs in the "Deployments" tab
2. Verify your environment variables are set correctly
3. Ensure your database is running and accessible

## Local Development with Railway

You can use the Railway CLI to run your service locally with the same environment:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to your Railway account
railway login

# Link to your project
railway link

# Run your service locally
railway run npm run dev
``` 