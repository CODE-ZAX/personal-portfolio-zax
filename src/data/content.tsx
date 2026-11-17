import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { profile as baked, type Project } from "./profile";
import { snapshot } from "./snapshot";

type SectionCopy = { heading: string; body: string };

type SiteProfile = Omit<typeof baked, "projects"> & { projects: Project[] };

type SiteContent = {
  profile: SiteProfile;
  sections: Record<string, SectionCopy>;
};

type RemoteRecord = Record<string, unknown>;

const bakedSections: Record<string, SectionCopy> = Object.fromEntries(
  snapshot.sections.map((section) => [section.key, { heading: section.heading, body: section.body }]),
);

const initial: SiteContent = { profile: { ...baked, projects: [...baked.projects] }, sections: bakedSections };

const ContentContext = createContext<SiteContent>(initial);

function fileUrl(collection: string, record: RemoteRecord, field: string) {
  const name = record[field];
  const id = record.id;
  if (typeof name !== "string" || !name || typeof id !== "string") return undefined;
  return `/api/files/${collection}/${id}/${encodeURIComponent(name)}`;
}

function asProjects(items: RemoteRecord[]): Project[] {
  return items
    .filter((item) => item.visible !== false)
    .map((item) => {
      const links = Array.isArray(item.links) ? (item.links as { label: string; url: string }[]) : [];
      const homepage = links.find((link) => link.label === "Open the deployed site");
      const extraLinks = links.filter((link) => link !== homepage);
      const repo = String(item.repo ?? "");
      const bakedProject = baked.projects.find((project) => project.repo === repo);
      return {
        name: String(item.title ?? bakedProject?.name ?? ""),
        surface: String(item.surface ?? bakedProject?.surface ?? ""),
        repo,
        url: String(item.url ?? bakedProject?.url ?? ""),
        visibility: (item.visibility === "public" ? "public" : "private") as Project["visibility"],
        summary: String(item.summary ?? ""),
        detail: String(item.body ?? ""),
        stack: String(item.stack ?? ""),
        homepage,
        extraLinks: extraLinks.length ? extraLinks : undefined,
        coverUrl: fileUrl("projects", item, "cover"),
        videoUrl: fileUrl("projects", item, "video"),
      };
    });
}

async function loadRemote(signal: AbortSignal): Promise<SiteContent | null> {
  const headers = { accept: "application/json" };
  const [profileRes, projectRes, sectionRes] = await Promise.all([
    fetch("/api/collections/profile/records?perPage=1", { signal, headers }),
    fetch("/api/collections/projects/records?perPage=50&sort=order&filter=visible=true", { signal, headers }),
    fetch("/api/collections/sections/records?perPage=50", { signal, headers }),
  ]);
  if (!profileRes.ok || !projectRes.ok || !sectionRes.ok) return null;
  const profileJson = (await profileRes.json()) as { items?: RemoteRecord[] };
  const projectJson = (await projectRes.json()) as { items?: RemoteRecord[] };
  const sectionJson = (await sectionRes.json()) as { items?: RemoteRecord[] };
  const row = profileJson.items?.[0];
  if (!row) return null;
  const sections = { ...bakedSections };
  for (const section of sectionJson.items ?? []) {
    const key = String(section.key ?? "");
    if (!key) continue;
    sections[key] = { heading: String(section.heading ?? ""), body: String(section.body ?? "") };
  }
  const projects = asProjects(projectJson.items ?? []);
  return {
    sections,
    profile: {
      ...baked,
      name: String(row.name ?? baked.name),
      handle: String(row.handle ?? baked.handle),
      location: String(row.location ?? baked.location),
      company: String(row.company ?? baked.company),
      headline: String(row.headline ?? baked.headline),
      lede: String(row.lede ?? baked.lede),
      quote: String(row.quote ?? baked.quote),
      skillsIntro: String(row.skillsIntro ?? baked.skillsIntro),
      contactIntro: String(row.contactIntro ?? baked.contactIntro),
      about: Array.isArray(row.about) ? (row.about as string[]) : baked.about,
      skills: Array.isArray(row.skills) ? (row.skills as typeof baked.skills) : baked.skills,
      contact: Array.isArray(row.contact) ? (row.contact as typeof baked.contact) : baked.contact,
      projects: projects.length ? projects : baked.projects,
    },
  };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(initial);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 1500);
    loadRemote(controller.signal)
      .then((next) => {
        if (next) setContent(next);
      })
      .catch(() => undefined);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useProfile() {
  return useContext(ContentContext).profile;
}

export function useSection(key: string) {
  return useContext(ContentContext).sections[key];
}
