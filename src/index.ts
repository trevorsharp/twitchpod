import router from "@/router";

const port = parseInt(process.env["PORT"] ?? "3000");

Bun.serve({ fetch: router.fetch, idleTimeout: 120, port });

console.log(`twitchPOD listening on port ${port}`);
