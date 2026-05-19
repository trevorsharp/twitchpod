import router from "@/router";

const port = Number(process.env["PORT"] ?? 3000);

Bun.serve({
  port,
  fetch: router.fetch,
  idleTimeout: 120,
});

console.log(`twitchPOD is up and running`);
