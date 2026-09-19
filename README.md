# Limescape AI-stack

Een responsive, interactieve architectuurviewer voor Limescape in HTML, CSS en JavaScript. De Three.js-piramide toont vijf lagen, van governance als fundament tot de applicatielaag aan de top. Vormgeving: een rustige charcoal-interface met lime-accenten en een piramide in zachte slate-, sage-, zand-, roze- en limetinten.

## Openen

Open **`index.html`** rechtstreeks in een moderne browser. Er is geen buildstap nodig. Voor de 3D-weergave haalt de browser Three.js **0.170.0** op via jsDelivr; daarvoor is internettoegang nodig. De lokale scripts gebruiken bewust geen module-imports van lokale bestanden, zodat dubbelklikken ook werkt.

Optioneel kun je de map via een lokale webserver bekijken:

```fish
python3 -m http.server 8080
```

Open vervolgens <http://localhost:8080>.

Zonder internet of WebGL verschijnt een interactieve SVG-weergave. Alle lagen, teksten en navigatie blijven beschikbaar. Poppins en Inter worden via Google Fonts geladen, met systeemlettertypen als offline fallback. Deze viewer maakt geen verbinding met de beschreven AI-infrastructuur.

## Laagvolgorde

Van fundament naar top:

1. Governance
2. Infrastructuur
3. Data & intelligentie
4. Evals & observability
5. Applicatie & orkestratie

De volgorde geldt voor het 3D-model, de SVG-fallback, labels, navigatie, informatiepanelen en fullscreen verdiepingen.

## Bediening

- **Klik of tik op een laag:** licht de laag uit en open de bijbehorende informatie.
- **Laag 01 (Governance):** opent een schermvullend verhaal over compliance, security-by-design, privacy-by-design en quality assurance, met de ISO 9001- en ISO 27001-certificeringen van TrueLime en een officiële bronlink. Vanuit het informatiepaneel kun je deze opnieuw openen via **Bekijk onze governance-aanpak**.
- **Laag 04 (Evals) / 05 (Applicatie):** zoomt door naar een schermvullende praatplaat met productlogo’s en korte tags. Bovenaan wissel je tussen de drie verdiepingen; **Terug naar de piramide / Escape** sluit de verdieping. Vanuit het informatiepaneel kun je deze opnieuw openen via **Bekijk de oplossingen**.
- **Productlogo’s:** klik op een kaart om officiële documentatie in een nieuw tabblad te openen.
- **Hover over het model:** pauzeer de langzame rotatie. Een geselecteerde laag blijft stil staan.
- **Laagknoppen:** dezelfde functionaliteit via toetsenbord, touch of schermlezer.
- **Pauzeknop:** pauzeer of hervat automatische rotatie. Bij een actieve laag brengt hervatten je terug naar het overzicht.
- **Uitvouwen:** maak meer ruimte tussen de vijf lagen.
- **Herstellen / Escape:** keer terug naar het overzicht.
- **Over dit model:** open de uitleg in een toegankelijk dialoogvenster.

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
| `layers.js` | De vijf titels, verantwoordelijkheden, technologieën en ontwerpprincipes |
| `pyramid.js` | 3D-geometrie, belichting, schaduwen, raycasting en easing |
| `app.js` | Selectie, informatiepaneel, bediening, toegankelijkheid en SVG-fallback |
| `spotlight.js` | Governance-verhaal voor laag 01, productinhoud voor laag 04/05 en fullscreen dialoogtransities |
| `spotlight.css` | Schermvullende praatplaten, gelijkwaardige logokaarten en grote tags |
| `assets/SOURCES.md` | Herkomst van productlogo’s, functiebronnen en licentieonderscheid |

## Logo en inhoud

Het logo is afkomstig van <https://limescape.ai/limescape/limescape-logo-horizontal-color-cropped.svg>. Op 19 september 2026 is gecontroleerd dat het lokale bestand identiek is aan de officiële asset. De oorspronkelijke kleuren en verhoudingen blijven behouden.

De inhoud beschrijft een referentiearchitectuur en mogelijke technologieën, geen inventaris van gegarandeerd ingebouwde Limescape-integraties. Dit is een visualisatie: er worden geen AI-systemen aangestuurd, auditgegevens verzameld of compliancecontroles uitgevoerd.
