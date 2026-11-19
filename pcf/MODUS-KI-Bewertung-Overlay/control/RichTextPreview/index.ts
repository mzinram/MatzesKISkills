import { IInputs, IOutputs } from "./generated/ManifestTypes";
import "./css/RichTextPreview.css";

const ALLOWED_TAGS = new Set([
    "a", "b", "blockquote", "br", "code", "em", "h1", "h2", "h3", "h4", "h5", "h6",
    "i", "li", "ol", "p", "pre", "s", "strong", "table", "tbody", "td", "th", "thead",
    "tr", "u", "ul",
]);
const BLOCK_TAGS = new Set(["blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "li", "ol", "p", "pre", "table", "tr", "ul"]);
const RESOURCE_TAGS = "audio|embed|iframe|img|object|source|track|video";
const PREVIEW_LIMIT = 240;

export class RichTextPreview implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement | null = null;
    private preview: HTMLParagraphElement | null = null;
    private openButton: HTMLButtonElement | null = null;
    private message: HTMLDivElement | null = null;
    private overlay: HTMLDivElement | null = null;
    private dialogContent: HTMLDivElement | null = null;
    private context: ComponentFramework.Context<IInputs> | null = null;
    private value = "";
    private canRead = true;
    private previousFocus: HTMLElement | null = null;

    private readonly onOpen = (): void => {
        if (!this.overlay || !this.openButton || !this.canRead || !this.value.trim()) return;
        this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : this.openButton;
        this.overlay.hidden = false;
        this.openButton.setAttribute("aria-expanded", "true");
        this.overlay.querySelector<HTMLButtonElement>(".richtextpreview-close")?.focus();
    };

    private readonly onClose = (): void => {
        this.closeOverlay();
    };

    private readonly onOverlayClick = (event: MouseEvent): void => {
        if (event.target === this.overlay) this.closeOverlay();
    };

    private readonly onDialogKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            event.preventDefault();
            this.closeOverlay();
            return;
        }
        if (event.key !== "Tab" || !this.overlay) return;

        const focusable = Array.from(this.overlay.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ));
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    public init(
        context: ComponentFramework.Context<IInputs>,
        _notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary,
        container: HTMLDivElement,
    ): void {
        this.container = container;
        this.context = context;

        const root = document.createElement("section");
        root.className = "richtextpreview-control";

        this.preview = document.createElement("p");
        this.preview.className = "richtextpreview-preview";

        this.openButton = document.createElement("button");
        this.openButton.className = "richtextpreview-open";
        this.openButton.type = "button";
        this.openButton.textContent = this.getString("KIBewertungOverlay_Open");
        this.openButton.setAttribute("aria-haspopup", "dialog");
        this.openButton.setAttribute("aria-expanded", "false");
        this.openButton.addEventListener("click", this.onOpen);

        this.message = document.createElement("div");
        this.message.className = "richtextpreview-message";
        this.message.hidden = true;

        this.overlay = document.createElement("div");
        this.overlay.className = "richtextpreview-overlay";
        this.overlay.hidden = true;
        this.overlay.setAttribute("role", "dialog");
        this.overlay.setAttribute("aria-modal", "true");
        this.overlay.setAttribute("aria-label", this.getString("KIBewertungOverlay_DialogTitle"));
        this.overlay.addEventListener("click", this.onOverlayClick);
        this.overlay.addEventListener("keydown", this.onDialogKeydown);

        const panel = document.createElement("div");
        panel.className = "richtextpreview-dialog";

        const header = document.createElement("header");
        header.className = "richtextpreview-header";

        const title = document.createElement("h2");
        title.textContent = this.getString("KIBewertungOverlay_DialogTitle");

        const closeButton = document.createElement("button");
        closeButton.className = "richtextpreview-close";
        closeButton.type = "button";
        closeButton.textContent = this.getString("KIBewertungOverlay_Close");
        closeButton.setAttribute("aria-label", this.getString("KIBewertungOverlay_Close"));
        closeButton.addEventListener("click", this.onClose);

        this.dialogContent = document.createElement("div");
        this.dialogContent.className = "richtextpreview-content";
        this.dialogContent.tabIndex = 0;
        this.dialogContent.setAttribute("role", "document");

        header.append(title, closeButton);
        panel.append(header, this.dialogContent);
        this.overlay.append(panel);
        root.append(this.preview, this.openButton, this.message, this.overlay);
        container.append(root);
        this.updateView(context);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
        const parameter = context.parameters.text;
        this.canRead = parameter?.security?.readable ?? true;
        this.value = this.canRead && parameter?.raw != null ? String(parameter.raw) : "";

        if (!this.preview || !this.openButton || !this.message || !this.dialogContent) return;

        const hasText = this.value.trim().length > 0;
        const sanitized = sanitizeHtml(this.value);
        const plainText = getPlainText(sanitized);
        const compactText = plainText.length > PREVIEW_LIMIT
            ? `${plainText.slice(0, PREVIEW_LIMIT).trimEnd()}…`
            : plainText;

        this.preview.textContent = this.canRead
            ? (hasText ? compactText : this.getString("KIBewertungOverlay_Empty"))
            : "";
        this.preview.hidden = !this.canRead;
        this.openButton.hidden = !this.canRead || !hasText;
        this.openButton.disabled = !hasText;
        this.message.hidden = this.canRead;
        this.message.textContent = this.canRead ? "" : this.getString("KIBewertungOverlay_PermissionDenied");
        this.dialogContent.replaceChildren(sanitized);
        if (!this.canRead || !hasText) this.closeOverlay();
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        this.openButton?.removeEventListener("click", this.onOpen);
        this.overlay?.removeEventListener("click", this.onOverlayClick);
        this.overlay?.removeEventListener("keydown", this.onDialogKeydown);
        this.container?.replaceChildren();
        this.preview = null;
        this.openButton = null;
        this.message = null;
        this.overlay = null;
        this.dialogContent = null;
        this.container = null;
        this.context = null;
        this.previousFocus = null;
    }

    private closeOverlay(): void {
        const overlay = this.overlay;
        if (overlay && !overlay.hidden) {
            overlay.hidden = true;
            this.openButton?.setAttribute("aria-expanded", "false");
            if (this.previousFocus?.isConnected) this.previousFocus.focus();
        }
        this.previousFocus = null;
    }

    private getString(key: string): string {
        return this.context?.resources?.getString(key) || key;
    }
}

function sanitizeHtml(value: string): DocumentFragment {
    const fragment = document.createDocumentFragment();
    if (!value) return fragment;

    const safeInput = value.replace(
        new RegExp(`<\\s*\\/?\\s*(?:${RESOURCE_TAGS})\\b[^>]*>`, "gi"),
        "",
    );
    const parsed = new DOMParser().parseFromString(safeInput, "text/html");
    appendSafeChildren(parsed.body, fragment);
    return fragment;
}

function appendSafeChildren(source: Node, target: Node): void {
    source.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            target.appendChild(document.createTextNode(child.textContent ?? ""));
            return;
        }
        if (!(child instanceof Element)) return;

        const tag = child.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) {
            if (!["script", "style", "svg", "math", "template"].includes(tag)) {
                appendSafeChildren(child, target);
            }
            return;
        }

        const safeElement = document.createElement(tag);
        if (tag === "a") {
            const href = getSafeHref(child.getAttribute("href"));
            if (href) {
                safeElement.setAttribute("href", href);
                safeElement.setAttribute("target", "_blank");
                safeElement.setAttribute("rel", "noopener noreferrer");
            }
        }
        appendSafeChildren(child, safeElement);
        target.appendChild(safeElement);
        if (BLOCK_TAGS.has(tag)) target.appendChild(document.createTextNode("\n"));
    });
}

function getSafeHref(value: string | null): string | null {
    if (!value) return null;
    try {
        const url = new URL(value);
        return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}

function getPlainText(fragment: DocumentFragment): string {
    return (fragment.textContent ?? "").replace(/\s+/g, " ").trim();
}
