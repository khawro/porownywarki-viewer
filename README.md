# porównywarek ubezpieczeń w Polsce — viewer

Statyczna web-aplikacja (styl Mobbin) do podglądu screenshotów flow OC:

- **Rankomat**, **Kiosk Polis**, **Insurify**, **NerdWallet**, **Lemonade**, **Mubi**, **GoCompare**, **The Zebra**, **Beesafe**, **Link4**, **Policygenius**
- osobno **Desktop** i **Mobile**
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
