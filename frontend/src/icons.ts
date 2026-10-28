const paths: Record<string, string> = {
    home: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z",
    check: "M5 12.5 9.5 17 19 7.5",
    chart: "M5 19V9m7 10V5m7 14v-7",
    plus: "M12 5v14M5 12h14",
    edit: "M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z",
    trash: "M5 7h14M10 7V5h4v2m-7 0 1 13h8l1-13",
    chevronLeft: "M14 6 8 12l6 6",
    chevronRight: "M10 6l6 6-6 6",
    close: "M6 6l12 12M18 6 6 18",
    calendar: "M7 4v3M17 4v3M5 9h14M6 7h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"
};

export type IconName = keyof typeof paths;

export function iconSvg(name: IconName, className = "icon"): string {
    const d = paths[name];
    return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
}

export function iconElement(name: IconName, className = "icon"): HTMLSpanElement {
    const wrap = document.createElement("span");
    wrap.className = "icon-wrap";
    wrap.innerHTML = iconSvg(name, className);
    return wrap;
}
