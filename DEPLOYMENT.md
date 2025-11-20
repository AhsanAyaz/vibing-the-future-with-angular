# Deployment Guide

This repository deploys both the presentation slides and the Angular WebLLM app to GitHub Pages.

## 🌐 Live URLs

- **Slides**: https://ahsanayaz.github.io/vibing-the-future-with-angular/
- **Angular App**: https://ahsanayaz.github.io/vibing-the-future-with-angular/app/

## 🚀 Automatic Deployment (Recommended)

The repository is configured with GitHub Actions to automatically deploy on every push to the `main` branch.

**How it works:**
1. Push your changes to `main`
2. GitHub Actions workflow (`.github/workflows/deploy.yml`) runs automatically
3. Builds both the slides and Angular app
4. Deploys to GitHub Pages

**To trigger manually:**
1. Go to the repository on GitHub
2. Navigate to **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow**

## 📦 Manual Deployment

If you need to deploy manually from your local machine:

```bash
# Run the deployment script
./scripts/deploy.sh
```

**Prerequisites:**
- Node.js 18+ installed
- npm installed
- Git repository with push access

**What the script does:**
1. Installs dependencies for slides
2. Builds slides (outputs to `dist/reveal-multi-slides-template/`)
3. Installs dependencies for Angular app
4. Builds Angular app (outputs to `angular-webllm-app/dist/angular-webllm-app/browser/`)
5. Combines both into a `deploy/` directory:
   - Slides at root: `deploy/*`
   - App at `/app`: `deploy/app/*`
6. Uses `gh-pages` package to push to `gh-pages` branch

## 🏗️ Build Structure

```
deploy/
├── index.html              # Slides homepage
├── js/                     # Slides JavaScript
├── css/                    # Slides CSS
├── assets/                 # Slides assets
├── ...                     # Other slides files
└── app/                    # Angular app
    ├── index.html          # App entry point
    ├── main-*.js           # App JavaScript bundles
    └── ...                 # Other app files
```

## 🔧 GitHub Pages Settings

Ensure GitHub Pages is configured correctly in your repository:

1. Go to **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` / `(root)`
4. Click **Save**

Alternatively, you can use GitHub Actions deployment (already configured):

1. **Source**: GitHub Actions
2. The workflow will handle deployment automatically

## 🛠️ Local Development

### Slides
```bash
npm install
npm run dev
# Opens at http://localhost:8080
```

### Angular App
```bash
cd angular-webllm-app
npm install
npm start
# Opens at http://localhost:4200
```

## 📝 Notes

- The deployment process builds both projects in production mode
- Large bundle sizes are expected for the Angular app due to Web-LLM dependencies
- First load of the app may take time as it downloads the AI model
- Slides use Reveal.js framework
- Angular app uses standalone components with signals

## 🐛 Troubleshooting

### Deployment fails on GitHub Actions
- Check the **Actions** tab for error logs
- Ensure Node.js version is compatible (20+)
- Verify `package.json` scripts are correct

### Manual deployment fails
- Ensure you have push access to the repository
- Check that all dependencies are installed correctly
- Verify build directories exist after builds

### Site not updating
- Clear browser cache
- Wait a few minutes for GitHub Pages to propagate
- Check GitHub Pages settings are correct
- Verify the `gh-pages` branch has new commits
