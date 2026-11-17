/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const profile = new Collection({
    name: "profile",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "name", type: "text", required: true },
      { name: "handle", type: "text" },
      { name: "location", type: "text" },
      { name: "company", type: "text" },
      { name: "headline", type: "text" },
      { name: "lede", type: "text" },
      { name: "quote", type: "text" },
      { name: "skillsIntro", type: "text" },
      { name: "contactIntro", type: "text" },
      { name: "about", type: "json", maxSize: 2000000 },
      { name: "skills", type: "json", maxSize: 2000000 },
      { name: "contact", type: "json", maxSize: 2000000 },
    ],
  });
  app.save(profile);

  const projects = new Collection({
    name: "projects",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "slug", type: "text", required: true },
      { name: "summary", type: "text" },
      { name: "body", type: "editor" },
      { name: "stack", type: "text" },
      { name: "surface", type: "text" },
      { name: "repo", type: "text" },
      { name: "url", type: "url" },
      { name: "visibility", type: "text" },
      { name: "order", type: "number" },
      { name: "visible", type: "bool" },
      { name: "links", type: "json", maxSize: 1000000 },
      {
        name: "cover",
        type: "file",
        maxSelect: 1,
        maxSize: 8000000,
        mimeTypes: ["image/webp", "image/png", "image/jpeg"],
      },
      {
        name: "video",
        type: "file",
        maxSelect: 1,
        maxSize: 20000000,
        mimeTypes: ["video/mp4", "video/webm"],
      },
    ],
  });
  app.save(projects);

  const sections = new Collection({
    name: "sections",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "key", type: "text", required: true },
      { name: "heading", type: "text" },
      { name: "body", type: "editor" },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_sections_key ON sections (`key`)"],
  });
  app.save(sections);

  const media = new Collection({
    name: "media",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "title", type: "text" },
      { name: "alt", type: "text" },
      { name: "file", type: "file", maxSelect: 1, maxSize: 20000000 },
    ],
  });
  app.save(media);
}, (app) => {
  for (const name of ["media", "sections", "projects", "profile"]) {
    try {
      app.delete(app.findCollectionByNameOrId(name));
    } catch (_) {
      /* already removed */
    }
  }
});
