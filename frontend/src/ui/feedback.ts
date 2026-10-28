export function renderSkeleton(element: HTMLElement, rows = 4): void {
    const wrap = document.createElement("div");
    wrap.className = "skeleton-stack";
    wrap.setAttribute("aria-hidden", "true");
    for (let index = 0; index < rows; index += 1) {
        const row = document.createElement("div");
        row.className = "skeleton-row";
        wrap.appendChild(row);
    }
    element.replaceChildren(wrap);
}

export function renderErrorState(element: HTMLElement, message: string, onRetry: () => void): void {
    const wrap = document.createElement("div");
    wrap.className = "empty-state";
    const title = document.createElement("strong");
    title.textContent = "Não foi possível carregar";
    const text = document.createElement("p");
    text.textContent = message;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Tentar novamente";
    retry.addEventListener("click", onRetry);
    wrap.append(title, text, retry);
    element.replaceChildren(wrap);
}

export function renderEmptyState(
    element: HTMLElement,
    title: string,
    message: string,
    action?: { label: string; onClick: () => void }
): void {
    const wrap = document.createElement("div");
    wrap.className = "empty-state";
    const heading = document.createElement("strong");
    heading.textContent = title;
    const text = document.createElement("p");
    text.textContent = message;
    wrap.append(heading, text);
    if (action) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action.label;
        button.addEventListener("click", action.onClick);
        wrap.appendChild(button);
    }
    element.replaceChildren(wrap);
}
