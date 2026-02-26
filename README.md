# University Attendance Tracking System

A professional, high-performance web application for tracking university attendance.

## Features
- **Class Management**: Create and manage university classes.
- **Student Directory**: High-performance virtualized student list.
- **Timetable System**: Define weekly schedules for subjects.
- **Attendance Tracking**: Mark attendance based on the timetable.
- **Reports & Analytics**: Automatic percentage calculation and summary.

## Deployment to GitHub Pages

This app is pre-configured for GitHub Pages. Follow these steps to host it:

### 1. Create a GitHub Repository
Create a new repository on GitHub (e.g., `university-attendance`).

### 2. Initialize Git and Push
In your local terminal (if you've downloaded the code):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. Deploy
Run the deployment script:
```bash
npm run deploy
```
This will build the app and push the `dist` folder to a `gh-pages` branch.

### 4. Configure GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `gh-pages` and `/ (root)`.
4. Click **Save**.

Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

## Local Development
```bash
npm install
npm run dev
```
