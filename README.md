# Agri Card Studio — GitHub Pages ready

A static browser-based demo for previewing a personal farmer information card and exporting two layouts on one landscape A4 PDF.

## Important use limitation
This project does **not** issue, verify, or reproduce an official government Farmer ID. The QR code contains only the name and ID typed into the form and is not an official verification QR. Use accurate information only with the farmer's permission. Do not present the generated PDF as a government-issued document.

## Run locally
1. Extract this ZIP.
2. Open `index.html` in a modern browser. An internet connection is needed for the PDF and QR libraries loaded from CDNs.

## Publish on GitHub Pages (free)
1. Sign in to GitHub and create a new public repository, for example `farmer-card-studio`.
2. Extract this ZIP on your phone or computer.
3. Open the `farmer-card-github-pages` folder and upload **the contents of that folder** (`index.html`, `style.css`, `app.js`, `README.md`) to the repository's root. Do not upload the ZIP itself or leave the files nested in another folder.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose branch `main` and folder `/(root)`, then click **Save**.
7. Wait for the published website URL shown on the Pages settings screen.

## How to use
1. Open the published site.
2. Enter the farmer's accurate details from an authorized/official record.
3. Add a photo if appropriate.
4. Review both cards and click **A4 PDF डाउनलोड करें**.
5. The browser downloads `farmer-card-demo.pdf`.

## Technical notes
- Static HTML/CSS/JavaScript; no database or server-side storage.
- PDF and QR libraries are loaded from CDNs, so internet access is needed for those features.
- User data is processed in the browser and is not sent to a backend by this project.
- This is a demo and does not connect to any government Farmer Registry API.
\n\nAadhaar privacy: Aadhaar is optional, validated as 12 digits when entered, masked to its last four digits in the preview/PDF, and excluded from the QR code. All form processing happens in the browser. This is a personal farmer profile card, not a government-issued identity document.\n