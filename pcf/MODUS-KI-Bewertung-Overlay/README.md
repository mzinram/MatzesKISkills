# MODUS KI Bewertung Overlay

Ein deutschsprachiges PCF-Feldsteuerelement für lange KI-Bewertungen in
modellgesteuerten Power-Apps. Es zeigt eine kompakte Vorschau eines mehrzeiligen
Textfelds und öffnet den vollständigen Inhalt auf Knopfdruck in einem Overlay.
Optional kann die Zusammenfassung auf dem Formular aus einem zweiten
Multiline-Feld stammen.

## Funktionen

- Kompakte Textvorschau mit Schaltfläche **Vollständige KI-Bewertung anzeigen**
- Eigene Zusammenfassung aus einem separat konfigurierbaren Multiline-Feld;
  ein gefüllter Wert wird auf dem Formular vollständig angezeigt
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
| PCF-Version | `0.0.9` |
| Managed-Solution-Version | `1.0.0.8` |
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
   wähle das mehrzeilige Textfeld mit den ausführlichen Overlayinformationen aus.
4. Füge unter den Feldkomponenten **MODUS KI Bewertung Overlay** hinzu. Das
   Steuerelement verwendet die gebundene Eigenschaft **Overlayinformationen**
   (`text`). Ordne optional **Zusammenfassung** (`summary`) dem zweiten
   Multiline-Feld derselben Tabelle zu.
5. Speichere und veröffentliche das Formular und prüfe es anschließend in der
   App.

Das Paket enthält das PCF, aber keine Formularbindung. Die Bindung wird in der
Zielumgebung vorgenommen. Nach dem Import ist daher ein Speichern und
Veröffentlichen des Formulars erforderlich.

## Update einer vorhandenen Installation

Importiere die Managed Solution `1.0.0.8` als Aktualisierung der vorhandenen
Lösung `ModusTextPreview`. Die technische Identität und die gebundene Eigenschaft
bleiben unverändert; eine bestehende Bindung an `modus_MODUS.RichTextPreview`
muss nicht entfernt werden. Veröffentliche erforderliche Formularänderungen
und lade die App anschließend mit `Strg+F5` neu, damit nicht das alte Bundle
aus dem Browsercache verwendet wird.

## Zusammenfassung und Overlay getrennt konfigurieren

| Eigenschaft im Komponenten-Dialog | Feld und Darstellung |
| --- | --- |
| **Overlayinformationen** (`text`, erforderlich; früher **Text**) | Das bisher gebundene Multiline-Feld mit der vollständigen Bewertung. Der gesamte Inhalt erscheint im Popup. |
| **Zusammenfassung** (`summary`, optional) | Zweites Multiline-Feld für die Formularvorschau. Der eigene Text wird vollständig als sicherer Klartext angezeigt, ohne die bisherige 240-Zeichen-Kürzung und ohne Höhenbegrenzung. |

Nach dem Update im Formular-Designer die bestehende Komponente auswählen,
ihre Eigenschaften öffnen und unter **Zusammenfassung** das gewünschte zweite
Multiline-Feld derselben Tabelle zuordnen. Danach das Formular speichern und
veröffentlichen und die App mit **Strg+F5** neu laden.

Ohne Zuordnung oder bei leerer Zusammenfassung bleibt die bisherige gekürzte
Vorschau der Overlayinformationen erhalten. Fehlt die Leseberechtigung für die
Zusammenfassung, wird kein anderer Feldtext als Ersatz angezeigt, sondern ein
deutscher Berechtigungshinweis. Beide Felder werden unabhängig auf
Leseberechtigung geprüft. Eine lesbare Zusammenfassung bleibt auch bei leeren
oder gesperrten Overlayinformationen sichtbar; der Öffnen-Button ist dann
ausgeblendet. Das PCF verändert keines der beiden Felder.

## Änderungen in 1.0.0.8

Neues optionales Multiline-Binding `summary` für eine eigene Zusammenfassung
auf dem Formular. Das bisherige Binding `text` und die technische PCF-Identität
bleiben unverändert. Zusammenfassungsupdates verändern den Popup-Inhalt und
seine Scrollposition nicht.

Alle Gates mit 28 Tests und Produktionsbuild sind erfolgreich. Der
Manifestvergleich zur vorherigen Version enthält keine Breaking Changes.
Lokal im Browser bei 1440 × 800 und 390 × 600 geprüft: eigene Zusammenfassung
mit mehr als 240 Zeichen vollständig sichtbar, separate Overlayinformationen,
Scrollen bis zum letzten Absatz und Erhalt der Scrollposition.
Das Paket wurde nicht in eine Dynamics-Zielumgebung importiert; dort gilt
weiterhin `runtime-not-checked`. Power Pages und Canvas-Apps sind nicht Ziel
dieser Version.

## Änderungen in 1.0.0.7

HTML-Bewertungen werden im Overlay kompakt dargestellt. Zeilenumbrüche aus dem
HTML-Quelltext und leere Absätze (z. B. `<p>&nbsp;</p>`) erzeugen keine großen
Leerräume mehr; Überschriften, Absätze und Listen haben einheitliche Abstände.
Reiner Text ohne HTML behält seine Zeilenumbrüche. `div`, `span` und `hr` werden
als sichere Struktur-Elemente übernommen. Der letzte Absatz ist nach dem Scrollen
vollständig sichtbar.

Die PCF-Gates mit 18 Tests und Produktionsbuild sowie eine lokale Browserprüfung
sind erfolgreich. Ein Import und eine Laufzeitprüfung in einer Dynamics-Zielumgebung
stehen noch aus.

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
