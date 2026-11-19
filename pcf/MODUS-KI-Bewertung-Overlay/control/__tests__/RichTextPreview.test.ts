import { RichTextPreview } from "../RichTextPreview";
import { IInputs } from "../RichTextPreview/generated/ManifestTypes";
import { mockContext, mockProperty } from "../test/pcf-context";

// jsdom has no dialog implementation; layout and top-layer behavior are checked in a real browser.
beforeAll(() => {
    Object.defineProperties(HTMLDialogElement.prototype, {
        showModal: {
            configurable: true,
            value: function (this: HTMLDialogElement) { this.setAttribute("open", ""); },
        },
        close: {
            configurable: true,
            value: function (this: HTMLDialogElement) { this.removeAttribute("open"); },
        },
    });
});

afterEach(() => {
    document.body.replaceChildren();
});

function mount(
    raw: string | null | undefined,
    readable = true,
    resolveResource: (key: string) => string = (key) => key,
) {
    const control = new RichTextPreview();
    const notify = jest.fn();
    const container = document.createElement("div");
    document.body.append(container);
    const parameters = raw === undefined
        ? {}
        : { text: mockProperty(raw, undefined, { readable }) as IInputs["text"] };
    const context = mockContext<IInputs>(parameters);
    (context as ComponentFramework.Context<IInputs> & { resources: ComponentFramework.Resources }).resources = {
        getResource: (_id: string, success: (data: string) => void) => success(""),
        getString: resolveResource,
    } as ComponentFramework.Resources;

    control.init(context, notify, {}, container);

    return {
        control,
        context,
        notify,
        container,
        preview: () => container.querySelector(".richtextpreview-preview") as HTMLParagraphElement,
        openButton: () => container.querySelector(".richtextpreview-open") as HTMLButtonElement,
        overlay: () => container.querySelector(".richtextpreview-overlay") as HTMLDialogElement,
        content: () => container.querySelector(".richtextpreview-content") as HTMLDivElement,
        closeButton: () => container.querySelector(".richtextpreview-close") as HTMLButtonElement,
    };
}

test("null and missing values render an empty state without an overlay button", () => {
    const { preview, openButton } = mount(null);
    const missing = mount(undefined);

    expect(preview().textContent).toBe("Keine Bewertungsinformationen vorhanden.");
    expect(openButton().hidden).toBe(true);
    expect(missing.preview().textContent).toBe("Keine Bewertungsinformationen vorhanden.");
    expect(missing.openButton().hidden).toBe(true);
});

test("long HTML is compacted in the field and the complete allowed formatting opens in the overlay", () => {
    const value = `<p><strong>${"A".repeat(260)}</strong></p><p><em>Abschluss</em></p>`;
    const mounted = mount(value);

    expect(mounted.preview().textContent).toHaveLength(241);
    expect(mounted.openButton().hidden).toBe(false);
    mounted.openButton().click();

    expect(mounted.overlay().open).toBe(true);
    expect(mounted.content().querySelector("strong")?.textContent).toBe("A".repeat(260));
    expect(mounted.content().querySelector("em")?.textContent).toBe("Abschluss");
    expect(mounted.content().tabIndex).toBe(0);
    expect(mounted.content().getAttribute("role")).toBe("document");
});

test("unsafe elements, event attributes, external resources and dangerous links are removed", () => {
    const mounted = mount(
        '<p onclick="alert(1)">Visible</p><script>alert(2)</script><img src="https://invalid.example/x">' +
        '<a href="javascript:alert(3)" onmouseover="alert(4)">unsafe link</a>',
    );
    mounted.openButton().click();

    expect(mounted.content().textContent).toContain("Visible");
    expect(mounted.content().textContent).toContain("unsafe link");
    expect(mounted.content().querySelector("script")).toBeNull();
    expect(mounted.content().querySelector("img")).toBeNull();
    expect(mounted.content().querySelector("[onclick], [onmouseover]")).toBeNull();
    expect(mounted.content().querySelector("a")?.hasAttribute("href")).toBe(false);
});

test("safe absolute links open in a protected new tab", () => {
    const mounted = mount('<a href="https://modusconsult.de/info">MODUS</a>');
    mounted.openButton().click();

    const link = mounted.content().querySelector("a");
    expect(link?.getAttribute("href")).toBe("https://modusconsult.de/info");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link?.getAttribute("target")).toBe("_blank");
});

test("unreadable field values are not exposed in preview, overlay or outputs", () => {
    const mounted = mount("Confidential assessment", false);

    expect(mounted.preview().hidden).toBe(true);
    expect(mounted.openButton().hidden).toBe(true);
    expect(mounted.container.textContent).toContain("Sie haben keine Berechtigung, diese Bewertung zu lesen.");
    expect(mounted.container.textContent).not.toContain("Confidential assessment");
    expect(mounted.control.getOutputs()).toEqual({});
});

test("overlay closes on Escape, traps focus and restores focus to its opener", () => {
    const mounted = mount("An assessment");
    mounted.openButton().focus();
    mounted.openButton().click();
    expect(document.activeElement).toBe(mounted.closeButton());

    const escape = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    mounted.overlay().dispatchEvent(escape);
    expect(mounted.overlay().open).toBe(false);
    expect(document.activeElement).toBe(mounted.openButton());

    mounted.openButton().focus();
    mounted.openButton().click();
    const tab = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
    mounted.overlay().dispatchEvent(tab);
    expect(document.activeElement).toBe(mounted.content());
    expect(tab.defaultPrevented).toBe(true);
});

test("the field is display-only and does not emit bound-field changes", () => {
    const mounted = mount("Existing assessment");

    expect(mounted.control.getOutputs()).toEqual({});
    expect(mounted.notify).not.toHaveBeenCalled();
});

test("two instances keep independent overlays and do not duplicate dialog IDs", () => {
    const first = mount("First assessment");
    const second = mount("Second assessment");

    first.openButton().click();

    expect(first.overlay().open).toBe(true);
    expect(second.overlay().open).toBe(false);
    expect(first.container.querySelector("[id]")).toBeNull();
    expect(second.container.querySelector("[id]")).toBeNull();
});

test("destroy removes the control DOM and event behavior", () => {
    const mounted = mount("Existing assessment");
    const button = mounted.openButton();
    const dialog = mounted.overlay();
    button.click();

    mounted.control.destroy();
    button.click();

    expect(mounted.container.childElementCount).toBe(0);
    expect(dialog.open).toBe(false);
    expect(mounted.notify).not.toHaveBeenCalled();
});

test.each([
    ["unresolved resource keys", (key: string) => key],
    ["empty resources", () => ""],
    ["English resources", () => "Read more"],
    ["a resource lookup error", () => { throw new Error("Resource not available"); }],
])("all runtime labels stay German with %s", (_description, resolveResource) => {
    const mounted = mount("Bewertung", true, resolveResource);
    const empty = mount(null, true, resolveResource);
    const denied = mount("Vertraulich", false, resolveResource);

    expect(mounted.openButton().textContent).toBe("Vollständige KI-Bewertung anzeigen");
    mounted.openButton().click();
    expect(mounted.closeButton().textContent).toBe("Schließen");
    expect(mounted.overlay().getAttribute("aria-label")).toBe("MODUS KI Bewertung");
    expect(mounted.overlay().querySelector("h2")?.textContent).toBe("MODUS KI Bewertung");
    expect(empty.preview().textContent).toBe("Keine Bewertungsinformationen vorhanden.");
    expect(denied.container.textContent).toContain("Sie haben keine Berechtigung, diese Bewertung zu lesen.");
    expect(mounted.container.textContent).not.toContain("KIBewertungOverlay_");
});

test("native dialog cancellation closes the overlay and restores the opener", () => {
    const mounted = mount("Bewertung");
    mounted.openButton().focus();
    mounted.openButton().click();
    const cancel = new Event("cancel", { cancelable: true });

    mounted.overlay().dispatchEvent(cancel);

    expect(cancel.defaultPrevented).toBe(true);
    expect(mounted.overlay().open).toBe(false);
    expect(mounted.openButton().getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(mounted.openButton());
});

test("host updates preserve the reader's position unless the field content changes", () => {
    const mounted = mount("<p>Bewertung</p>");
    mounted.openButton().click();
    const paragraph = mounted.content().firstChild;
    mounted.content().scrollTop = 42;

    mounted.control.updateView(mounted.context);

    expect(mounted.content().firstChild).toBe(paragraph);
    expect(mounted.content().scrollTop).toBe(42);
    mounted.context.parameters.text.raw = "Neue Bewertung";
    mounted.control.updateView(mounted.context);
    expect(mounted.content().textContent).toBe("Neue Bewertung");
    expect(mounted.content().scrollTop).toBe(0);
});

test("revoked read permission clears and closes an open assessment", () => {
    const mounted = mount("Vertrauliche Bewertung");
    mounted.openButton().click();
    const restricted = mockContext<IInputs>({
        text: mockProperty("Vertrauliche Bewertung", undefined, { readable: false }) as IInputs["text"],
    });

    mounted.control.updateView(restricted);

    expect(mounted.overlay().open).toBe(false);
    expect(mounted.content().textContent).toBe("");
    expect(mounted.container.textContent).not.toContain("Vertrauliche Bewertung");
});

test("HTML assessments render compactly without source-whitespace gaps or empty paragraphs", () => {
    const value = "<h3>3. Zielbranche</h3>\n\n<p>&nbsp;</p>\n<div><strong>Ampel:</strong><br>GRÜN</div>\n\n\n<p><strong>Branche:</strong> Maschinenbau</p>";
    const mounted = mount(value);

    expect(mounted.content().classList.contains("richtextpreview-content--plain")).toBe(false);
    expect(mounted.content().querySelectorAll("p")).toHaveLength(1);
    expect(mounted.content().querySelector("div strong")?.textContent).toBe("Ampel:");
    expect(mounted.preview().textContent).toBe("3. Zielbranche Ampel: GRÜN Branche: Maschinenbau");
});

test("plain-text assessments keep their line breaks", () => {
    const mounted = mount("Ampel: GRÜN\nBranche: Maschinenbau");

    expect(mounted.content().classList.contains("richtextpreview-content--plain")).toBe(true);
    expect(mounted.content().textContent).toBe("Ampel: GRÜN\nBranche: Maschinenbau");
});
