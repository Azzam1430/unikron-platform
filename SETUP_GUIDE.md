# Unikron Platform Setup Guide

## 1. Environment Variables
Since I cannot write to `.env` files directly due to security restrictions, please create a file named `.env.local` in this directory and add your API keys:

```env
# Nano Banana API Key (Image Generation)
NANO_BANANA_API_KEY=your_key

# Stripe Keys (Payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Gemini API Key (Admin Intelligence)
GEMINI_API_KEY=your_key

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 2. Deployment to GitHub
To push this project to your own GitHub:
1. Create a new repository on GitHub.
2. Run the following commands:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## 3. Production Deployment
The fastest way to deploy is using **Vercel**:
1. Go to [vercel.com](https://vercel.com).
2. Import your GitHub repository.
3. Add the environment variables in the settings.
4. Click **Deploy**.

## 4. Features Overviews
- **Design Studio**: Drag & drop floor plans.
- **Pricing Engine**: Dynamic calculations for add-ons and complexity.
- **Admin**: AI-driven trend logs at `/admin`.
