# Porównywarki viewer — TODO

Aktualizowane w trakcie pracy. Mobile target: iPhone 14/15 **390×844 @3×** → **1170×2532**, bez DevTools.

Zmiany w tym pliku **bez osobnego deployu** — wjeżdżają przy następnym deployu (po skończonym zadaniu).

## Zasada pracy (zapisana)

- [x] Dopisywać wszystko z rozmowy/czatu do tej listy
- [x] Gdy brak innego zadania — brać następny punkt z listy, robić, zaznaczać
- [x] Po każdym punkcie: deploy na produkcję Vercel, check, od razu następny
- [x] Edycje samego TODO.md bez osobnego deployu (wchodzą z następnym deployem)
- [x] **Długie ekrany (np. lista ofert):** 1–2 dodatkowe screeny po lekkim scrollu (nie za dużo)
- [x] **Przy każdym nowym flow:** czyścić formularz/dane strony i zaczynać od zera (pełne flow widoczne) — zasada ogólna dla wszystkich porównywarek

## W toku

- [ ] **Beesafe** — desktop + mobile 1170×2532, bez DevTools

## Kolejka

1. [ ] **Link4** — desktop + mobile 1170×2532, bez DevTools
2. [ ] **Mubi desktop** — ostra wersja 1920×1200 bez paska przeglądarki (ponowić, mubi.pl blokowało 403 przy wyborze marki)
3. [ ] **The Zebra** — dokończyć (oferty + mobile) gdy Cloudflare puści

## Pominięte (wrócimy później)

- [ ] **The Zebra** — Cloudflare hard block (Ray ID `a46e7db10c0f3224`); bez retry. Opublikowane 16 desktop; lokalne pliki 17–30 w `thezebra/desktop` to błędnie podpisane zrzuty NerdWallet (pominięte), 0 mobile.

## Zrobione

- [x] **The Zebra** — opublikowane częściowo: desktop **16** (1920×1200, do pytania o płeć kierowcy; Cloudflare blokuje od roku auta w nowej sesji), mobile **0**, na produkcji
- [x] **Dark mode** — przełącznik motywu (słońce/księżyc) w topbarze i na /todo; domyślnie wg systemu, wybór zapamiętany w localStorage, bez mignięcia przy ładowaniu, na produkcji
- [x] **GoCompare** — desktop **21** (1920×1200) + mobile **23 / 23** (1170×2532), do przekierowania do ubezpieczyciela, na produkcji
- [x] **Mubi** — desktop **38** (z 39, bez duplikatu z błędem połączenia; przycięty pasek Chrome → 1920×1111) + mobile **28 / 28** (1170×2532), do dodatków po wyborze oferty, na produkcji
- [x] **Rankomat** mobile — pełne flow od czystego formularza (**28 / 28**), 1170×2532, na produkcji
- [x] **Lemonade** — desktop **29** + mobile **45 / 45** do oferty (1170×2532), na produkcji
- [x] **Insurify** — desktop OK + natywne mobile **45 / 45** do ofert, 1170×2532, na produkcji
- [x] **NerdWallet** — desktop 20 + mobile 21, 1920×1200 / 1170×2532, na produkcji
- [x] **Kiosk Polis** — mobile 1170×2532 (**12 / 12**) na produkcji
- [x] Strona [/todo](https://porownywarki-viewer.vercel.app/todo)
