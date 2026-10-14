# porównywarek ubezpieczeń w Polsce — viewer

Statyczna web-aplikacja (styl Mobbin) do podglądu screenshotów flow OC:

- **Rankomat**, **Kiosk Polis**, **Insurify**, **NerdWallet**, **Lemonade**, **Mubi**, **GoCompare**, **The Zebra**, **Beesafe**, **Link4**, **Policygenius**, **Marshmallow**, **Getsafe**, **Feather**, **Compare the Market**, **Confused.com**, **Root Insurance**, **Progressive**, **Hedvig**, **Trasti**, **Warta**, **Ominimo**, **Pevno**, **Redclick**, **Klik.cz**, **Rixo.cz**, **Lovys**, **Pillow.cz**, **Jerry**, **Hugo**, **Cleverea**, **CHECK24**
- przy nazwie strony flaga kraju rynku (🇵🇱 Polska, 🇺🇸 USA, 🇬🇧 UK, 🇩🇪 Niemcy, 🇸🇪 Szwecja, 🇨🇿 Czechy, 🇫🇷 Francja) — na kartach, w nagłówku flow, w chipach i w panelu bocznym
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
| `images/{site}/{device}/*.webp` | screenshoty |

## Tagi

Wymyślone / znormalizowane: `start` (home), `pojazd`, `kierowca`, `dane`, `ładowanie`, `oferty`, `checkout`. Literał „ranking ofert” nie jest używany.

## Nowa strona — checklista

1. Screenshoty → `images/{site}/{desktop,mobile}/NN-slug.webp` + wpisy w `images.json`.
2. Etykieta w `SITE_LABELS` (`app.js`).
3. **Kraj w `SITE_COUNTRIES` (`app.js`, zaraz pod `SITE_LABELS`)** — kod rynku przechwyconego flow (`PL`, `US`, `GB`, `DE`, `SE`, `CZ`, `FR`, `ES`). Nowy kraj → dopisz go też w `COUNTRIES` (flaga + nazwa po polsku). Bez wpisu strona nie ma flagi.
4. Dopisz stronę do listy na górze tego README.

Obecne przypisanie: PL — Rankomat, Kiosk Polis, Mubi, Beesafe, Link4, Trasti, Warta, Ominimo, Pevno, Redclick, Balcia (ukryta) · US — Insurify, The Zebra, NerdWallet, Lemonade, Policygenius, Root Insurance, Progressive, Jerry, Hugo · GB — GoCompare, Marshmallow, Compare the Market, Confused.com · DE — Getsafe, Feather, CHECK24 · SE — Hedvig · CZ — Klik.cz, Rixo.cz, Pillow.cz · FR — Lovys · ES — Cleverea.

**Uwaga (flow częściowe):** **Trasti** — ścieżka kończy się na blokadzie CEPiK („nie możemy przedstawić Ci oferty”), bez ekranu ofert. **Warta** — AC niedostępne online; oferta OC 2 291 zł / 12 mies.; ścieżka kończy się na „Dane do polisy” przy obowiązkowym pełnym VIN. **Ominimo** — VIN obowiązkowy; po kroku właściciela/kierowcy brak oferty online („nie jesteśmy w stanie wygenerować oferty online”), ścieżka kończy się na tej blokadzie. **Redclick** — konwersacyjny flow OC/AC; po kroku kontaktowym błąd bazy danych („Ups… bazy dane nie odpowiadają”), bez ceny — ścieżka częściowa. **Jerry** — US car insurance (jerry.ai); ścieżka częściowa kończy się na weryfikacji SMS (4-cyfrowy kod) — do kontynuacji potrzebny realny numer US. **Cleverea** — hiszpański broker/porównywarka OC/AC; ścieżka częściowa kończy się na liście ofert (Axa od 588,55 €/rok), bez wyboru oferty i zakupu. **Balcia** — OC; wyszukiwanie pojazdu po numerze w CEPiK/UFG zwracało błędy, więc pojazd wybrany ręcznie; po danych osobowych modal „BSY-1857 – Wystąpił błąd w kalkulacji”, bez ceny — ścieżka częściowa. *(Obecnie ukryta — patrz „Ukryte strony”.)* **CHECK24** — Kfz-Versicherung (DE); ścieżka częściowa kończy się na Cloudflare Turnstile („Bestätigen Sie, dass Sie ein Mensch sind”) przed „Ergebnis anzeigen”, bez taryf. Strefa klienta „Mein Konto” jest osobnym flowem **Konto** (`images/check24/konto/`: logowanie, przegląd konta, dane osobowe, Versicherungscenter, Merkzettel, ustawienia logowania i bezpieczeństwa, powiadomienia, metody płatności, a na mobile także menu profilu; desktop 8 kroków, mobile 10); dane osobowe na zrzutach zostały zamaskowane.


**Ukryte strony:** `HIDDEN_SITES` w `app.js` odfiltrowuje wpisy z `images.json` przy ładowaniu (galeria, tagi, wyszukiwarka, flow). Obecnie ukryta: **Balcia** (`balcia`) — za mało ekranów, do uzupełnienia. Pliki `images/balcia/` i wpisy w `images.json` zostają; aby przywrócić, usuń `"balcia"` z `HIDDEN_SITES` i dopisz ją z powrotem do listy stron na górze README.

Flagi rysuje dołączony font `fonts/TwemojiCountryFlags.woff2` (z [country-flag-emoji-polyfill](https://github.com/talkjs/country-flag-emoji-polyfill), grafiki Twemoji © Twitter/X, CC-BY 4.0), bo np. Windows nie ma flag w systemowych emoji. Gdy flagi i tak się nie wyrenderują, zamiast nich pokazuje się mały badge z kodem kraju (`PL`, `US`…).

## Kilka flowów na stronę (np. Kalkulator + Konto)

Strona może mieć kilka flowów. Wpis w `images.json` bez pola `flow` należy do flow
domyślnego (`main`, etykieta „Kalkulator”). Dodatkowy flow:

1. Zrzuty do `images/<site>/<flow>/<device>/NN-slug.webp`, np.
   `images/gocompare/konto/desktop/01-login.webp` (flow domyślny zostaje w `images/<site>/<device>/`).
2. Wpisy w `images.json` z polem `"flow"`. Numeracja `step` od 1 osobno w każdym flow i urządzeniu:
   ```json
   {
     "site": "gocompare",
     "flow": "konto",
     "device": "desktop",
     "step": 1,
     "tag": "login",
     "tags": ["login", "konto"],
     "path": "images/gocompare/konto/desktop/01-login.webp",
     "description": "Logowanie do konta…",
     "width": 1920,
     "height": 1200
   }
   ```
3. Etykieta w `FLOW_LABELS` w `app.js` (np. `konto: "Konto"`); kolejność zakładek w `FLOW_ORDER`.

Gdy strona ma ponad 1 flow, widok strony pokazuje przełącznik flowów z liczbą kroków,
a karta w siatce plakietkę „N flowy”. Wyszukiwarka obejmuje nazwy flowów.
Deep link: `#<site>`, `#<site>/<krok>`, `#<site>/<flow>/<krok>` (np. `#gocompare/konto/3`).

### Go.Compare — Konto

`gocompare` ma dwa flowy: Kalkulator (wycena auta) i Konto (konto klienta: logowanie
kodem jednorazowym z maila — bez hasła, panel z poprzednimi wycenami, dane osobowe,
bezpieczeństwo, preferencje komunikacji, nagrody; na mobile także menu i zapisane wyceny).
Desktop 8 kroków, mobile 11 — `images/gocompare/konto/{desktop,mobile}/`.

### Feather — Konto

`feather` ma dwa flowy: Kalkulator i Konto (konto klienta: rejestracja, panel konta, polisy,
dane osobowe, preferencje komunikacji z włączonymi zgodami marketingowymi, płatności, szkody,
pomoc, dokumenty; na mobile także menu). Desktop 9 kroków, mobile 11 — `images/feather/konto/{desktop,mobile}/`.

### Getsafe — Konto

Konto Getsafe działa tylko w aplikacji: na desktopie modal „Login via Getsafe app” z kodem QR, na mobile menu z „Login” prowadzącym do aplikacji. Brak logowania/rejestracji w przeglądarce. Desktop 1 krok, mobile 1 — `images/getsafe/konto/{desktop,mobile}/`.

### Jerry — Konto

Logowanie do Jerry tylko numerem telefonu (kod SMS); rejestracja kończy się na potwierdzeniu numeru — wymagany numer z USA. Desktop 2 kroki, mobile 2 — `images/jerry/konto/{desktop,mobile}/`.

### Marshmallow — Konto

Konto na account.marshmallow.com: (desktop) bramka „Get the app”, logowanie e-mailem bez hasła (magic link), „Check your inbox” — link nie dociera, bo konto mają tylko posiadacze polisy; nowe konto tylko przez wycenę (numer rejestracyjny UK). Desktop 4 kroki, mobile 3 — `images/marshmallow/konto/{desktop,mobile}/`.

### Pevno — Konto

Konto Pevno prowadzi do portalu UNIQA „Moje ubezpieczenia”; rejestracja przez mObywatel (QR) lub kodem jednorazowym tylko dla klientów z polisą (PESEL + nr polisy lub rejestracyjny). Desktop 2 kroki, mobile 2 — `images/pevno/konto/{desktop,mobile}/`.

### Kiosk Polis — Konto

Konto w portalu KioskPolis24 (portal-polisy.pl): tylko logowanie e-mail + hasło, brak rejestracji — konto powstaje po zakupie polisy. Desktop 1 krok, mobile 1 — `images/kioskpolis/konto/{desktop,mobile}/`.

## Format obrazów

Zrzuty trzymamy jako WebP (quality 82, wymiary bez zmian) — PNG z przechwytywania konwertuj przed commitem, np. `cwebp -q 82 in.png -o out.webp`.

### Lemonade — Konto

Logowanie e-mailem z 6-cyfrowym kodem od Mayi (bot AI), panel „Welcome back”, wyceny w chat.lemonade.com, ustawienia tylko imię i e-mail (bez zgód marketingowych), FAQ; na mobile także menu. Desktop 7 kroków, mobile 8 — `images/lemonade/konto/{desktop,mobile}/`.

### Cleverea — Konto

Logowanie i rejestracja „Crea tu cuenta”; rejestracja wymaga telefonu, DNI/NIE, daty urodzenia i adresu, więc flow kończy się na formularzu. Desktop 3 kroki, mobile 3 — `images/cleverea/konto/{desktop,mobile}/`.

### Compare the Market — Konto

Rejestracja e-mailem + hasło, weryfikacja jednorazowym kodem z maila; panel konta, My details, puste poprzednie wyceny, publiczna strona Meerkat Rewards, preferencje marketingowe (Email/Phone/Text/Post zaznaczone), ustawienia. Desktop 9 kroków, mobile 10 (menu tylko na mobile) — `images/comparethemarket/konto/{desktop,mobile}/`.

### Hedvig — Konto (częściowy)

Logowanie ukryte — brak linku w nagłówku i menu mobilnym; strona /se/member/login tylko przez BankID (QR na desktopie, na mobile wygasła sesja). Reszta konta w aplikacji. Desktop 2 kroki, mobile 3 — `images/hedvig/konto/{desktop,mobile}/`.

### Hugo — Konto (częściowy)

Logowanie na app.withhugo.com: e-mail + hasło, telefon (kod SMS), Google lub Apple; e-mail miał już konto, więc flow pokazuje prośbę o hasło i ekran „I need help logging in”. Na mobile także menu strony. Desktop 7 kroków (także reset hasła → kod logowania mailem), mobile 5 — `images/hugo/konto/{desktop,mobile}/`.

### LINK4 — Konto (częściowy)

LINK4 nie ma konta klienta; jedyne logowanie to status szkody (/iss/logowanie) — telefon + PESEL. Menu mobilne bez pozycji konta. Desktop 1 krok, mobile 2 — `images/link4/konto/{desktop,mobile}/`.

### Lovys — Konto (częściowy)

Logowanie na go.lovys.com/fr/login: tylko „Se connecter”, „Mot de passe oublié” i „S’assurer” — brak rejestracji, konto powstaje po zakupie polisy. Menu mobilne bez linku do konta. Desktop 1 krok, mobile 2 — `images/lovys/konto/{desktop,mobile}/`.

### Mubi — Konto

Rejestracja e-mailem + hasło (lub Google/Facebook), bez zgód; aktywacja linkiem z maila. Profil z zapisanymi kalkulacjami, edycja danych, „Zmień zgody” = „Brak zgód” (brak checkboxów marketingowych), zmiana hasła; na mobile menu. Desktop 9 kroków, mobile 8 — `images/mubi/konto/{desktop,mobile}/`.

### NerdWallet — Konto (częściowy)

Po rejestracji (bez zgód marketingowych) obowiązkowy drugi składnik — Google Authenticator lub SMS, bez pominięcia; flow kończy się na tym ekranie. Desktop 2 kroki, mobile 3 (z menu) — `images/nerdwallet/konto/{desktop,mobile}/`.

### Ominimo — Konto

Rejestracja bez zgód marketingowych; logowanie bez hasła linkiem z maila. Strona konta pokazuje tylko staż konta, edycja (surowy formularz) — e-mail, hasło, język; portal wita „Cześć undefined!” (błąd). Desktop 6 kroków, mobile 5 — `images/ominimo/konto/{desktop,mobile}/`.

### Pillow — Konto (częściowy)

portal.pillow.cz: logowanie (hasło lub klucz dostępu), rejestracja „Kolemjdoucí” → formularz → imię i telefon (koniec flow), odzyskiwanie hasła i loginu; na mobile /login przekierowuje na /leave („przestarzała przeglądarka”). Desktop 6 kroków, mobile 7 — `images/pillow/konto/{desktop,mobile}/`.

### Policygenius — Konto

Logowanie bez hasła (Google lub kod z maila); panel z postępem wniosku, konto tylko z imieniem, e-mailem i telefonem — preferencje komunikacji zmienia się mailem do team@policygenius.com. Na mobile menu publiczne i menu konta. Desktop 5 kroków, mobile 5 — `images/policygenius/konto/{desktop,mobile}/`.

### Progressive — Konto (częściowy)

Logowanie User ID + hasło; założenie konta wymaga numeru polisy, nazwiska, daty urodzenia i ZIP — tylko dla posiadaczy polis, więc flow kończy się na weryfikacji. Na mobile także menu. Desktop 2 kroki, mobile 3 — `images/progressive/konto/{desktop,mobile}/`.

### Rankomat — Konto

Brak linku logowania w nagłówku — wejście tylko przez /konto. Rejestracja e-mail + hasło z jedną opcjonalną zgodą na informacje handlowe (domyślnie odznaczona; zaznaczyliśmy ją), aktywacja linkiem z maila, panel z kalkulacjami, ustawienia z opcjonalnym 2FA SMS; na mobile menu strony i menu konta. Desktop 7 kroków, mobile 9 — `images/rankomat/konto/{desktop,mobile}/`.

### Redclick — Konto (częściowy)

Logowanie na login.redclick.pl nazwą użytkownika nadaną przy zakupie polisy — brak rejestracji; odzyskanie danych wymaga PESEL/REGON (tylko posiadacze polis). Na mobile menu z „ZALOGUJ SIĘ”. Desktop 2 kroki, mobile 3 — `images/redclick/konto/{desktop,mobile}/`.
