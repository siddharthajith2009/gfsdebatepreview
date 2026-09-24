# GFS Legacy Debates

The official website for **GFS Legacy Debates** — the flagship debate event of
GEMS Founders School.

> Arguments fade. Ideas leave a legacy.

A fully static, dependency-light site built with semantic HTML5, modern CSS,
vanilla JavaScript, and [Anime.js](https://animejs.com/) for the startup
sequence, scroll reveals, and micro-interactions.

## Running locally

No build step is required — serve the folder with any static file server:

```bash
# Python
python3 -m http.server 41730

# or Node
npx serve -l 41730
```

Then open <http://localhost:41730>.

> Opening the HTML files directly from disk (`file://`) also works, but a
> local server is recommended so fonts and session behaviour match production.

## Project structure

```
index.html        Home (hero, introduction, president's message, pillars, event info)
about.html        About (chapters 01–04, philosophy, closing statement)
team.html         Core Team (Debate Coordinator feature + student leadership)
contact.html      Contact (channels + validated contact form)

css/
  style.css       Design tokens, layout, and all components
  animations.css  Animation initial states, ambient motion, reduced-motion rules
  responsive.css  Tablet and mobile overrides

js/
  main.js         Header, mobile menu, custom cursor, contact form, misc
  animations.js   Anime.js choreography: intro, entrances, scroll reveals
  vendor/         Vendored anime.min.js (v3.2.2)

assets/
  logo.svg        Placeholder emblem — replace with the official logo
  images/         Portrait placeholders — replace with real photography
```

## Updating content

Everything editable is plain HTML with `<!-- EDIT -->` comments nearby:

- **Logo** — replace `assets/logo.svg` (or drop in `assets/logo.png` and update
  the `<img>` sources in the header, footer, and intro overlay of each page).
- **Event details** — the `<dl class="facts">` block in `index.html`
  (date, venue, registration status, eligibility).
- **President's message** — the `blockquote`, name, and signature in the
  “Message from the President” section of `index.html`.
- **Team members** — each person on `team.html` is one
  `<article class="member">` block; duplicate a block to add someone and point
  its `<img>` at a photo in `assets/images/`.
- **Contact details** — the `<dl class="channels">` block in `contact.html`,
  plus the footer links on every page.
- **Contact form backend** — the form is validated client-side only; connect
  a backend inside `initContactForm()` in `js/main.js` (marked `BACKEND HOOK`).

## Design system

- **Palette** — ink `#0a0d14`, warm ivory `#f3eee3`, muted gold `#c4a05c`;
  all tokens live as CSS variables at the top of `css/style.css`.
- **Type** — [Fraunces](https://fonts.google.com/specimen/Fraunces) for display
  serif headings, [Archivo](https://fonts.google.com/specimen/Archivo) for body
  copy and labels (loaded from Google Fonts).
- **Motion** — the intro plays once per browser session
  (`sessionStorage`), scroll reveals are IntersectionObserver-driven, and all
  motion is disabled for visitors with `prefers-reduced-motion` set — content
  is fully visible without JavaScript.

## Accessibility

Skip link, semantic landmarks, labelled forms with inline validation, focus
management in the mobile menu, `aria-current` navigation states, alt text on
all meaningful images, and full keyboard operability.
