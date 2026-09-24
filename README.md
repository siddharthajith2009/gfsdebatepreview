# GFS Legacy Debates

The official website for **GFS Legacy Debates** — the flagship debate event of
GEMS Founders School, Dubai.

> Arguments fade. Ideas leave a legacy.

A fully static, dependency-light site built with semantic HTML5, modern CSS,
vanilla JavaScript, and a light touch of [Anime.js](https://animejs.com/) for
the hero entrance, mobile menu, and form success state. The design is quiet
and editorial: near-black surfaces, hairline borders, condensed uppercase
display type, and the crest red as the single accent.

## Running locally

No build step is required — serve the folder with any static file server:

```bash
# Python
python3 -m http.server 41730

# or Node
npx serve -l 41730
```

Then open <http://localhost:41730>.

## Project structure

```
index.html        Home (hero, about, pillars, president's letter, event info)
about.html        About (chapters 01–04, philosophy, closing statement)
team.html         Core Team (Debate Coordinator feature + student leadership)
contact.html      Contact (channels + validated contact form)

css/
  style.css       Design tokens, layout, and all components
  animations.css  Reveal states and reduced-motion rules
  responsive.css  Tablet and mobile overrides

js/
  main.js         Nav state, scroll progress, mobile menu, contact form
  animations.js   Hero entrance + IntersectionObserver scroll reveals
  vendor/         Vendored anime.min.js (v3.2.2)

assets/
  logo.png        The official GFS Legacy Debates crest
  images/         Portrait placeholders — replace with real photography
```

## Updating content

Everything editable is plain HTML with `<!-- EDIT -->` comments nearby:

- **Logo** — the official crest lives at `assets/logo.png`; replace that file
  to update it everywhere (nav, hero, about panel, footer).
- **Event details** — the `glance` grid in `index.html`
  (date, venue, registration status, eligibility).
- **President's letter** — the `letter` block in `index.html`: portrait,
  badge name/role, quote, message, and signature.
- **Debate Coordinator** — the featured `letter` block at the top of
  `team.html`.
- **Team members** — each person on `team.html` is one
  `<article class="team-card">` block; duplicate a block to add someone and
  point its `<img>` at a photo in `assets/images/`.
- **Contact details** — the `channels` list in `contact.html`, plus the
  footer links on every page.
- **Contact form backend** — the form is validated client-side only; connect
  a backend inside `initContactForm()` in `js/main.js` (marked `BACKEND HOOK`).

## Design system

- **Palette** — near-black with a faint navy cast (`#090b10`, `#10131a`),
  warm off-white text (`#f2f1ed`), hairline white borders, and the crest red
  (`#c4463d`) as the only accent. All tokens live as CSS variables at the top
  of `css/style.css`.
- **Type** — [Oswald](https://fonts.google.com/specimen/Oswald) (condensed,
  uppercase) for display headings, [Manrope](https://fonts.google.com/specimen/Manrope)
  for body copy and labels (loaded from Google Fonts).
- **Surfaces** — boxy throughout: zero border radius, 1px borders, flat
  panels. A barely-visible film grain adds texture.
- **Motion** — deliberately restrained: a soft hero stagger on load, 12px
  scroll reveals driven by IntersectionObserver + CSS transitions, a scroll
  progress bar, and small hover states. All motion is disabled for visitors
  with `prefers-reduced-motion` set, and content is fully visible without
  JavaScript.

## Accessibility

Skip link, semantic landmarks, labelled forms with inline validation, focus
management in the mobile menu, `aria-current` navigation states, alt text on
all meaningful images, and full keyboard operability.
