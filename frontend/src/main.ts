import { dashboard } from "./components/Dashboard";
import { habitsPage } from "./components/Habits";
import { stats } from "./components/Stats";
import "../styles/style.css";

const app = document.getElementById("app");
if (app === null) {
    throw new Error("Failed to get app.");
}

const nav = document.getElementById("nav");
if (nav === null) {
    throw new Error("Failed to get nav.");
}

const pageTitles: Record<string, string> = {
    dashboard: "Dashboard",
    habits: "Os meus hábitos",
    stats: "Estatísticas"
};

nav.addEventListener("click", (event) => {
    event.preventDefault();

    if (!(event.target instanceof Element)) return;

    const link = event.target.closest("a[data-page]");
    if (link === null) return;

    const dataPage = link.getAttribute("data-page");
    if (dataPage === null) return;

    nav.querySelectorAll("a[data-page]").forEach(pageLink => pageLink.classList.toggle("active", pageLink === link));
    const currentPage = document.querySelector(".topbar-current");
    if (currentPage) currentPage.textContent = pageTitles[dataPage] ?? "Dashboard";

    switch (dataPage) {
        case "dashboard":
            dashboard(app);
            break;
        case "habits":
            void habitsPage(app);
            break;
        case "stats":
            void stats(app);
            break;
    }
});

void dashboard(app);
