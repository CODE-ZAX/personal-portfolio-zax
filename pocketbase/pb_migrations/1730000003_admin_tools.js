/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = new Collection({
    name: "admin_tools",
    type: "base",
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "name", type: "text", required: true },
      { name: "url", type: "text", required: true },
      { name: "description", type: "text" },
      { name: "icon", type: "text" },
      { name: "sortOrder", type: "number" },
      { name: "healthUrl", type: "text" },
    ],
  });
  app.save(collection);

  const tools = [
    {
      name: "Portfolio content",
      url: "/_/",
      description: "PocketBase records for the public site.",
      icon: "content",
      sortOrder: 1,
      healthUrl: "",
    },
    {
      name: "Portainer",
      url: "https://panel.141-144-233-206.sslip.io",
      description: "Containers and images on this host.",
      icon: "containers",
      sortOrder: 2,
      healthUrl: "https://panel.141-144-233-206.sslip.io",
    },
    {
      name: "n8n",
      url: "https://n8n.141-144-233-206.sslip.io",
      description: "Workflows that run beside the site.",
      icon: "workflow",
      sortOrder: 3,
      healthUrl: "https://n8n.141-144-233-206.sslip.io",
    },
    {
      name: "Open WebUI",
      url: "https://chat.141-144-233-206.sslip.io",
      description: "The local chat interface.",
      icon: "chat",
      sortOrder: 4,
      healthUrl: "https://chat.141-144-233-206.sslip.io",
    },
  ];

  for (const tool of tools) {
    const record = new Record(collection);
    record.set("name", tool.name);
    record.set("url", tool.url);
    record.set("description", tool.description);
    record.set("icon", tool.icon);
    record.set("sortOrder", tool.sortOrder);
    record.set("healthUrl", tool.healthUrl);
    app.save(record);
  }
}, (app) => {
  try {
    app.delete(app.findCollectionByNameOrId("admin_tools"));
  } catch (_) {
    /* already removed */
  }
});
