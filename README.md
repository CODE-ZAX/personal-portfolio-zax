# Muhammad Faraz

Personal portfolio for Muhammad Faraz (GitHub: [CODE-ZAX](https://github.com/CODE-ZAX)). Static React site, built with Vite and TypeScript, served as plain files or from nginx.

## Design

Visual direction follows **[MiniMax-AI/frontend-dev](https://github.com/MiniMax-AI/skills/blob/main/skills/frontend-dev/SKILL.md)** from the [VoltAgent awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) catalog.

That skill is the one written for production marketing pages: asymmetric layout, one accent, Outfit and Geist, and a motion system on [Motion](https://motion.dev/) (Framer Motion). This site uses its fluid setting (motion intensity 6): a load sequence in the hero, scroll-triggered reveals, staggered lists, a layout open on each project, a magnetic primary link, and a pointer tilt on the portrait. Scroll progress uses CSS `animation-timeline`. A pinned GSAP scroll-hijack is the skill’s cinematic step and is not included, so the page stays a small static bundle. Background motion can be paused, and `prefers-reduced-motion` turns the motion off.

Dials used for this page: design variance 8, motion intensity 6, visual density 4.

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
