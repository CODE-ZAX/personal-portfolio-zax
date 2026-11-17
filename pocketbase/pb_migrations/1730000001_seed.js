/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const seed = JSON.parse(toString($os.readFile("/pb_migrations/seed.json")));
  const profileCollection = app.findCollectionByNameOrId("profile");
  const profile = new Record(profileCollection);
  for (const [key, value] of Object.entries(seed.profile)) {
    profile.set(key, value);
  }
  app.save(profile);

  const projects = app.findCollectionByNameOrId("projects");
  for (const item of seed.projects) {
    const record = new Record(projects);
    record.set("title", item.title);
    record.set("slug", item.slug);
    record.set("summary", item.summary);
    record.set("body", item.body);
    record.set("stack", item.stack);
    record.set("surface", item.surface);
    record.set("repo", item.repo);
    record.set("url", item.url);
    record.set("visibility", item.visibility);
    record.set("order", item.order);
    record.set("visible", item.visible);
    record.set("links", item.links);
    app.save(record);
  }

  const sections = app.findCollectionByNameOrId("sections");
  for (const item of seed.sections) {
    const record = new Record(sections);
    record.set("key", item.key);
    record.set("heading", item.heading);
    record.set("body", item.body);
    app.save(record);
  }
}, (app) => {
  for (const name of ["sections", "projects", "profile"]) {
    const collection = app.findCollectionByNameOrId(name);
    const records = app.findAllRecords(name);
    for (const record of records) app.delete(record);
    void collection;
  }
});
