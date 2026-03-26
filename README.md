# Sri Rama Priyan Portfolio (Flask + SQLite)

Single-page portfolio website with:
- Frontend: `index.html`, `style.css`, `script.js`
- Backend: Flask API in `server.py`
- Database: SQLite (`portfolio.db`) used for contact form submissions

## Local Run

```bash
cd "/Users/sriram/Desktop/final pro"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

Open:
- `http://localhost:5000`
- `http://localhost:5000/admin`

## Deploy on Render

This repo includes `render.yaml`, so you can deploy using **Blueprint**.

### 1) Push to GitHub

```bash
cd "/Users/sriram/Desktop/final pro"
git init
git add .
git commit -m "Initial portfolio site with Flask backend and Render config"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### 2) Create Render service

1. Login to Render
2. New + -> Blueprint
3. Connect your GitHub repo
4. Select this repository and deploy

Render will:
- install dependencies from `requirements.txt`
- start with `gunicorn server:app`
- create a persistent disk mounted at `/var/data`
- store SQLite DB at `/var/data/portfolio.db` (via `DB_PATH`)

## Notes

- In local, DB path defaults to project `portfolio.db`.
- In Render, DB path uses persistent disk so contact messages survive restarts/deploys.
- If Render free plan sleeps, first request may take a few seconds to wake up.

# portfolio
