# System Design Notes — Website

React app for browsing chapter notes and the concept knowledge graph.

Chapter content lives in the **parent directory** (`../01. Scaling`, `../02. ...`, etc.). The sync script copies markdown and images into `public/chapters/` before dev and build.

## Commands

```bash
npm install
npm run dev
```

| Command | Description |
|---------|-------------|
| `npm run sync` | Read chapters from `..` and write to `public/chapters/` + `src/data/chapters.ts` |
| `npm run dev` | Sync + start Vite dev server |
| `npm run build` | Sync + production build |
| `npm run preview` | Preview production build |
