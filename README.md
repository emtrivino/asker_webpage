# Asker Symfoniorkester nettside

Dette repoet inneholder en statisk én-sides nettside for Asker Symfoniorkester. Siden er laget med ren HTML, CSS og JavaScript, uten backend og uten eksterne rammeverk.

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
