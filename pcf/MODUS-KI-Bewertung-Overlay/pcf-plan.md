# MODUS KI Bewertung Overlay plan

## Summary

- **Control:** MODUS.RichTextPreview
- **Description:** MODUS KI Bewertung
- **Template:** field-standard
- **Recipe:** none
- **Connectivity:** online

## Hosts

- Model-driven apps

## Properties

| Name | Usage | Type | Required | Default |
| --- | --- | --- | --- | --- |
| text | bound | Multiple | yes |  |

## Bindings

| # | Kind | Table | Form | Target | Web | Phone | Tablet | Parameters |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _No intended bindings._ |  |  |  |  |  |  |  |  |

## Deploy target

- **Solution:** ModusTextPreview
- **Publisher prefix:** modus
- **Registration:** `pac pcf push --environment <environment>` after skill-level consent.

## Power Pages steps

- Not targeted.

## Findings

- No blocking or advisory findings.

## What will be verified

- The manifest properties match the intended parameters.
- Each intended binding is present for every requested client.
- Draft and published form XML agree after publication.
- Power Pages journeys are manually configured where automation is not available.
