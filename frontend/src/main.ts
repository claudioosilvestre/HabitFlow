import { dashboard } from "./components/Dashboard";
import { habitsPage } from "./components/Habits";
import { stats } from "./components/Stats";
import { iconSvg, type IconName } from "./icons";
import { pageTitle, parseRoute, startRouter, type PageId, navigate } from "./router";
import { closeOverlays } from "./ui/overlay";
import "../styles/style.css";

const app = document.getElementById("app");
if (app === null) throw new Error("Failed to get app.");

const currentPageLabel = document.querySelector(".topbar-current");

document.querySelectorAll("[data-icon]").forEach(node => {
    const name = node.getAttribute("data-icon") as IconName | null;
    if (name) node.innerHTML = iconSvg(name);
});

document.querySelectorAll("a[data-page]").forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const href = link.getAttribute("href");
        if (href) navigate(href);
    });
});

function setActive(page: PageId): void {
    document.querySelectorAll("a[data-page]").forEach(link => {
        link.classList.toggle("active", link.getAttribute("data-page") === page);
    });
    if (currentPageLabel) currentPageLabel.textContent = pageTitle(page);
}

let renderToken = 0;

startRouter((route) => {
    const token = ++renderToken;
    closeOverlays();
    setActive(route.page);
    app.replaceChildren();

    const run = async () => {
        switch (route.page) {
            case "habits":
                await habitsPage(app, route.params);
                break;
            case "stats":
                await stats(app);
                break;
            default:
                await dashboard(app);
        }
    };

    void run().then(() => {
        if (token !== renderToken) return;
        const canonical = route.page === "dashboard" ? "/" : `/${route.page}`;
        if (route.path !== canonical && route.params.toString() === "") {
            history.replaceState({}, "", canonical);
        }
    });
});

if (parseRoute().path === "/" && window.location.pathname === "/index.html") {
    history.replaceState({}, "", "/");
}
