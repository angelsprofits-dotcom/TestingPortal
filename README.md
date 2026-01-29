# Yacht Portal - Luxury Charter Management

A premium yacht charter proposal management system with elegant design.

## Project Structure

```
yacht-portal/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── index.css
└── .gitignore
```

## Deployment to Vercel

### Step 1: Update Your GitHub Repository

Make sure your repository has this exact structure:

1. All files should be in the root directory
2. `src/App.jsx` contains the yacht portal component
3. `src/main.jsx` is the React entry point
4. `index.html` is at the root

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Add complete project structure for Vercel deployment"
git push origin main
```

### Step 3: Configure Vercel

1. Go to your Vercel dashboard
2. Import your GitHub repository
3. Vercel should auto-detect it as a Vite project
4. If not, manually set:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 4: Deploy

Click "Deploy" and Vercel will build your app!

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- ✨ Luxury design with Playfair Display serif typography
- 📊 Dashboard with proposal management
- 🚤 Yacht catalog with photo slideshows
- 💰 Automatic VAT & APA calculations
- 📅 Availability date management
- 🎨 Status badges (Available, To Be Confirmed, Not Available)
- 📱 Responsive design
- 🔒 Client-specific public proposal views

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React Icons
