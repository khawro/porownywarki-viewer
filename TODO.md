# Porównywarki viewer — TODO

Aktualizowane w trakcie pracy. Mobile target: iPhone 14/15 **390×844 @3×** → **1170×2532**, bez DevTools.

## W toku

- [ ] **Kiosk Polis** — świeże natywne zrzuty mobile 1170×2532 (stan: **7 / 12**), potem sync do viewera i produkcja

## Kolejka

1. [ ] **NerdWallet** — założyć konto na jednorazowy e-mail (bez hasła użytkownika); zrzuty desktop + mobile 1170×2532 bez DevTools; wgrać na [produkcję](https://porownywarki-viewer.vercel.app). Jeśli weryfikacja e-mail/telefon zablokuje — zanotować blocker.
2. [ ] **The Zebra** — zrzuty desktop + mobile 1170×2532; wgrać na produkcję (wcześniej Cloudflare — spróbować ponownie)
3. [ ] **Insurify** — sprawdzić, czy na produkcji są już świeże natywne mobile (nie tylko konwersja upscale); jeśli nie — dograć i wdrożyć

## Zrobione (skrót)

- [x] Rankomat mobile — natywne 1170×2532 (7/7) na produkcji
- [x] Wymiary iPhone + CSS `390 / 844` dla wszystkich trzech (Rankomat / Kiosk / Insurify) — interim convert + Rankomat native
- [x] Rankomat bez strony płatności
