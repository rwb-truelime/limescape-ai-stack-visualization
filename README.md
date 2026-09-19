# Limescape — Een fundament dat staat

Een interactieve klantpresentatie over verantwoord AI-gebruik met Limescape. De piramide verbindt een stevig fundament met praktische waarde in het dagelijkse werk. Vormgeving: een rustige charcoal-interface met lime-accenten en een piramide in zachte slate-, sage-, zand-, roze- en limetinten.

## Openen

Open **`index.html`** rechtstreeks in een moderne browser. Er is geen buildstap nodig. Voor de 3D-weergave haalt de browser Three.js **0.170.0** op via jsDelivr; daarvoor is internettoegang nodig. De lokale scripts gebruiken bewust geen module-imports van lokale bestanden, zodat dubbelklikken ook werkt.

Optioneel kun je de map via een lokale webserver bekijken:

```fish
python3 -m http.server 8080
```

Open vervolgens <http://localhost:8080>.

Zonder internet of WebGL verschijnt een interactieve SVG-weergave. Alle lagen, teksten en navigatie blijven beschikbaar. Poppins en Inter worden via Google Fonts geladen, met systeemlettertypen als offline fallback. Dit is een zelfstandige presentatie.

## Laagvolgorde

Van fundament naar top:

1. Goed geregeld
2. Jouw omgeving
3. Jouw kennis
4. Inzicht & verantwoording
5. Jouw werk

De volgorde geldt voor het 3D-model, de SVG-fallback, labels, navigatie, informatiepanelen en fullscreen verdiepingen.

## Bediening

- **Klik of tik op een laag:** licht de laag uit en open de bijbehorende informatie.
- **Laag 01 (Goed geregeld):** opent een verhaal over wetgeving, veiligheid, privacy en kwaliteitsborging, met TrueLime’s ISO-certificeringen en een officiële bronlink.
- **Laag 02 (Jouw omgeving):** toont SaaS in Microsoft Azure, Private SaaS bij jouw cloudprovider en volledig self-hosted SaaS in je eigen omgeving.
- **Laag 04 (Inzicht & verantwoording):** verbindt uitlegbare antwoorden, toetsbare kwaliteit en onderbouwing voor beleid, toezicht en wetgeving met de afspraken uit het fundament.
- **Laag 05 (Jouw werk):** opent een klantgericht verhaal over praktische ondersteuning.
- **Verdiepingen:** bovenaan wissel je tussen de vier verhalen. **Terug naar de piramide / Escape** sluit de verdieping; **Lees meer** opent deze opnieuw vanuit het informatiepaneel.
- **Hover over het model:** pauzeer de langzame rotatie. Een geselecteerde laag blijft stil staan.
- **Laagknoppen:** dezelfde functionaliteit via toetsenbord, touch of schermlezer.
- **Pauzeknop:** pauzeer of hervat automatische rotatie. Bij een actieve laag brengt hervatten je terug naar het overzicht.
- **Uitvouwen:** maak meer ruimte tussen de vijf lagen.
- **Herstellen / Escape:** keer terug naar het overzicht.
- **Waarom een piramide?:** open de uitleg over de beeldspraak in een toegankelijk dialoogvenster.

De systeemvoorkeur `prefers-reduced-motion` schakelt rotatie en overgangsanimaties uit. Scrollen op touchscreens blijft beschikbaar. Als het tabblad verborgen is, wordt de renderlus gepauzeerd. De weergave is begrensd op 30 beelden per seconde en rendert niet door wanneer het model volledig stilstaat.

Doorlopende tekst is standaard 18 px; laaglabels en hoofdknoppen zijn minimaal 16 px. Bedieningselementen hebben klikvlakken van minimaal 44 × 44 px. Op smalle schermen staan de volledige laagnamen in een lijst onder het model, vóór het informatiepaneel. De tekst wordt niet verkleind om vijf knoppen naast elkaar te passen.

## Bestanden

| Bestand | Verantwoordelijkheid |
| --- | --- |
| `index.html` | Pagina, officieel Limescape-logo, lokale SVG-iconen en dialoog |
| `assets/limescape.svg` | Officieel vectorlogo, lokaal opgeslagen |
| `theme.css` | Herbruikbare Limescape-kleurtokens, inclusief de vijf modelkleuren |
| `BRAND.md` | Websitebronnen, kleurtemplate, typografie en gebruiksregels |
| `styles.css` | Typografie, responsive layout en transities |
| `layers.js` | De vijf titels, klantvoordelen en uitgangspunten |
| `pyramid.js` | 3D-geometrie, belichting, schaduwen, raycasting en easing |
| `app.js` | Selectie, informatiepaneel, bediening, toegankelijkheid en SVG-fallback |
| `spotlight.js` | Klantverhalen voor laag 01/02/04/05 en fullscreen dialoogtransities |
| `spotlight.css` | Schermvullende verhalen en kaarten met klantvoordelen |
| `assets/SOURCES.md` | Herkomst van logo, certificeringen en inhoudelijke claims |

## Logo en inhoud

Het logo is afkomstig van <https://limescape.ai/limescape/limescape-logo-horizontal-color-cropped.svg>. Op 19 september 2026 is gecontroleerd dat het lokale bestand identiek is aan de officiële asset. De oorspronkelijke kleuren en verhoudingen blijven behouden.

De inhoud legt de Limescape-aanpak uit in klanttaal: verantwoord werken, keuzevrijheid, eigen kennis, kwaliteit en praktische waarde. Technische productoverzichten en documentatielinks maken geen deel uit van de presentatie. Beheer, onderhoud en beveiliging worden per gekozen variant afgesproken.
