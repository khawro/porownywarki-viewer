# porównywarek ubezpieczeń w Polsce — viewer

Statyczna web-aplikacja (styl Mobbin) do podglądu screenshotów flow OC:

- **Rankomat**, **Kiosk Polis**, **Insurify**, **NerdWallet**, **Lemonade**, **Mubi**, **GoCompare**, **The Zebra**, **Beesafe**, **Link4**, **Policygenius**, **Marshmallow**, **Getsafe**, **Feather**, **Compare the Market**, **Confused.com**, **Root Insurance**, **Progressive**, **Hedvig**, **Trasti**, **Warta**, **Ominimo**, **Pevno**, **Redclick**, **Klik.cz**
- przy nazwie strony flaga kraju rynku (🇵🇱 Polska, 🇺🇸 USA, 🇬🇧 UK, 🇩🇪 Niemcy, 🇸🇪 Szwecja, 🇨🇿 Czechy) — na kartach, w nagłówku flow, w chipach i w panelu bocznym
- osobno **Desktop** i **Mobile**; w trybie Mobile nie ma stron bez ekranów mobile (i odwrotnie) — liczone z `images.json`
- we flow: poprzedni / następny ekran (przyciski ‹ ›, strzałki ← →, swipe) z licznikiem „N / total”; klik w ekran otwiera powiększony podgląd (Esc zamyka)
- tagi w panelu bocznym (nie na obrazkach)
- wyszukiwanie po tagach — ten sam tag we wszystkich trzech aplikacjach naraz

## Uruchomienie

```bash
cd /workspace/porownywarki-viewer
python3 -m http.server 8765
```

Otwórz: http://localhost:8765/

## Pliki

| Plik | Opis |
|------|------|
| `index.html` | UI |
| `styles.css` | Mobbin-inspired (biały canvas, ink #141414, accent #0065ff) |
| `app.js` | flow browse + tag search / compare |
| `images.json` | metadane (site, device, step, tag, tags, path, description) |
| `images/{site}/{device}/*.png` | screenshoty |

## Tagi

Wymyślone / znormalizowane: `start` (home), `pojazd`, `kierowca`, `dane`, `ładowanie`, `oferty`, `checkout`. Literał „ranking ofert” nie jest używany.

## Nowa strona — checklista

1. Screenshoty → `images/{site}/{desktop,mobile}/NN-slug.png` + wpisy w `images.json`.
2. Etykieta w `SITE_LABELS` (`app.js`).
3. **Kraj w `SITE_COUNTRIES` (`app.js`, zaraz pod `SITE_LABELS`)** — kod rynku przechwyconego flow (`PL`, `US`, `GB`, `DE`, `SE`, `CZ`). Nowy kraj → dopisz go też w `COUNTRIES` (flaga + nazwa po polsku). Bez wpisu strona nie ma flagi.
4. Dopisz stronę do listy na górze tego README.

Obecne przypisanie: PL — Rankomat, Kiosk Polis, Mubi, Beesafe, Link4, Trasti, Warta, Ominimo, Pevno, Redclick · US — Insurify, The Zebra, NerdWallet, Lemonade, Policygenius, Root Insurance, Progressive · GB — GoCompare, Marshmallow, Compare the Market, Confused.com · DE — Getsafe, Feather · SE — Hedvig · CZ — Klik.cz.

**Uwaga (flow częściowe):** **Trasti** — ścieżka kończy się na blokadzie CEPiK („nie możemy przedstawić Ci oferty”), bez ekranu ofert. **Warta** — AC niedostępne online; oferta OC 2 291 zł / 12 mies.; ścieżka kończy się na „Dane do polisy” przy obowiązkowym pełnym VIN. **Ominimo** — VIN obowiązkowy; po kroku właściciela/kierowcy brak oferty online („nie jesteśmy w stanie wygenerować oferty online”), ścieżka kończy się na tej blokadzie. **Redclick** — konwersacyjny flow OC/AC; po kroku kontaktowym błąd bazy danych („Ups… bazy dane nie odpowiadają”), bez ceny — ścieżka częściowa.


Flagi rysuje dołączony font `fonts/TwemojiCountryFlags.woff2` (z [country-flag-emoji-polyfill](https://github.com/talkjs/country-flag-emoji-polyfill), grafiki Twemoji © Twitter/X, CC-BY 4.0), bo np. Windows nie ma flag w systemowych emoji. Gdy flagi i tak się nie wyrenderują, zamiast nich pokazuje się mały badge z kodem kraju (`PL`, `US`…).
