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
Der leere Zustand lautet **Keine Bewertungsinformationen vorhanden.** Lange
Bewertungen lassen sich im Overlay unabhängig scrollen; der Inhaltsbereich
kann zum Scrollen auch per Tastatur fokussiert werden.

Das Overlay baut HTML aus einer strikten semantischen Allowlist neu auf.
Skripte, Styles, eingebettete Ressourcen und unsichere Links werden entfernt;
der ursprüngliche HTML-Inhalt wird nie direkt in das aktive DOM eingefügt.
Absolute HTTP(S)- und `mailto:`-Links öffnen sich geschützt in einem neuen Tab.

Das Erscheinungsbild nutzt die Farben von MODUS Consult: Navy `#00305D`, Rot
`#E2001A`, Dunkelblau `#020F27`, Grau `#768999`, Hellblau `#F2F8FB` und Weiß.

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
