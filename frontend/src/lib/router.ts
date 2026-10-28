export type PageId = "dashboard" | "habits" | "stats";

export interface Route {
    page: PageId;
    path: string;
    params: URLSearchParams;
}

const titles: Record<PageId, string> = {
    dashboard: "Hoje",
    habits: "Hábitos",
    stats: "Estatísticas"
};

const documentTitles: Record<PageId, string> = {
    dashboard: "Hoje · HabitFlow",
    habits: "Hábitos · HabitFlow",
    stats: "Estatísticas · HabitFlow"
};

export function pageTitle(page: PageId): string {
    return titles[page];
}

export function parseRoute(pathname = window.location.pathname, search = window.location.search): Route {
    const path = pathname.replace(/\/index\.html$/, "/") || "/";
    const params = new URLSearchParams(search);
    if (path === "/habits" || path.startsWith("/habits/")) return { page: "habits", path: "/habits", params };
    if (path === "/stats" || path.startsWith("/stats/")) return { page: "stats", path: "/stats", params };
    return { page: "dashboard", path: "/", params };
}

export function pathFor(page: PageId, params?: URLSearchParams): string {
    const base = page === "dashboard" ? "/" : `/${page}`;
    const query = params?.toString();
    return query ? `${base}?${query}` : base;
}

export function replaceUrl(path: string): void {
    history.replaceState({}, "", path);
}

export function navigate(path: string, replace = false): void {
    const current = `${window.location.pathname}${window.location.search}`;
    if (current === path) {
        window.dispatchEvent(new Event("habitflow:route"));
        return;
    }
    if (replace) history.replaceState({}, "", path);
    else history.pushState({}, "", path);
    window.dispatchEvent(new Event("habitflow:route"));
}

export function startRouter(onChange: (route: Route) => void): void {
    const emit = () => {
        const route = parseRoute();
        document.title = documentTitles[route.page];
        onChange(route);
    };

    window.addEventListener("popstate", emit);
    window.addEventListener("habitflow:route", emit);
    emit();
}
