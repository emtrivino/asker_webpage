# Asker symfoniorkester nettside

Dette repoet inneholder en statisk én-sides nettside for Asker symfoniorkester. Siden er laget med ren HTML, CSS og JavaScript, uten backend og uten eksterne rammeverk.

## Forhåndsvis lokalt

Åpne `index.html` direkte i nettleseren, eller kjør en enkel lokal server fra repo-roten:

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

## Søk og deling

Forsiden har kanonisk URL, beskrivelse, delingsbilde og strukturerte data for orkesteret. `favicon.png` brukes som ikon i nettlesere og som foreslått ikon i søkeresultater. `robots.txt` peker til `sitemap.xml`.

Oppdater `<lastmod>` i `sitemap.xml` når innholdet på forsiden endres vesentlig. Etter publisering kan eieren sende `https://asym.no/sitemap.xml` til Google Search Console og be om ny indeksering av `https://asym.no/` via URL-inspeksjon. Søkemotorene bestemmer selv når de henter og viser endringene.
