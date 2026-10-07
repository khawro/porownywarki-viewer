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
- [x] **Pierwszy ekran = strona główna (landing)**, nie ekran samej zgody na cookies — banner cookies najwyżej jako kolejny krok

## W toku

- [ ] **Link4** — spróbować inny profil danych, żeby zobaczyć ofertę (przy okazji ponowić 3 ekrany mobile: walidacja właściciela, Zgody, kalendarz daty startu)

## Kolejka

1. [ ] **Mubi desktop** — ostra wersja 1920×1200 bez paska przeglądarki (ponowić, mubi.pl blokowało 403 przy wyborze marki)
2. [ ] **The Zebra** — dokończyć (oferty + mobile) gdy Cloudflare puści

## Pominięte (wrócimy później)

- [ ] **The Zebra** — Cloudflare hard block (Ray ID `a46e7db10c0f3224`); bez retry. Opublikowane 16 desktop; lokalne pliki 17–30 w `thezebra/desktop` to błędnie podpisane zrzuty NerdWallet (pominięte), 0 mobile.

## Zrobione

- [x] **Poprawka landingów mobile:** Rankomat, Mubi, Lemonade — krok 1 to czysty landing bez banera cookies (1170×2532), na produkcji
- [x] **Link4** — częściowo: desktop **14** (1920×1200) + mobile **10** (1170×2532; 3 ekrany mobile z błędnym zoomem pominięte, wersja tylko na desktopie). Po Zgodach Link4 odmówił sprzedaży online dla profilu testowego — modal „kontakt z infolinią”, brak ofert. Na produkcji
- [x] **Pierwszy ekran bez cookies** — usunięte ekrany zgody cookies jako krok 1: Mubi desktop (2 ekrany cookies → start od landingu), The Zebra (landing bez bannera ze starszej sesji), Beesafe. Rankomat mobile i Mubi mobile — poprawione osobno (nowe czyste landingi)
- [x] **Beesafe** — częściowo: desktop **16** (1920×1200) + mobile **17** (1170×2532), od landingu do oferty i danych właściciela; zatrzymane na polu VIN (strona wymaga VIN przed podsumowaniem/płatnością), na produkcji
- [x] **The Zebra** — opublikowane częściowo: desktop **16** (1920×1200, od landingu do pytania o płeć kierowcy; Cloudflare blokuje od roku auta w nowej sesji), mobile **0**, na produkcji
- [x] **Dark mode** — przełącznik motywu (słońce/księżyc) w topbarze i na /todo; domyślnie wg systemu, wybór zapamiętany w localStorage, bez mignięcia przy ładowaniu, na produkcji
- [x] **GoCompare** — desktop **21** (1920×1200) + mobile **23 / 23** (1170×2532), do przekierowania do ubezpieczyciela, na produkcji
- [x] **Mubi** — desktop **36** (bez 2 ekranów cookies i duplikatu z błędem połączenia; przycięty pasek Chrome → 1920×1111) + mobile **28 / 28** (1170×2532), do dodatków po wyborze oferty, na produkcji
- [x] **Rankomat** mobile — pełne flow od czystego formularza (**28 / 28**), 1170×2532, na produkcji
- [x] **Lemonade** — desktop **29** + mobile **45 / 45** do oferty (1170×2532), na produkcji
- [x] **Insurify** — desktop OK + natywne mobile **45 / 45** do ofert, 1170×2532, na produkcji
- [x] **NerdWallet** — desktop 20 + mobile 21, 1920×1200 / 1170×2532, na produkcji
- [x] **Kiosk Polis** — mobile 1170×2532 (**12 / 12**) na produkcji
- [x] Strona [/todo](https://porownywarki-viewer.vercel.app/todo)
