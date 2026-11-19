# MODUS KI Bewertung Overlay

Ein deutschsprachiges PCF-Feldsteuerelement für lange KI-Bewertungen in
modellgesteuerten Power-Apps. Es zeigt eine kompakte Vorschau eines mehrzeiligen
Textfelds und öffnet den vollständigen Inhalt auf Knopfdruck in einem Overlay.

## Funktionen

- Kompakte Textvorschau mit Schaltfläche **Vollständige KI-Bewertung anzeigen**
- Scrollbares, per Tastatur bedienbares Overlay
- Darstellung von sicher gefiltertem HTML
- Deutschsprachige Oberfläche und leerer Zustand
- Reine Anzeige: Das Steuerelement verändert den Datensatz und das gebundene
  Feld nicht

HTML wird nicht direkt in das aktive DOM eingefügt. Es werden nur erlaubte
semantische Elemente und sichere absolute Links übernommen; Skripte, Styles,
eingebettete Ressourcen und unsichere URLs werden verworfen.

## Kompatibilität

| Eigenschaft | Wert |
| --- | --- |
| Host | Modellgesteuerte Power-Apps |
| Feld | Mehrzeiliger Text (`Multiple`) |
| PCF-Identität | `modus_MODUS.RichTextPreview` |
| Anzeigename | MODUS KI Bewertung Overlay |
| Beschreibung | MODUS KI Bewertung |
| PCF-Version | `0.0.6` |
| Managed-Solution-Version | `1.0.0.5` |
| Sprache | Deutsch (`1031`) |

Die technische Identität `MODUS.RichTextPreview` bleibt absichtlich stabil, um
bestehende Formularbindungen beizubehalten. Der Anzeigename im Formular ist
**MODUS KI Bewertung Overlay**.

## Installation

1. Lade `ModusTextPreview_managed.zip` aus dem GitHub-Release herunter.
2. Importiere die ZIP-Datei in der Zielumgebung über **Lösungen > Lösung
   importieren**.
3. Öffne das gewünschte modellgesteuerte Formular im Formular-Designer und
   wähle das mehrzeilige Textfeld aus.
4. Füge unter den Feldkomponenten **MODUS KI Bewertung Overlay** hinzu. Das
   Steuerelement verwendet die gebundene Eigenschaft `text`.
5. Speichere und veröffentliche das Formular und prüfe es anschließend in der
   App.

Das Paket enthält das PCF, aber keine Formularbindung. Die Bindung wird in der
Zielumgebung vorgenommen. Nach dem Import ist daher ein Speichern und
Veröffentlichen des Formulars erforderlich.

## Quellcode und lokale Prüfungen

Der PCF-Quellcode liegt unter `control/`, das Managed-Solution-Projekt unter
`solution/` und das veröffentlichbare Paket unter `artifacts/`.

```powershell
cd control
npm ci
npm test
```

Die vollständigen PCF-Gates lassen sich mit dem PCF-Tooling ausführen:

```powershell
node "$env:USERPROFILE\.copilot\installed-plugins\power-platform-skills\pcf\scripts\pcf-gates.js" --project .\control --hosts model
```
