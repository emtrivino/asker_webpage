# Asker symfoniorkester nettside

Dette repoet inneholder en statisk nettside for Asker symfoniorkester med forside, konsertsider, sesongoversikt og informasjon om orkesteret. Siden er laget med ren HTML, CSS og JavaScript, uten backend og uten eksterne rammeverk.

## Forhåndsvis lokalt

Kjør en enkel lokal server fra repo-roten. Navigasjon til undersidene bruker stier fra nettstedsroten og krever HTTP-forhåndsvisning:

```bash
python3 -m http.server 8000
```

Gå deretter til <http://localhost:8000>.

## GitHub Pages

Velg enkleste rot-distribusjon:

1. Gå til **Settings → Pages** i GitHub-repoet.
2. Under **Build and deployment**, velg **Deploy from a branch**.
3. Velg branch **main**.
4. Velg folder **/ (root)**.
5. Lagre.

`index.html`, `styles.css`, `script.js` og `images/` ligger i repo-roten, så bildepunktene bruker relative stier som `images/orchestra_piano.jpg`. Ikke flytt bildene uten å oppdatere stiene i HTML-filen.

Behold `.nojekyll` i repo-roten. Nettstedet er ren HTML; markørfilen hindrer GitHub Pages i å filtrere bort filer som begynner med understrek, blant annet videominiatyren `_TFt8pRIo2k.jpg`. Videospilleren har også en direkte YouTube-lenke for nettlesere der innebygd avspilling er blokkert.

## Søk og deling

Forsiden har kanonisk URL, beskrivelse, delingsbilde og strukturerte data for orkesteret. `favicon.png` brukes som ikon i nettlesere og som foreslått ikon i søkeresultater. `robots.txt` peker til `sitemap.xml`.

`https://asym.no/` er verifisert i Google Search Console med HTML-taggen i `<head>`. Ikke fjern taggen; den holder eierskapet verifisert. Sitemapet ble sendt inn og ny indeksering av forsiden ble forespurt 1. oktober 2026. Oppdater `<lastmod>` i `sitemap.xml` når innholdet på forsiden endres vesentlig. Søkemotorene bestemmer selv når de henter og viser endringene.

IndexNow-nøkkelfilen i repo-roten brukes ved varsling av oppdaterte URL-er til søkemotorer som støtter IndexNow. Behold filnavn og innhold uendret når nye versjoner publiseres.

## Konsertsider og søk

Kjør `node scripts/generate-pages.cjs` etter endringer i konsertinformasjonen i `script.js` eller opptakslisten i `index.html`. Generatoren skriver ferdige HTML-filer og et sitemap med 13 kanoniske URL-er. GitHub Pages publiserer disse filene direkte; Node er bare nødvendig ved redigering. Rediger informasjonsartiklene i generatoren, ikke i genererte filer.

Hver annonsert konsert har egen URL under `/konserter/`, synlig program, dato, sted, billettlenke når den er kjent, og `MusicEvent`-data. Ikke finn på klokkeslett, priser, adresser eller program. Legg til nye konserter med URL i `script.js` og med bekreftet dato i generatorens datotabell, og lenk dem fra forsiden. Behold konsert-URL-ene som arkiv etter at konsertene er gjennomført; oppdater sesongoversikten slik at den bare viser kommende konserter.

`/om/` og `/repertoar/` gjeninnfører nyttig innhold på to gamle rutestammer. Gamle PDF-er under `/onewebmedia/`, medlemsområdet og den gamle kontakt-URL-en skal ikke legges i sitemapet uten at de faktisk er gjenopprettet. Bruk HTTP 301 fra gamle sider til tilsvarende nytt innhold hvis hosting senere støtter det; ikke send alle gamle PDF-er til forsiden. GitHub Pages støtter ikke egne serverregler for slike omdirigeringer.

Alle nyttige sider kan leses uten JavaScript. Robots.txt tillater offentlig innhold for søkemotorer og andre roboter som følger robots-reglene. HTML, tydelig kildeidentitet, kanoniske URL-er, interne lenker og strukturerte data hjelper også forskningsverktøy som leser nettet. Dette garanterer ikke indeksering, rangering eller omtale i AI-svar.

Etter publisering: sjekk at sitemap-URL-ene svarer 200, test konsertdata i Googles Rich Results Test, og inspiser forsiden, sesongoversikten og konsertsidene i Search Console. Sitemapet er allerede registrert som `/sitemap.xml`; Google kan hente den oppdaterte listen på nytt. Lokal klargjøring betyr ikke at sidene allerede er publisert eller indeksert.
