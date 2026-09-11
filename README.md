# Durga Devi — Portfolio Website

A butterfly-themed, dark-premium personal portfolio for Durga Devi (Computer Science student).
Includes a working Node/Express backend (contact form + resume download) and a static
frontend (HTML/CSS/vanilla JS — no build step required).

```
devi-portfolio/
├── backend/           Express server (API + serves the frontend)
│   ├── server.js
│   ├── package.json
│   └── data/messages.json   (created automatically, stores contact submissions)
└── frontend/           Static site
    ├── index.html
    ├── css/style.css
    ├── js/main.js
    └── assets/ (profile photo + resume PDF)
```

## How to run it

You need **Node.js 18+** installed (check with `node -v`).

1. Open a terminal in the `devi-portfolio/backend` folder:
   ```bash
   cd devi-portfolio/backend
   npm install
   npm start
   ```
2. Open your browser at **http://localhost:5000**

That single command runs both the API and serves the whole website — you don't need to run
the frontend separately. The contact form posts to `/api/contact`, and both "Download Resume"
buttons hit `/api/resume`, which streams the PDF from `frontend/assets/`.

### Changing the port
```bash
PORT=4000 npm start
```

### Viewing submitted contact messages
Every message sent through the contact form is appended to `backend/data/messages.json`.
You can also see them live at **http://localhost:5000/api/messages**.

## Customizing

- **Profile photo / resume**: replace the files inside `frontend/assets/`.
- **Colors / fonts**: edit the CSS variables at the top of `frontend/css/style.css`.
- **Content** (projects, skills, education, links): edit `frontend/index.html` directly —
  every section is clearly commented.
- **Social links**: update the placeholder `#` links (LinkedIn/GitHub) in the Contact section
  and Footer of `index.html`.

## Notes

- The butterfly animations use the CSS `offset-path` property (supported in all modern
  browsers: Chrome, Edge, Firefox, Safari 16+) for smooth curved flight paths, with a
  JavaScript-driven wing flap and randomized spawn timing.
- `prefers-reduced-motion` is respected — animations shorten automatically for users who
  have that OS setting enabled.
- Butterfly count automatically reduces on small/mobile screens.
# durga_portfolio
