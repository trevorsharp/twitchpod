import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ui/styles.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@ui/routes";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
