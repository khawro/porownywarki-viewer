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

Brak — następny punkt z kolejki.

## Kolejka

1. [ ] **The Zebra** — wznowić później (oferty + mobile), gdy block opadnie
2. [ ] **Beesafe** — desktop + mobile 1170×2532, bez DevTools
3. [ ] **Link4** — desktop + mobile 1170×2532, bez DevTools
4. [ ] **Mubi desktop** — ostra wersja 1920×1200 bez paska przeglądarki (ponowić, mubi.pl blokowało 403 przy wyborze marki)

## Pominięte (wrócimy później)

- [ ] **The Zebra** — Cloudflare hard block (Ray ID `a46e7db10c0f3224`); bez retry. ~30 desktop lokalnie, 0 mobile.

## Zrobione

- [x] **Dark mode** — przełącznik motywu (słońce/księżyc) w topbarze i na /todo; domyślnie wg systemu, wybór zapamiętany w localStorage, bez mignięcia przy ładowaniu, na produkcji
- [x] **GoCompare** — desktop **21** (1920×1200) + mobile **23 / 23** (1170×2532), do przekierowania do ubezpieczyciela, na produkcji
- [x] **Mubi** — desktop **38** (z 39, bez duplikatu z błędem połączenia; przycięty pasek Chrome → 1920×1111) + mobile **28 / 28** (1170×2532), do dodatków po wyborze oferty, na produkcji
- [x] **Rankomat** mobile — pełne flow od czystego formularza (**28 / 28**), 1170×2532, na produkcji
- [x] **Lemonade** — desktop **29** + mobile **45 / 45** do oferty (1170×2532), na produkcji
- [x] **Insurify** — desktop OK + natywne mobile **45 / 45** do ofert, 1170×2532, na produkcji
- [x] **NerdWallet** — desktop 20 + mobile 21, 1920×1200 / 1170×2532, na produkcji
- [x] **Kiosk Polis** — mobile 1170×2532 (**12 / 12**) na produkcji
- [x] Strona [/todo](https://porownywarki-viewer.vercel.app/todo)
