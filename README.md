# Agri Card Studio — GitHub Pages

A browser-based Farmer Card layout preview and A4 PDF generator. The page places two card layouts side-by-side on one landscape A4 PDF.

## Important use limitation
This project does **not** issue, verify, or reproduce an official government Farmer ID. The QR code contains only the name and ID typed into the form and is not an official verification QR. Use accurate information only with the farmer's permission. Do not present the generated PDF as a government-issued document.

## Publish on GitHub Pages (free)
1. Sign in to GitHub and create a new **public** repository, for example `farmer-card-studio`.
2. Extract this ZIP on your computer.
3. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then click **Save**.
7. Wait for the published URL shown in the Pages section.

## How to use
1. Open the published site.
2. Fill in the farmer's accurate details from an authorized/official record.
3. Add a photo if appropriate.
4. Review both cards and click **A4 PDF डाउनलोड करें**.
5. The browser downloads `farmer-card-demo.pdf`.

## Technical notes
- Static HTML/CSS/JavaScript; no database or server-side storage.
- PDF and QR libraries are loaded from CDNs, so internet access is needed.
- User data is processed in the browser and is not sent to a backend by this project.
- This is a starter version. It does not connect to any government Farmer Registry API.
