import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

export default [
    // breaker
    layout("layouts/sidebar.tsx", [
        // breaker
        index("routes/home.tsx"),
        route("contacts/:contactId", "routes/contact.tsx"),
        route("contacts/:contactId/edit", "routes/edit-contact.tsx"),
    ]),
    route("about", "routes/about.tsx"),
] satisfies RouteConfig;
