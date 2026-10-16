# A Little Wedding Mischief

A static, mobile-first prank wedding wish site built with plain HTML, CSS, and vanilla JavaScript. It has no framework, backend, external images, or Google Font dependency.

## Run locally

1. Open this folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Open the local URL shown by VS Code. A local server is needed because the browser blocks `fetch('wishes.json')` from a `file://` URL.

## Edit wishes

Open `wishes.json` and edit the array. Each object represents one friend:

```json
{
  "id": "ravi",
  "name": "Ravi",
  "dodge": true,
  "dodgeSeconds": 7,
  "message": "Wishing you a lifetime of love!",
  "noMessage": "Come on, you know you want to know 😄"
}
```

- `id` is used by the optional URL filter.
- `name` is revealed after the YES button is caught.
- Set `dodge` to `true` to make YES dodge; `dodgeSeconds` defaults to 7 when omitted.
- `message` is the revealed wish.
- `noMessage` appears when NO is tapped.

To show one person's wish, append `?id=ravi` to the page URL. IDs and names are matched case-insensitively. If there is no match, the full list is shown.

## Convert an Excel file

The optional `convert-excel.js` script uses the `xlsx` npm package. Your spreadsheet should have these columns: `id`, `name`, `dodge`, `dodgeSeconds`, `message`, `noMessage`.

```bash
npm install xlsx
node convert-excel.js friends.xlsx wishes.json
```

The script accepts `.xlsx` or `.xls`, converts the first worksheet, and writes formatted JSON. Boolean values may be entered as `true`, `false`, `yes`, or `no`.

## Deploy

### GitHub Pages

1. Create a new GitHub repository and upload `index.html`, `style.css`, `script.js`, `wishes.json`, and `README.md`.
2. Open the repository **Settings**, then **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the default branch and the `/ (root)` folder, then click **Save**.
5. Wait for the workflow to finish. GitHub will display the public Pages URL in the same screen.

### Netlify

1. Sign in at Netlify and choose **Add new site** > **Import an existing project** for a Git repository, or use **Deploy manually**.
2. For a Git repository, select the repository containing these files.
3. Leave the build command empty and set the publish directory to the project root (`.`).
4. Deploy. Netlify will provide a preview URL and lets you choose a custom site name.

### Cloudflare Pages

1. Sign in to Cloudflare and open **Workers & Pages** > **Create application** > **Pages**.
2. Connect the Git repository containing these files.
3. Choose **None** for the framework preset, leave the build command empty, and set the output directory to `.`.
4. Save and deploy. Cloudflare will provide a `pages.dev` URL.

Keep `wishes.json` in the same published folder as the HTML file so the browser can load it.
