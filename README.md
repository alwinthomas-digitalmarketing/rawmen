# Creative Review

A simple web app for the digital marketing team to review creatives shared by the media team.

## Features
- Card per creative: image, number, title, description, status, edit button, updated date
- Edit image (click or drag and drop), title, description, client and status
- Add notes to each creative
- Status: Pending, Approved, Correction, Rejected
- Clients: add clients, filter by client, client name shown on each card
- Counts: total and per status, plus a count per month (click a month to filter)
- Copy buttons for title and description
- Glassmorphism design with automatic light and dark mode

## Files
- `index.html` page structure
- `styles.css` styling
- `script.js` all app logic
- `vercel.json` Vercel settings

## Deploy to Vercel
1. Upload all files to a GitHub repository (keep them in the root, not inside a folder).
2. In Vercel choose **Add New > Project** and import the repository.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty.
4. Click **Deploy**.

## Note
Data is stored in each person's browser (localStorage), so it is not shared between users or devices. For shared team data and admin login, a backend such as Supabase or Firebase is needed.
