export type AdminTool = {
  name: string;
  url: string;
  description: string;
  icon: string;
  sortOrder: number;
  healthUrl: string;
};

export const defaultTools: AdminTool[] = [
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
