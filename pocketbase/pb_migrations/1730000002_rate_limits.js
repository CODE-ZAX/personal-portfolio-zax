/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const settings = app.settings();
  settings.rateLimits.enabled = true;
  settings.rateLimits.rules = [
    { label: "/api/", audience: "@guest", duration: 10, maxRequests: 400 },
    { label: "*:authWithPassword", audience: "", duration: 60, maxRequests: 8 },
    { label: "*:requestOTP", audience: "", duration: 60, maxRequests: 6 },
  ];
  app.save(settings);
}, (app) => {
  const settings = app.settings();
  settings.rateLimits.enabled = false;
  settings.rateLimits.rules = [];
  app.save(settings);
});
