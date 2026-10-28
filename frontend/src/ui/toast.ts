const STACK_ID = "toast-stack";

function stack(): HTMLElement {
    let element = document.getElementById(STACK_ID);
    if (element) return element;
    element = document.createElement("div");
    element.id = STACK_ID;
    element.className = "toast-stack";
    element.setAttribute("aria-live", "polite");
    document.body.appendChild(element);
    return element;
}

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export function showToast(message: string, action?: ToastAction, duration = 4200): void {
    const item = document.createElement("div");
    item.className = "toast";
    item.setAttribute("role", "status");

    const text = document.createElement("span");
    text.textContent = message;
    item.appendChild(text);

    let timeout = window.setTimeout(dismiss, duration);

    if (action) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "toast-action";
        button.textContent = action.label;
        button.addEventListener("click", () => {
            window.clearTimeout(timeout);
            action.onClick();
            dismiss();
        });
        item.appendChild(button);
    }

    function dismiss(): void {
        item.remove();
    }

    item.addEventListener("mouseenter", () => window.clearTimeout(timeout));
    item.addEventListener("mouseleave", () => {
        timeout = window.setTimeout(dismiss, 1600);
    });

    stack().appendChild(item);
}
