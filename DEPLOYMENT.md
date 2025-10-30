# Deploying Martian Math to Railway

## Prerequisites
- Railway account ([Sign up here](https://railway.app))
- OpenAI API key

## Deployment Steps

### 1. Create a New Project on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `martian_math` repository
5. Click "Deploy Now"

### 2. Configure Environment Variables

In your Railway project dashboard:

1. Go to the "Variables" tab
2. Add the following environment variable:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key (starts with `sk-proj-...`)
3. Click "Add Variable"

Railway will automatically set the `PORT` variable.

### 3. Deploy

Railway will automatically:
- Install dependencies (`npm install`)
- Start the server (`node server.js`)
- Assign a public URL (e.g., `https://your-app.up.railway.app`)

### 4. Access Your App

Once deployed (takes 1-2 minutes), click the generated URL to access your game!

## What Gets Deployed

- ✅ Frontend (HTML/CSS/JS)
- ✅ Backend API (Express server)
- ✅ R.A.L.F. AI integration
- ✅ Static file serving
- ❌ `.env` file (excluded, use Railway's environment variables)
- ❌ `node_modules` (rebuilt on Railway)

## Updating Your Deployment

After pushing changes to GitHub:

```bash
git add .
git commit -m "Your update message"
git push
```

Railway will automatically detect the changes and redeploy.

## Troubleshooting

### Server won't start
- Check that `OPENAI_API_KEY` is set in Railway's Variables tab
- View logs in Railway dashboard for error details

### API calls failing
- Make sure CORS is properly configured (already done in server.js)
- Check Railway logs for API errors

### OpenAI quota exceeded
- Check your OpenAI account billing/usage
- Consider adding rate limiting if needed

## Cost Estimate

- **Railway:** Free tier includes 500 hours/month (enough for development)
- **OpenAI:** Pay-per-use (~$0.002 per conversation with GPT-4o-mini)

## Custom Domain (Optional)

1. Go to "Settings" in Railway dashboard
2. Click "Generate Domain" or add your custom domain
3. Update DNS settings as instructed

## Monitoring

View real-time logs in Railway dashboard:
- Click on your service
- Go to "Logs" tab
- Monitor API calls, errors, and performance

