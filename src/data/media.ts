/**
 * Image manifest. Swap a visual by replacing the WebP files and, if the
 * filename changes, the path below. Approved stills and generative
 * compositions share one shape so the layout does not care which is which.
 */

export type Picture = {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
};

function projectPicture(id: string, alt: string): Picture {
  return {
    src: `/assets/images/project-${id}-1152.webp`,
    srcSet: `/assets/images/project-${id}-640.webp 640w, /assets/images/project-${id}-1152.webp 1152w`,
    sizes: "(max-width: 767px) 92vw, 36vw",
    width: 1152,
    height: 864,
    alt,
  };
}

export const media = {
  hero: {
    src: "/assets/images/hero-poster-1280.webp",
    srcSet: "/assets/images/hero-poster-640.webp 640w, /assets/images/hero-poster-1280.webp 1280w",
    sizes: "(max-width: 767px) 100vw, 58vw",
    width: 1280,
    height: 720,
    alt: "Fine silver waves across charcoal, with a cedar ribbon of light",
  } satisfies Picture,
  projects: {
    "CODE-ZAX/applix": projectPicture(
      "applix",
      "A graphite form panel with one field and a control filled in cedar",
    ),
    "CODE-ZAX/electron-bill-calculator": projectPicture(
      "bill",
      "A dark receipt sheet with ruled lines, a cedar total, and a barcode",
    ),
    "CODE-ZAX/proposal-extenstion-backend": projectPicture(
      "proposal",
      "A tilted document on graphite with a cedar seal",
    ),
    "CODE-ZAX/flutter_youtube_ext": projectPicture(
      "youtube",
      "A circular disc behind a waveform, with a short cedar passage",
    ),
    "CODE-ZAX/J.A.R.V.I.S": projectPicture(
      "jarvis",
      "A dark sphere ringed with dotted orbits and a cedar core",
    ),
    "CODE-ZAX/x-clipboard-manager": projectPicture(
      "xclipy",
      "Three stacked graphite panels, the front one edged in cedar",
    ),
    "CODE-ZAX/file-organizer": projectPicture(
      "tidydesk",
      "File tiles drifting into columns, one tile filled cedar",
    ),
    "CODE-ZAX/ai-interviewee": projectPicture(
      "ai-interviewee",
      "Two glass speech panels facing each other across a thin waveform",
    ),
    "CODE-ZAX/live_subtitles": projectPicture(
      "subtitles",
      "A dark frame with two caption bars, the shorter one in cedar",
    ),
    "CODE-ZAX/insiders": projectPicture(
      "insiders",
      "A network of circles on graphite with a cedar node at the center",
    ),
    "CODE-ZAX/chatli": projectPicture(
      "chatli",
      "Soft speech bubbles, one of them cedar, floating on a grey field",
    ),
  } satisfies Record<string, Picture>,
};

export function projectPictureFor(repo: string): Picture | undefined {
  return media.projects[repo as keyof typeof media.projects];
}
