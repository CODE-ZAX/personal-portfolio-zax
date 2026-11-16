/**
 * Edit this file to change the portfolio copy.
 *
 * Sources are Muhammad Faraz's public GitHub profile (CODE-ZAX), the profile
 * README in CODE-ZAX/CODE-ZAX, and the README (or IDENTITY file) of each
 * repository named below. Nothing in this file is a guessed employer, date,
 * phone number, or project description.
 *
 * Gaps — facts that were not in those sources:
 * - ai-interview-v2 contains only .gitattributes. No README, description, or code.
 *   The interview assistant that does have a README is CODE-ZAX/ai-interviewee.
 * - J.A.R.V.I.S has no README. The summary comes from IDENTITY.md only.
 * - eventdashboard has no description. Its README is the Create React App starter.
 * - insiders README is only the title. The one-line summary is the repo description.
 * - The profile README's Chatli row says Node.js, WebSocket, and React. The
 *   chatli and chatli-frontend repositories say Django and TypeScript.
 * - Two sites are published: sirzaxx.com (profile README) and sirzaxx.info
 *   (GitHub blog field). Neither source says which one is canonical.
 * - No phone number, no employment dates, and no street address.
 * - Several other private repositories exist (client sites and product backends).
 *   They are omitted here because they were not described in the profile README
 *   and were not part of the named project set.
 */

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  name: string;
  surface: string;
  repo: string;
  url: string;
  visibility: "public" | "private";
  summary: string;
  detail: string;
  stack: string;
  homepage?: ProjectLink;
  extraLinks?: ProjectLink[];
};

export type SkillGroup = {
  label: string;
  detail: string;
};

export type ContactLink = {
  label: string;
  href: string;
  external: boolean;
};

export const profile = {
  name: "Muhammad Faraz",
  handle: "CODE-ZAX",
  location: "Islamabad",
  company: "Iplex Private Limited",
  portrait: {
    src: "/assets/images/portrait-faraz.png",
    alt: "Portrait of Muhammad Faraz",
  },
  headline: "Ships the product, then stays for the launch.",
  lede: "Technical lead for web, desktop, and mobile products. The work runs from architecture through QA, including the SaaS and AI systems he describes on his GitHub profile.",
  about: [
    "Muhammad Faraz builds web, desktop, and mobile software and describes the job as end to end: architecture, development, launch, QA, and the iteration after that. His GitHub bio calls him an experienced full-stack engineer focused on scalable web applications.",
    "He writes that he has more than five years of experience, and that contractual work has included Medical Transportation Management, BrentDarnell, and NASA, among others. His GitHub profile lists the company Iplex Private Limited and the location Islamabad.",
    "On that same profile he places his strongest work between JavaScript frameworks such as Next.js and NestJS, API and data systems, and LLM integrations. He also says he leads teams, reviews code, and stays through a launch.",
  ],
  quote:
    "A good engineer doesn’t just write code. They ensure it works, scales, ships — and that users don’t even notice the seams.",
  skillsIntro:
    "These groups are the stack published on his GitHub profile, plus languages that actually appear in the repositories below.",
  skills: [
    {
      label: "Interfaces",
      detail: "Next.js, React, Tailwind CSS, and Chakra UI. Flutter shows up in the mobile repositories.",
    },
    {
      label: "Services",
      detail: "Node.js, NestJS, Express, REST, and GraphQL.",
    },
    {
      label: "Data and hosting",
      detail: "Supabase, PostgreSQL, Redis, S3, and Vercel. Project READMEs also use SQLite with Prisma.",
    },
    {
      label: "Payments",
      detail: "Stripe, webhooks, and subscription systems.",
    },
    {
      label: "AI",
      detail:
        "OpenAI API and prompt work, as listed on the profile. Applix also maps form fields with Claude on Amazon Bedrock or a local Ollama model.",
    },
    {
      label: "Delivery",
      detail: "GitHub Actions and Vercel, plus the log and metrics tooling he names without a specific product.",
    },
    {
      label: "Collaboration",
      detail: "Notion, Slack, Jira, Trello, and Figma.",
    },
    {
      label: "Languages in these repos",
      detail: "JavaScript, TypeScript, Python, Dart, C++, and Shell.",
    },
  ] satisfies SkillGroup[],
  projects: [
    {
      name: "Applix",
      surface: "Browser extension",
      repo: "CODE-ZAX/applix",
      url: "https://github.com/CODE-ZAX/applix",
      visibility: "private",
      summary:
        "A local-first assistant that detects job-application forms and fills them from a profile that stays on the machine.",
      detail:
        "Applix is a Chrome extension plus a local server. Field mapping can run through Claude on Amazon Bedrock or a local Ollama model. AWS credentials and the profile stay on the machine. The extension reaches the server through a background worker and an access token. It handles text fields, dropdowns, radios, checkboxes, and several custom comboboxes, and it can attach a résumé file.",
      stack: "JavaScript, a Chrome extension, and a local Node server.",
    },
    {
      name: "Bill Calculator",
      surface: "Desktop",
      repo: "CODE-ZAX/electron-bill-calculator",
      url: "https://github.com/CODE-ZAX/electron-bill-calculator",
      visibility: "private",
      summary: "An offline Electron app that reads utility-bill images and stores what it extracts.",
      detail:
        "The README describes an Electron and React app. Tesseract.js reads the bill images, Sharp preprocesses them, and SQLite via Prisma stores consumer accounts and monthly bills. The app blocks a second entry for the same person and month, can upload a batch of images, and exports to Excel. It is built to run without a network.",
      stack: "Electron, React, SQLite, Prisma, Tesseract.js, and Sharp.",
    },
    {
      name: "Proposal extension",
      surface: "API and admin",
      repo: "CODE-ZAX/proposal-extenstion-backend",
      url: "https://github.com/CODE-ZAX/proposal-extenstion-backend",
      visibility: "private",
      summary: "The server and admin panel behind a browser extension that writes Upwork proposals.",
      detail:
        "The repository is a Node.js and Express API with a React admin panel. It covers JWT authentication, subscription tiers, proposal limits, API keys for the extension, and analytics for proposals sent, installs, and browsers. The README uses SQLite with Prisma, and the admin UI uses TypeScript and Material UI. The repository name keeps the spelling “extenstion”.",
      stack: "TypeScript, Node.js, Express, React, Prisma, and SQLite.",
      homepage: {
        label: "Open the deployed site",
        url: "https://proposal-extenstion-backend.vercel.app",
      },
    },
    {
      name: "YouTube audio",
      surface: "Mobile",
      repo: "CODE-ZAX/flutter_youtube_ext",
      url: "https://github.com/CODE-ZAX/flutter_youtube_ext",
      visibility: "private",
      summary: "A Flutter app that plays YouTube videos as audio and keeps playing in the background.",
      detail:
        "The README describes search, a most-popular list, and liked videos after Google sign-in with the youtube.readonly scope. Playback uses an audio-only stream from youtube_explode_dart and just_audio, with lock-screen controls where the platform allows them. The repository says streaming outside the official player may be subject to YouTube’s terms, and marks the project as educational.",
      stack: "Dart and Flutter.",
    },
    {
      name: "J.A.R.V.I.S",
      surface: "Local assistant",
      repo: "CODE-ZAX/J.A.R.V.I.S",
      url: "https://github.com/CODE-ZAX/J.A.R.V.I.S",
      visibility: "private",
      summary: "A local operational assistant kept in Faraz’s own environment.",
      detail:
        "This repository has no README. Its IDENTITY file names the system JARVIS — Just A Rather Very Intelligent System — and describes a background presence for productivity, context, and execution across personal, technical, and business work. The tree is an agent workspace of identity notes, skills, scripts, and memory files. GitHub classifies the language as Shell.",
      stack: "Shell, with notes, skills, and scripts.",
    },
    {
      name: "Xclipy",
      surface: "Desktop",
      repo: "CODE-ZAX/x-clipboard-manager",
      url: "https://github.com/CODE-ZAX/x-clipboard-manager",
      visibility: "public",
      summary: "A cross-platform clipboard manager with history, global hotkeys, and a system tray.",
      detail:
        "Xclipy keeps text and file clipboard history, can stay above other windows, and opens with Cmd+Shift+V on macOS or Ctrl+Shift+V on Windows and Linux. The README includes search, a context menu, and builds with Qt 6 and C++17 through CMake or qmake.",
      stack: "C++ and Qt 6.",
    },
    {
      name: "TidyDesk",
      surface: "Desktop",
      repo: "CODE-ZAX/file-organizer",
      url: "https://github.com/CODE-ZAX/file-organizer",
      visibility: "public",
      summary: "A desktop file organizer with custom rules, a scheduler, and backups.",
      detail:
        "TidyDesk is a Python application with a tkinter interface. It previews a sort, organizes by type, date, size, or custom rules, and writes a zip backup before it moves files. A scheduler can run those rules later. The README targets Windows, macOS, and Linux, and includes PyInstaller build scripts.",
      stack: "Python and tkinter.",
    },
    {
      name: "AI Interview Cracker",
      surface: "Local tool",
      repo: "CODE-ZAX/ai-interviewee",
      url: "https://github.com/CODE-ZAX/ai-interviewee",
      visibility: "private",
      summary: "A local voice assistant that listens during a video call and speaks replies.",
      detail:
        "The README in ai-interviewee describes speech recognition, text-to-speech, and a browser page on localhost. The person joins the meeting themselves; the app listens and replies. It expects an OpenAI API key and Python 3.8 or newer. The repository named ai-interview-v2 is empty apart from .gitattributes, so this description comes from ai-interviewee.",
      stack: "Python and the OpenAI API.",
    },
    {
      name: "Live subtitles",
      surface: "Tool",
      repo: "CODE-ZAX/live_subtitles",
      url: "https://github.com/CODE-ZAX/live_subtitles",
      visibility: "public",
      summary: "A Python tool that transcribes a video and writes a new file with subtitles burned in.",
      detail:
        "The README describes a short pipeline: extract the audio, transcribe it, generate a subtitle file, and produce a new video. The entry point is src/main.py, which takes a path to a video.",
      stack: "Python.",
    },
    {
      name: "Insiders",
      surface: "Web",
      repo: "CODE-ZAX/insiders",
      url: "https://github.com/CODE-ZAX/insiders",
      visibility: "public",
      summary: "A social product. The repository calls it a new-generation SaaS.",
      detail:
        "The repository description is “This is a new generation saas social media.” The README is only the title, so there is no longer description to add. A deployed site is linked from the repository.",
      stack: "TypeScript.",
      homepage: {
        label: "Open the deployed site",
        url: "https://insiders-chi.vercel.app",
      },
    },
    {
      name: "Chatli",
      surface: "Web",
      repo: "CODE-ZAX/chatli",
      url: "https://github.com/CODE-ZAX/chatli",
      visibility: "private",
      summary: "A chat application with a Django server and a separate TypeScript frontend.",
      detail:
        "Faraz lists Chatli on his profile README. The server repository describes a chat and talking app made with Django. The companion repository, chatli-frontend, is the TypeScript frontend. The profile table says Node.js, WebSocket, and React; the repositories themselves say Django and TypeScript.",
      stack: "Python, Django, and TypeScript.",
      extraLinks: [
        {
          label: "Open the frontend repository",
          url: "https://github.com/CODE-ZAX/chatli-frontend",
        },
      ],
    },
  ] satisfies Project[],
  contactIntro:
    "These are the addresses published on his GitHub profile. The profile does not list a phone number.",
  contact: [
    {
      label: "Write to Faraz",
      href: "mailto:mianmuhammadfaraz@hotmail.com",
      external: false,
    },
    {
      label: "mianmuhammadfaraz@hotmail.com",
      href: "mailto:mianmuhammadfaraz@hotmail.com",
      external: false,
    },
    {
      label: "GitHub, CODE-ZAX",
      href: "https://github.com/CODE-ZAX",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mian-muhammad-faraz-93584521a/",
      external: true,
    },
    {
      label: "Website, sirzaxx.com",
      href: "https://sirzaxx.com",
      external: true,
    },
    {
      label: "Blog, sirzaxx.info",
      href: "https://sirzaxx.info",
      external: true,
    },
  ] satisfies ContactLink[],
};

export const missingContent = [
  "CODE-ZAX/ai-interview-v2 has no README, description, or source files (only .gitattributes).",
  "CODE-ZAX/J.A.R.V.I.S has no README. The page uses IDENTITY.md.",
  "CODE-ZAX/eventdashboard has no description and its README is the Create React App boilerplate, so it is not listed as a project.",
  "CODE-ZAX/insiders has a title-only README. The page uses the repository description.",
  "No phone number, employment dates, or street address were published.",
  "sirzaxx.com and sirzaxx.info are both published, with no note of which is primary.",
];
