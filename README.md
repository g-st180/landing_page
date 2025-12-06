# 7-OH Landing Page

A modern, responsive landing page for 7-OH products with SEO optimization and mobile-first design.

## Features

- Responsive design for all screen sizes
- SEO optimized with proper schema markup
- Modern UI with smooth animations
- Mobile-friendly carousel effects
- Fast loading and optimized performance

## GitHub Pages Setup

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `7oh-landing-page` or `landing-page`)
5. Make it **Public** (required for free GitHub Pages)
6. **Do NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 2: Connect and Push Your Code

Run these commands in your terminal (replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name):

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main if needed
git branch -M main

# Push your code
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait a few minutes for GitHub to build your site
7. Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Local Development

Simply open `index.html` in your browser or use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## File Structure

```
landing_page/
├── index.html          # Main HTML file
├── css/
│   └── styles.css     # All styles
├── js/
│   └── script.js      # JavaScript functionality
├── images/
│   └── hero-background.png  # Hero section background
└── README.md          # This file
```

## Notes

- Make sure all image paths are relative (they already are)
- The site is optimized for GitHub Pages hosting
- All external resources (fonts, images) use HTTPS

