# MODUS KI Bewertung Overlay

Ein deutschsprachiges PCF-Feldsteuerelement für lange KI-Bewertungen in
modellgesteuerten Power-Apps. Es zeigt eine kompakte Vorschau eines mehrzeiligen
Textfelds und öffnet den vollständigen Inhalt auf Knopfdruck in einem Overlay.

## Funktionen

- Kompakte Textvorschau mit Schaltfläche **Vollständige KI-Bewertung anzeigen**
- Modales Popup über der gesamten App-Ansichtsfläche, oberhalb des Formulars
- Separater Scrollbereich bei festem Kopfbereich mit Schließen-Button
- Darstellung von sicher gefiltertem HTML
- Verbindlich deutsche Buttons, Dialogtitel und Hinweistexte, auch ohne
  funktionierende Übersetzungsressourcen des Hosts
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
| PCF-Version | `0.0.7` |
| Managed-Solution-Version | `1.0.0.6` |
| Sprache | Deutsch (`1031`) |

Die technische Identität `MODUS.RichTextPreview` bleibt absichtlich stabil, um
bestehende Formularbindungen beizubehalten. Der Anzeigename im Formular ist
**MODUS KI Bewertung Overlay**.

Das Popup nutzt den nativen modalen HTML-Dialog (`showModal`) im Browser-Top-Layer.
Dadurch wird es nicht von Formularabschnitten oder deren Überlauf begrenzt.
Es wird kein Host-DOM und kein übergeordnetes Fenster manipuliert. In einer
eingebetteten iFrame-Vorschau begrenzt weiterhin das iFrame die Ansichtsfläche.
Verwende einen aktuellen Browser mit Unterstützung für native HTML-Dialoge.

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

## Update einer vorhandenen Installation

Importiere die Managed Solution `1.0.0.6` als Aktualisierung der vorhandenen
Lösung `ModusTextPreview`. Die technische Identität und die gebundene Eigenschaft
bleiben unverändert; eine bestehende Bindung an `modus_MODUS.RichTextPreview`
muss nicht entfernt werden. Veröffentliche erforderliche Formularänderungen
und lade die App anschließend mit `Strg+F5` neu, damit nicht das alte Bundle
aus dem Browsercache verwendet wird.

## Änderungen in 1.0.0.6

Die Buttons und Hinweistexte sind unabhängig von der Host-Ressourcenauflösung
auf Deutsch. Der bisherige formularinterne Overlay-Container wurde durch einen
nativen modalen Dialog ersetzt. Der Inhalt lässt sich bis zum Ende scrollen,
während der Dialogkopf sichtbar bleibt; unveränderte Host-Updates setzen die
Leseposition nicht mehr zurück.

Die PCF-Gates mit 16 Tests und Produktionsbuild sowie eine lokale
Browserprüfung bei Desktop- und schmaler Ansichtsgröße sind erfolgreich.
Die Browserprüfung umfasst Mausrad, Tastatur, Scrollen bis zum Textende und
Darstellung oberhalb eines begrenzten Formularbereichs. Ein Import und eine
Laufzeitprüfung in einer Dynamics-Zielumgebung stehen noch aus.

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
