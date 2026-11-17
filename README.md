# Muhammad Faraz

Personal portfolio for Muhammad Faraz (GitHub: [CODE-ZAX](https://github.com/CODE-ZAX)). Static React site, built with Vite and TypeScript, served as plain files or from nginx.

## Design

Visual direction follows **[MiniMax-AI/frontend-dev](https://github.com/MiniMax-AI/skills/blob/main/skills/frontend-dev/SKILL.md)** from the [VoltAgent awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) catalog.

That skill is the one written for production marketing pages: asymmetric layout, one accent, Outfit and Geist, and a split between [Motion](https://motion.dev/) (Framer Motion) for interface motion and GSAP ScrollTrigger for pinned scroll. This page uses the immersive setting: a lazy WebGL field in the hero, a pinned horizontal project rail on desktop, a kinetic marquee, a mask reveal, a scramble on the handle, an SVG path draw, magnetic links, and a liquid-glass dock. Lenis smooths desktop scrolling. Coarse pointers and reduced motion get a static hero still. A visible Pause control stops looping motion.

Dials used for this page: design variance 9, motion intensity 9, visual density 4. The palette is charcoal graphite with one muted cedar accent, matched to the hero still.

Images live in `public/assets/images`. `npm run assets` resizes the approved stills and redraws the generative project compositions. Paths are listed in `src/data/media.ts`.

## Content

Copy lives in [`src/data/profile.ts`](src/data/profile.ts). Bios, skills, projects, and contact links are taken from the public GitHub profile, the profile README, and each project README. The top of that file lists anything those sources did not include (empty `ai-interview-v2`, no phone number, no employment dates, and similar gaps). Edit the file and rebuild. Do not add employers, dates, or contact details that are not published.

## Local development

```bash
npm install
npm run dev
```

Vite serves the site at http://localhost:5173.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` typechecks and writes `dist/`. Preview serves that folder.

## Docker

The image is a multi-stage build: Node compiles the site, then `nginx:alpine` serves `dist` on port 80. Both base images are official multi-arch images, including `linux/arm64`. nginx does not terminate TLS. Put Caddy (or another proxy) in front of it.

```bash
docker buildx build --platform linux/arm64 -t faraz-portfolio .
docker run --rm -p 8080:80 faraz-portfolio
```

Open http://localhost:8080. On an ARM host you can use the same `docker build` without `buildx` if the default platform is already `linux/arm64`.
