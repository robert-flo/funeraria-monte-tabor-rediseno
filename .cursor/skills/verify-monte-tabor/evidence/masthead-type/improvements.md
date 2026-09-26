# Masthead type — mobile and tablet notes

Checked phone-portrait `390×844`, tablet-portrait `768×1024`, phone-landscape `844×390`, and desktop `1280×800`. `assert-viewport.py` exited 0 on the three required devices. No horizontal page overflow.

## phone-portrait (`hand`)

Company stays one line. The Cámara line sits under a rule in two balanced lines (`Miembro de la Cámara de Comercio` / `e Industria de El Salvador`) at 14px. Navy ops stays one unwrapped row. Hero CTA bottom is `554` (fold `844`). Optional: the same Cámara sentence also appears in the address band; the masthead is now the primary stamp.

## tablet-portrait (`lap`)

Credential is a right-hand stamp (`0.9rem`, three lines, `max-width: 13.25rem`). Company stays one line. Masthead height stays `130.4`. Plan heads stay equal (`118px`) and `Tipo de ataúd` tops align. Optional: `Establecida en 2006` still reports nested-span client rects on the navy band (pre-existing).

## phone-landscape (`lap`, short)

Credential is a three-line right stamp at `14px`. Company stays one line. Hero CTA bottom is `266` (fold `390`). Optional: unused width beside the name is left on purpose so the short masthead does not grow.

## desktop

Company remains at the `3.95rem` cap on one line. Masthead height stays `130.5`. The Cámara stamp is three right-aligned lines.
