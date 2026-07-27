# Paper Trail — Install as a Real App (PWA Deployment)

Ten minutes, done once. After this, Paper Trail sits in your app drawer with the other apps, opens full-screen with no browser bar, works offline, saves reliably, and self-updates whenever a new engine ships.

## Why a URL is required

Android's app list only holds installed apps, and Chrome only installs web apps served over HTTPS. A file opened from Downloads can never qualify. So the file stops being the thing you carry — the URL becomes home, and the phone installs from it.

## Deploy to GitHub Pages (recommended — zero server changes)

You already push over HTTPS with Git Credential Manager, so this is your normal workflow:

1. Unzip this package into a folder called `paper-trail` (it holds `index.html`, `manifest.webmanifest`, `sw.js`, three icons, and this guide).
2. On github.com, create a new **public** repository named `paper-trail` (no README).
3. In the folder, from PowerShell:
```
git init
git add .
git commit -m "Paper Trail PWA v3.1"
git branch -M main
git remote add origin https://github.com/Kimutaijeremy/paper-trail.git
git push -u origin main
```
(Adjust the username if yours differs.)
4. Repository → **Settings → Pages** → Source: *Deploy from a branch* → `main`, `/ (root)` → Save.
5. After a minute or two the site is live at `https://kimutaijeremy.github.io/paper-trail/`.
6. Open that address in Chrome on your phone → menu (⋮) → **Install app** (Chrome may also show an install banner) → Install. The green tick icon now lives in your app drawer, in Settings → Apps, everywhere a real app lives.

Alternative if you'd rather use your own domain: mount the same five files as static routes on any host you control. Keeping it off the production Mymec API is the cleaner separation, which is why Pages is the recommendation.

## Cutover (standing engineering rule — the installed app is a new origin)

Progress lives per-origin, so the installed app starts empty until you carry it over:

1. In your current copy (the downloaded file): Packs & backups → **Export progress**.
2. In the newly installed app: Packs & backups → **Import progress**.
3. Delete the old home-screen shortcut and the old file in Downloads — one entry point, the real one.
4. Verify from the true starting point: open from the app drawer, run one set, close fully, reopen, confirm the streak held. Airplane mode on, open again — it must load instantly from the service worker cache.
5. Export once more from the installed app: first backup of the new home.

## The update loop (Doctrine D-4 in practice)

When a new engine or pack ships from the desk, you'll receive replacement files with the service worker cache version already bumped. Your entire job:

```
git add .
git commit -m "Engine v3.x"
git push
```

The installed app picks the update up in the background and runs it from the next launch. Your progress is untouched — it lives in the phone's storage, not in the files.

## If anything misbehaves

The Export progress button remains the spine: your entire history in one small JSON you can restore anywhere, any origin, any device.
