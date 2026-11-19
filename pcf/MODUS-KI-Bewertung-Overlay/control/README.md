# MODUS KI Bewertung Overlay

`MODUS.RichTextPreview` (Anzeigename: **MODUS KI Bewertung Overlay**) ist
ein Standard-Feldsteuerelement für mehrzeilige Dataverse-Texte (`Multiple`) in
modellgesteuerten Apps. Es zeigt eine kompakte Vorschau und öffnet den
vollständigen Inhalt in einem barrierearmen Overlay. Das Steuerelement ist
nur lesend und ändert das gebundene Feld nicht.

Die technische PCF-Identität bleibt `MODUS.RichTextPreview`, damit vorhandene
Formularbindungen erhalten bleiben. Der Anzeigename im Formular lautet
**MODUS KI Bewertung Overlay**.

Die Benutzeroberfläche ist ausschließlich auf Deutsch (`1031`) lokalisiert.
Alle Laufzeitbeschriftungen sind zusätzlich direkt im Bundle hinterlegt:
Auch bei fehlenden oder anderssprachigen Host-Ressourcen erscheinen keine
internen Übersetzungsschlüssel oder englischen Buttons.
Der leere Zustand lautet **Keine Bewertungsinformationen vorhanden.** Lange
Bewertungen lassen sich im Overlay unabhängig scrollen; der Inhaltsbereich
kann zum Scrollen auch per Tastatur fokussiert werden.

Das Popup verwendet einen nativen modalen HTML-Dialog im Browser-Top-Layer.
Es überdeckt die Ansichtsfläche der App und wird nicht durch Formularabschnitte,
deren Überlauf oder Stapelkontexte begrenzt. Der Kopfbereich mit **Schließen**
bleibt sichtbar, während der Inhalt per Mausrad, Touch oder Tastatur scrollt.
Bei unverändertem Feldinhalt bleibt die Scrollposition auch nach
`updateView` erhalten. Es werden weder das Host-DOM noch das übergeordnete
Browserfenster verändert. In einer eingebetteten Vorschau begrenzt ein
umschließendes iFrame weiterhin die verfügbare Ansichtsfläche.

Das Overlay baut HTML aus einer strikten semantischen Allowlist neu auf.
Skripte, Styles, eingebettete Ressourcen und unsichere Links werden entfernt;
der ursprüngliche HTML-Inhalt wird nie direkt in das aktive DOM eingefügt.
Absolute HTTP(S)- und `mailto:`-Links öffnen sich geschützt in einem neuen Tab.

Das Erscheinungsbild nutzt die Farben von MODUS Consult: Navy `#00305D`, Rot
`#E2001A`, Dunkelblau `#020F27`, Grau `#768999`, Hellblau `#F2F8FB` und Weiß.

## Zwei Felder konfigurieren

Das PCF wird weiterhin auf dem Multiline-Feld mit der vollständigen Bewertung
eingebunden. Im Komponenten-Dialog lassen sich zwei Eigenschaften zuordnen:

| Eigenschaft | Verwendung |
| --- | --- |
| **Overlayinformationen** (`text`, erforderlich) | Multiline-Feld für den vollständigen Inhalt im Popup. Die bisherige Bindung bleibt bestehen. |
| **Zusammenfassung** (`summary`, optional) | Zweites Multiline-Feld für den Text auf dem Formular. Ein gefüllter Wert wird als sicherer Klartext vollständig angezeigt, ohne die bisherige 240-Zeichen-Kürzung oder Höhenbegrenzung. |

Ohne Zuordnung oder bei leerer Zusammenfassung wird wie bisher eine gekürzte
Vorschau der Overlayinformationen angezeigt. Bei fehlender Leseberechtigung
für die Zusammenfassung erscheint stattdessen ein deutscher Berechtigungshinweis;
es wird nicht auf die Vorschau des anderen Felds ausgewichen.
Beide Felder werden unabhängig auf Leseberechtigung geprüft. Eine lesbare
Zusammenfassung kann auch ohne verfügbare Overlayinformationen angezeigt werden;
der Öffnen-Button ist dann ausgeblendet. Änderungen der Zusammenfassung setzen
die Scrollposition im bereits geöffneten Overlay nicht zurück.

Nach dem Import die Komponenteneigenschaften am Formular öffnen,
**Zusammenfassung** an das zweite Feld derselben Tabelle binden und das
Formular speichern und veröffentlichen. Das PCF schreibt in keines der Felder.

## Lokale Prüfungen

Die PCF-Prüfungen aus dem Repository-Stammverzeichnis starten:

```powershell
node "$env:USERPROFILE\.copilot\installed-plugins\power-platform-skills\pcf\scripts\pcf-gates.js" --project .\MODUSTextPreviewPCF\control --hosts model
```

## Verwaltete Lösung

Das Projekt der zugehörigen Lösung liegt unter `..\solution`. Für das
verteilbare verwaltete ZIP im Release-Modus mit
`SolutionPackageType=Managed` bauen. Das Paket registriert nur das
Steuerelement; ein Maker muss es an ein konkretes mehrzeiliges Feld im
modellgesteuerten Formular binden.
