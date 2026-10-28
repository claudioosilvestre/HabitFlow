import { iconSvg } from "../icons";

export interface ModalHandle {
    body: HTMLElement;
    close: () => void;
}

export function openModal(title: string): ModalHandle {
    closeOverlays();

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const abort = new AbortController();

    const dialog = document.createElement("div");
    dialog.className = "dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "dialog-title");

    const header = document.createElement("div");
    header.className = "dialog-header";
    const heading = document.createElement("h2");
    heading.id = "dialog-title";
    heading.textContent = title;
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "icon-button";
    closeButton.setAttribute("aria-label", "Fechar");
    closeButton.innerHTML = iconSvg("close");
    header.append(heading, closeButton);

    const body = document.createElement("div");
    body.className = "dialog-body";
    dialog.append(header, body);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    document.body.classList.add("overlay-open");

    const close = () => {
        abort.abort();
        overlay.remove();
        if (!document.querySelector(".overlay")) document.body.classList.remove("overlay-open");
    };

    closeButton.addEventListener("click", close, { signal: abort.signal });
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) close();
    }, { signal: abort.signal });
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
    }, { signal: abort.signal });
    overlay.addEventListener("habitflow:dismiss", close, { signal: abort.signal });

    return { body, close };
}

export function confirmAction(options: {
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
}): Promise<boolean> {
    closeOverlays();

    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "overlay";
        const abort = new AbortController();

        const dialog = document.createElement("div");
        dialog.className = "dialog dialog-confirm";
        dialog.setAttribute("role", "alertdialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-labelledby", "confirm-title");
        dialog.setAttribute("aria-describedby", "confirm-message");

        const heading = document.createElement("h2");
        heading.id = "confirm-title";
        heading.textContent = options.title;
        const message = document.createElement("p");
        message.id = "confirm-message";
        message.textContent = options.message;

        const actions = document.createElement("div");
        actions.className = "form-actions";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "secondary";
        cancel.textContent = "Cancelar";
        const confirm = document.createElement("button");
        confirm.type = "button";
        confirm.className = options.danger ? "danger" : "";
        confirm.textContent = options.confirmLabel ?? "Confirmar";
        actions.append(cancel, confirm);

        dialog.append(heading, message, actions);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        document.body.classList.add("overlay-open");
        confirm.focus();

        const finish = (value: boolean) => {
            abort.abort();
            overlay.remove();
            if (!document.querySelector(".overlay")) document.body.classList.remove("overlay-open");
            resolve(value);
        };

        cancel.addEventListener("click", () => finish(false), { signal: abort.signal });
        confirm.addEventListener("click", () => finish(true), { signal: abort.signal });
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) finish(false);
        }, { signal: abort.signal });
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") finish(false);
        }, { signal: abort.signal });
        overlay.addEventListener("habitflow:dismiss", () => finish(false), { signal: abort.signal });
    });
}

export function closeOverlays(): void {
    document.querySelectorAll(".overlay").forEach(node => {
        node.dispatchEvent(new Event("habitflow:dismiss"));
        node.remove();
    });
    document.body.classList.remove("overlay-open");
}
