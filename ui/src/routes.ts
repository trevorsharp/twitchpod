import { createRootRoute, createRoute } from "@tanstack/react-router";
import MainPage from "./components/MainPage";
import type { User } from "./types";

type SearchLoaderData = { error?: string; user?: User } | undefined;

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  component: MainPage,
  loader: async ({ params: { _splat: username }, abortController }): Promise<SearchLoaderData> =>
    username
      ? await fetch(`/api/users/${username}`, { signal: abortController.signal }).then(
          async (response) => {
            if (!response.ok) return { error: await response.text() };
            return { user: (await response.json()) as User };
          },
        )
      : undefined,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export { indexRoute, routeTree };
