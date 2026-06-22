# System Design Notes

Chapter notes and architecture diagrams for learning system design, plus a web app in [`site/`](site/).

## Repository layout

```
system-design-notes/
├── 01. Scaling/          # Chapter content (markdown + images)
├── 02. .../
├── ...
└── site/                 # React website
    ├── public/chapters/  # Generated from chapter folders (do not edit)
    └── src/
```

## Content

Numbered chapter folders (`01. Scaling` through `28. Stock Exchange`) contain:

- `Readme.md` — chapter text
- `images/` — architecture diagrams

## Website

```bash
cd site
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Command | Description |
|---------|-------------|
| `npm run sync` | Copy chapter content from repo root into `site/public/chapters/` |
| `npm run dev` | Sync content and start dev server |
| `npm run build` | Sync, type-check, and build for production |
| `npm run preview` | Preview production build |

## Updating content

Edit markdown and images in the numbered chapter folders at the **repo root** (not inside `site/`). Run `npm run sync` from `site/` (or use `npm run dev` / `npm run build`) to refresh the website.

## Tech stack

- React 19 + TypeScript
- Vite
- React Router
- react-markdown + remark-gfm + rehype-raw
- Lucide icons
