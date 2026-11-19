# MODUS KI Bewertung Overlay PCF

The requested target is a reusable model-driven field control for bound
multiline text. The PCF reads and displays the value only; it does not edit the
Dataverse field or write records.

The managed solution is to be created locally as `ModusTextPreview`, using the
existing `modusconsult` publisher with prefix `modus`. No environment import
or form binding is in scope until the user selects the target environment and
authorizes that write. The control will remain unbound to any specific form or
column in the package.

The compact form preview opens a keyboard-accessible overlay containing the
complete content. Treat source HTML as untrusted: reconstruct only allowlisted
semantic elements and safe absolute links as DOM nodes; discard executable
content, styles, embedded resources and unsafe URLs. Never assign source HTML
to `innerHTML`.

Brand tokens based on the public MODUS Consult website stylesheet: navy
`#00305D`, red `#E2001A`, ink `#020F27`, muted `#768999`, pale blue `#F2F8FB`,
and white. The PCF namespace is `MODUS`, control name `KIBewertungOverlay`.

Verification: model-driven PCF gates passed (manifest, source, lint, nine unit
tests, production build). A managed `ModusTextPreview` solution package was
built with the expected `modusconsult` publisher and verified to contain the
bound `Multiple` property. The ZIP is copied to
`artifacts/ModusTextPreview_managed.zip`. No environment import, form binding,
or runtime check was performed. The PCF doctor warned that the project is
under OneDrive and may encounter generated-file locks; the current build
completed successfully.

The display name was changed to `MODUS KI Bewertung Overlay`; the PCF version
was incremented to `0.0.2` and solution version to `1.0.0.1`. Gates passed
again, and the managed ZIP was rebuilt and verified with the updated display
name.

The PCF description is `MODUS KI Bewertung`; the PCF and solution versions
were incremented to `0.0.3` and `1.0.0.2`. Gates passed again, the managed
package was rebuilt, and its embedded PCF display name and description were
verified.

The user reported untranslated dialog labels and inability to scroll the full
assessment. German resources (`1031`) now provide localized title, button,
empty state and other strings. The dialog's content pane uses a shrinkable flex
layout with explicit vertical overflow and keyboard focus; the overlay also
supports overflow for short viewports. PCF version `0.0.4` and solution
version `1.0.0.3` include these corrections.

The user still saw the internal PCF control name and an untranslated empty
state in the form designer. The component identity was changed to
`MODUS.KIBewertungOverlay`, with only German (`1031`) PCF resources. The empty
state says `Keine Bewertungsinformationen vorhanden.` PCF version was `0.0.5`
and solution version was `1.0.0.4`.

Final verification: all model-driven PCF gates passed (including nine unit
tests and production build). The solution was cleaned and rebuilt as a German
managed package. Its manifest now identifies `MODUS.KIBewertungOverlay`, and
the package contains only the `1031` German resource file with the requested
empty-state and dialog labels. The refreshed ZIP is
`artifacts/ModusTextPreview_managed.zip`. It has not been imported into the
environment; the form binding and runtime scrolling still need an in-app
check after the new component is added to the form.

The designer then reported `initialize data failed for control:
modus_MODUS.RichTextPreview`. That is the existing FormXML control identity.
To preserve that binding, the constructor/class were restored to
`RichTextPreview` while keeping the German display name/resources. The repair
uses PCF version `0.0.6` and managed solution version `1.0.0.5`; import is
required to restore the control in the environment.

The compatibility repair passed the model-driven PCF gates, including lint,
nine unit tests, and a production build. The managed solution was rebuilt and
verified to register `modus_MODUS.RichTextPreview` with PCF version `0.0.6`,
solution version `1.0.0.5`, and only the German (`1031`) resource. The package
must still be imported into the environment; no environment write or runtime
verification was performed.
