NAMMA PASHU — STATIC WEBSITE (redesign)
Files: index.html, styles.css, script.js, privacy.html, terms.html, favicon.ico, favicon-32.png, apple-touch-icon.png, og-image.jpg, _redirects, robots.txt, sitemap.xml, assets/

WHAT CHANGED
- Full redesign following the Premium Website Design Brief and the 9-screen mockup (hero, how-it-works, marketplace preview, benefits, planned services, about/breeds, pilot form, FAQ, footer; desktop / tablet / mobile).
- Design tokens are CSS variables at the top of styles.css (colour, spacing, radii, shadows, breakpoints 1100 / 920 / 640).
- All icons are one inline SVG sprite at the top of index.html (no emoji).
- Marketplace preview is rendered by script.js from the LISTINGS array: search, category chips, district -> taluk, sort, empty state, detail modal.
- Pilot form: inline validation, consent checkbox, loading / success / error states. It POSTs JSON to /api/pilot, which is handled by the Cloudflare Worker in the separate NammaPashu-Pilot-Worker package (emails founder@nammapashu.co.in). If that request fails, the visitor sees a fallback with a ready-made email to send themselves.
- Kannada / English switch covers every section (data-kn / data-en attributes + script.js data).

PREVIEWING FORM STATES (design review only)
  index.html?formstate=loading | success | error
  Add &lang=en for English. No data is sent in any state.

PREVIEW
Use a local static server (e.g. python3 -m http.server) rather than file://.

CLOUDFLARE PAGES
Static site, build command blank, output directory "/". Custom domain: nammapashu.co.in.

BEFORE PUBLIC LAUNCH
- Deploy the Worker (see worker README) BEFORE publishing this version, otherwise every submission shows the fallback message. Official email: founder@nammapashu.co.in. No WhatsApp number or address is published yet.
- Marketplace animals, prices, ages and milk yields are DEMONSTRATION DATA and are labelled as such everywhere.
- IMAGES: all photos in assets/ were supplied by the project owner (hero, Hallikar, Murrah, HF, Bannur sheep, goat, Amrit Mahal, Malnad Gidda, buyer inspection, vet check-up, app home screenshot). Several look AI-generated: confirm you have the right to publish them and that they are not presented as documentary photographs of real, verified animals. The buyer-inspection image contains a misspelled truck sign ("KARNATAAKA LIFESTOCK TRAGERS"): replace or retouch it before launch. assets/malnad-gidda.webp is a small source (360x256) and looks soft.
- Review privacy.html and terms.html with a qualified person before launch.
