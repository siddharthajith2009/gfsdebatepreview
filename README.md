# GFS Legacy Debates

The official website for **GFS Legacy Debates** — the student-run debate event
of GEMS Founders School, Dubai.

> arguments fade. ideas stick around.

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
  main.js         Header, mobile menu, contact form, misc
  animations.js   Anime.js choreography: intro, entrances, scroll reveals
  vendor/         Vendored anime.min.js (v3.2.2)

assets/
  logo.png        The official GFS Legacy Debates crest
  images/         Portrait placeholders — replace with real photography
```

## Updating content

Everything editable is plain HTML with `<!-- EDIT -->` comments nearby:

- **Logo** — the official crest lives at `assets/logo.png`; replace that file
  to update it everywhere (header, footer, hero, and intro overlay).
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

- **Palette** — sampled from the crest: off-white `#f4f2ec`, navy ink
  `#10182b` / `#1e3a70`, crest red `#ae2d26` used sparingly; all tokens live
  as CSS variables at the top of `css/style.css`.
- **Type** — [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
  for headings, [Inter](https://fonts.google.com/specimen/Inter) for body copy,
  and [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) for the
  small casual labels (loaded from Google Fonts).
- **Motion** — the intro plays once per browser session
  (`sessionStorage`), scroll reveals are IntersectionObserver-driven, and all
  motion is disabled for visitors with `prefers-reduced-motion` set — content
  is fully visible without JavaScript.

## Accessibility

Skip link, semantic landmarks, labelled forms with inline validation, focus
management in the mobile menu, `aria-current` navigation states, alt text on
all meaningful images, and full keyboard operability.
