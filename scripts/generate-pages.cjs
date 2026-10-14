// Run with node scripts/generate-pages.cjs after changing concert details in script.js.
// Output is plain HTML: GitHub Pages needs no build runtime.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const write = (name, text) => {
  fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
  fs.writeFileSync(path.join(root, name), text + '\n');
};
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const script = read('script.js');
const eventSource = script.match(/const events = (\{[\s\S]*?\n  \});/);
if (!eventSource) throw new Error('Concert data not found in script.js');
const events = vm.runInNewContext('(' + eventSource[1] + ')', {}, { timeout: 1000 });
const dates = {
  hostkonsert: '2026-10-25T18:00:00+01:00',
  'afternoon-tea': '2026-11-21', opera: '2026-11-29T18:00:00+01:00',
  'opera-dynamitten': '2026-12-06T18:00:00+01:00', varkonsert: '2027-03-07', bratsjfestival: '2027-06-01'
};
for (const [key, item] of Object.entries(events)) {
  if (!dates[key] || !/^\/konserter\/[a-z0-9-]+\/$/.test(item.url || '')) {
    throw new Error(`Missing confirmed date or canonical concert URL: ${key}`);
  }
}
const concertUrl = key => events[key].url;
const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const site = 'https://asym.no';
const org = { '@type': 'MusicGroup', '@id': site + '/#organization', name: 'Asker symfoniorkester', alternateName: 'ASYM', url: site + '/', foundingDate: '1972', email: 'leder@asym.no', logo: {'@type':'ImageObject',url:site + '/favicon.png',contentUrl:site + '/favicon.png',width:512,height:512}, image:site + '/images/orchestra_piano.jpg', sameAs: ['https://www.facebook.com/profile.php?id=100062928895060'] };
const pages = [];
const navigation = `<nav class="content-nav" aria-label="Hovednavigasjon"><a class="brand" href="/" aria-label="Asker symfoniorkester hjem"><span class="brand-mark" aria-hidden="true">ASYM</span><span class="brand-text">Asker symfoniorkester</span></a><div><a href="/konserter/">Konserter</a><a href="/om/">Orkesteret</a><a href="/repertoar/">Opptak</a><a href="/bli-med/">Bli med</a></div></nav>`;
function page({url, title, heading, description, image = 'images/orchestra_piano.jpg', body, schema = [], parent}) {
  const canonical = site + url;
  const crumbs = [{name: 'Forsiden', item: site + '/'}];
  if (parent) crumbs.push({name: 'Konserter', item: site + '/konserter/'});
  crumbs.push({name: heading, item: canonical});
  const graph = [org, {
    '@type': 'WebPage', '@id': canonical + '#webpage', url: canonical, name: title,
    description, inLanguage: 'nb-NO', isPartOf: {'@id': site + '/#website'},
    about: {'@id': site + '/#organization'},
    ...(schema.some(item => item['@type'] === 'MusicEvent') ? {mainEntity: {'@id': canonical + '#event'}} : {})
  }, {'@type': 'BreadcrumbList', itemListElement: crumbs.map((item, index) => ({'@type':'ListItem', position:index + 1, ...item}))}, ...schema];
  const output = `<!DOCTYPE html>
<html lang="nb"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#142f39"><meta name="robots" content="index, follow, max-image-preview:large">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website"><meta property="og:locale" content="nb_NO">
<meta property="og:site_name" content="Asker symfoniorkester"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site}/${image}"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/styles.css?v=77"><link rel="stylesheet" href="/content-pages.css?v=2">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}, null, 2).replace(/</g, '\\u003c')}</script>
</head><body class="content-page"><a class="skip-link" href="#main">Hopp til innhold</a>
<header class="site-header">${navigation}</header>
<main id="main" class="container content-main">
<nav class="breadcrumbs" aria-label="Brødsmuler"><a href="/">Forsiden</a>${parent ? ' <span>/</span> <a href="/konserter/">Konserter</a>' : ''} <span>/</span> <span aria-current="page">${esc(heading)}</span></nav>
${body}
</main><footer class="site-footer"><div class="container footer-inner"><p>Asker symfoniorkester · Stiftet 1972 · Asker, Norge</p><div class="footer-links"><a href="/konserter/">Konserter</a><a href="/salongorkester/">Salongorkester</a><a href="mailto:leder@asym.no">Kontakt oss</a><a href="/personvern.html">Personvern</a></div></div></footer>
</body></html>`;
  const file = url.slice(1) + 'index.html';
  if (!fs.existsSync(path.join(root, file)) || read(file).trimEnd() !== output) write(file, output);
  pages.push({url, file});
}
const linkList = () => `<div class="concert-list">${Object.entries(events).map(([key, item]) => `<article><img src="/${item.image}" alt="${esc(item.imageAlt)}" loading="lazy"><div><p class="eyebrow"><time datetime="${dates[key]}">${esc(item.date)}</time></p><h2><a href="${concertUrl(key)}">${esc(item.title)}</a></h2><p>${esc(item.place)}</p><p>${esc(plain(item.description))}</p><a class="button button-ghost" href="${concertUrl(key)}">Program og praktisk informasjon</a></div></article>`).join('\n')}</div>`;
for (const [key, item] of Object.entries(events)) {
  const url = concertUrl(key);
  const description = `${item.title}, ${item.date.toLowerCase()}, ${item.place}. ${plain(item.description)}`;
  const schema = {
    '@type':'MusicEvent', '@id':site + url + '#event', url:site + url,
    name:item.title, startDate:dates[key], description:plain(item.description),
    image:[site + '/' + item.image], eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',
    eventStatus:'https://schema.org/EventScheduled',
    location:{'@type':'Place',name:item.place,address:{'@type':'PostalAddress',addressLocality:key === 'opera-dynamitten' ? 'Sætre' : 'Asker',addressCountry:'NO'}},
    organizer:{'@id':site + '/#organization'}, performer:{'@id':site + '/#organization'}
  };
  page({url, title:`${item.title} ${dates[key].slice(0,4)} | Asker symfoniorkester`, heading:item.title,
    description, image:item.image, schema:[schema], parent:true,
    body:`<article><div class="content-hero"><div><p class="eyebrow">Konsert · Asker symfoniorkester</p><h1>${esc(item.title)}</h1><p class="lead"><time datetime="${dates[key]}">${esc(item.date)}</time><br>${esc(item.place)}</p>${item.ticket ? `<a class="button button-primary" href="${esc(item.ticket)}" target="_blank" rel="noopener">Kjøp billetter</a>` : '<p>Billettinformasjon kommer.</p>'}</div><img class="content-poster" src="/${item.image}" alt="${esc(item.imageAlt)}"></div><section class="content-section"><h2>Program og medvirkende</h2>${item.description}</section><section class="content-section"><h2>Praktisk informasjon</h2><dl class="concert-facts"><div><dt>Dato</dt><dd>${esc(item.date)}</dd></div><div><dt>Sted</dt><dd>${esc(item.place)}</dd></div><div><dt>Arrangør</dt><dd>Asker symfoniorkester</dd></div></dl>${dates[key].includes('T') ? '' : '<p>Klokkeslett er ikke annonsert ennå. Denne siden oppdateres når informasjonen er klar.</p>'}<p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(item.place + ', Norge')}" target="_blank" rel="noopener">Finn ${esc(item.place)} i kart</a></p><p>Spørsmål om konserten? Kontakt <a href="mailto:leder@asym.no">leder@asym.no</a>.</p></section><section class="content-section"><h2>Flere musikalske opplevelser</h2><p><a href="/konserter/">Se alle kommende konserter</a> eller <a href="/repertoar/">lytt til opptak fra orkesteret</a>.</p></section></article>`});
}
page({url:'/konserter/',title:'Konserter i Asker 2026–2027 | Asker symfoniorkester',heading:'Konserter i Asker',description:'Se konserter med Asker symfoniorkester i Asker kirke, Østenstad kirke, Venskaben og Dynamitten. Finn datoer, program og billettlenker for 2026–2027.',schema:[{'@type':'ItemList',itemListElement:Object.keys(events).map((key,index)=>({'@type':'ListItem',position:index+1,url:site+concertUrl(key),name:events[key].title}))}],body:`<p class="eyebrow">Sesong 2026–2027</p><h1>Konserter i Asker</h1><p class="lead">Symfoniske verk, opera og operette, salongmusikk og samarbeid med solister. Her finner du orkesterets annonserte konserter i Asker og Sætre, med program og praktisk informasjon for hver konsert.</p>${linkList()}<section class="content-section"><h2>Billetter og oppdateringer</h2><p>Billettlenkene finnes på den enkelte konsertsiden. For konserter der klokkeslett, program eller billettinformasjon ikke er klart, viser vi hva som er annonsert og oppdaterer siden når flere opplysninger kommer.</p><p>Spørsmål? Skriv til <a href="mailto:leder@asym.no">leder@asym.no</a>.</p></section>`});
page({url:'/om/',title:'Om Asker symfoniorkester – historie siden 1972',heading:'Om Asker symfoniorkester',description:'Bli kjent med Asker symfoniorkester, stiftet i 1972. Les om historien, symfonisk repertoar, musikalske samarbeid og øvelser i Asker.',image:'images/about-orchestra-audience.webp',body:`<div class="content-hero"><div><p class="eyebrow">Orkesteret</p><h1>Om Asker symfoniorkester</h1><p class="lead">Et orkester for hele Asker. Vi samler musikere på tvers av generasjoner til klassiske hovedverk, lokale prosjekter og samarbeid med solister.</p><a class="button button-primary" href="/konserter/">Opplev orkesteret på konsert</a></div><img src="/images/about-orchestra-audience.webp" alt="Asker symfoniorkester foran publikum i blått scenelys"></div><section class="content-section"><h2>En del av Asker siden 1972</h2><p>Asker symfoniorkester ble stiftet i 1972. Den første konserten fant sted i 1973 på Tveter gård i Asker. Arne Hagen var orkesterets faste dirigent i nesten 30 år.</p><figure><img class="content-history" src="/images/Asker_symphonyorkester_origin.jpg" alt="Orkesterets første konsert på Tveter gård i 1973" loading="lazy"><figcaption>Første konsert · Tveter gård, Asker · 1973</figcaption></figure></section><section class="content-section"><h2>Musikk i fellesskap</h2><p>Gjennom årene har orkesteret fremført alt fra uroppførelser til sentrale symfoniske verk, med særlig vekt på den klassiske og romantiske tradisjonen. Samarbeid med solister, kor, kulturskolen og andre aktører i regionen har gjort orkesteret til en bred musikalsk møteplass.</p><p><a href="/repertoar/">Utforsk repertoar og konsertopptak</a> og <a href="/salongorkester/">bli kjent med salongorkesteret</a>.</p></section><section class="content-section"><h2>Øvelser og kontakt</h2><p>Orkesteret øver tirsdager kl. 19.00–21.45. Vil du spille med oss? <a href="/bli-med/">Les om å bli med i orkesteret</a>.</p><p>Spørsmål om konserter, medlemskap eller samarbeid kan sendes til <a href="mailto:leder@asym.no">leder@asym.no</a>.</p></section>`});
page({url:'/salongorkester/',title:'Salongorkester i Asker | Asker symfoniorkester',heading:'Salongorkesteret',description:'Asker symfoniorkesters salongorkester spiller wienerklassisk taffelmusikk, norske perler og lettere klassiske stykker. Se Afternoon Tea i Venskaben.',image:'images/salongorkester-venskaben-editorial.png',body:`<div class="content-hero"><div><p class="eyebrow">Musikk for mindre scener</p><h1>Salongorkesteret</h1><p class="lead">Asker symfoniorkester har også et eget salongorkester. Musikken er inspirert av norske kafeer, restauranter og teatersalonger fra slutten av 1800-tallet og fremover.</p></div><img src="/images/salongorkester-venskaben-editorial.png" alt="Salongorkesteret spiller tett på publikum i Venskaben"></div><section class="content-section"><h2>Repertoar og atmosfære</h2><p>Repertoaret beveger seg mellom wienerklassisk taffelmusikk, norske perler og kjente klassiske stykker i et lettere, elegant format. Salongorkesteret passer godt til mindre arrangementer der musikken skal skape nærhet, atmosfære og historisk klang.</p></section><section class="content-section"><h2>Afternoon Tea i Venskaben</h2><p>21. november 2026 inviterer orkesteret til salongmusikk, te og kaker i Venskaben. Arrangementet gir publikum anledning til å oppleve salongorkesteret i et musikalsk ettermiddagsformat.</p><a class="button button-primary" href="${concertUrl('afternoon-tea')}">Se Afternoon Tea og billetter</a></section><section class="content-section"><h2>Kontakt om samarbeid</h2><p>Har du spørsmål om salongorkesteret eller et mulig samarbeid? Kontakt styret på <a href="mailto:leder@asym.no">leder@asym.no</a>.</p><p><a href="/om/">Les om Asker symfoniorkester</a> eller <a href="/konserter/">se hele konsertprogrammet</a>.</p></section>`});
page({url:'/bli-med/',title:'Spille i orkester i Asker? | Bli med i Asker symfoniorkester',heading:'Bli med i orkesteret',description:'Vil du spille i Asker symfoniorkester? Vi øver tirsdager kl. 19.00–21.45. Kontakt styret om medlemskap og muligheten til å spille sammen med oss.',body:`<p class="eyebrow">Musikk i fellesskap</p><h1>Bli med i orkesteret</h1><p class="lead">Vil du spille symfonisk musikk i et aktivt orkester i Asker? Asker symfoniorkester samler musikere på tvers av generasjoner i et miljø for utvikling, samspill og mestring.</p><section class="content-section"><h2>Hva spiller vi?</h2><p>Orkesteret arbeider med symfoniske verk og konsertprosjekter, særlig fra den klassiske og romantiske tradisjonen. Prosjektene omfatter også samarbeid med solister, kor og andre musikalske aktører i regionen.</p><p>Se <a href="/konserter/">kommende konserter</a> og <a href="/repertoar/">opptak av repertoaret</a> for å bli kjent med musikken.</p></section><section class="content-section"><h2>Øvelser</h2><p>Vi øver tirsdager kl. 19.00–21.45. Kontakt styret for praktisk informasjon om øvelsene og muligheten til å delta.</p></section><section class="content-section"><h2>Ta kontakt med styret</h2><p>Skriv til <a href="mailto:leder@asym.no">leder@asym.no</a> om du er interessert i å bli med. Fortell gjerne hvilket instrument du spiller og litt om din musikalske bakgrunn, slik at styret kan følge opp forespørselen.</p><a class="button button-primary" href="mailto:leder@asym.no">Kontakt oss om medlemskap</a><p class="content-note"><a href="/om/">Les om orkesteret og historien</a>.</p></section>`});
const videos = [...read('index.html').matchAll(/data-video-id="([^"]+)" data-video-title="([^"]+)" data-video-date="([^"]+)"/g)];
page({url:'/repertoar/',title:'Repertoar og konsertopptak | Asker symfoniorkester',heading:'Repertoar og konsertopptak',description:'Lytt til Asker symfoniorkester: Grieg, Brahms, Dvořák, Hummel og flere konsertopptak. Utforsk orkesterets klassiske og romantiske repertoar.',body:`<p class="eyebrow">Lytt til orkesteret</p><h1>Repertoar og konsertopptak</h1><p class="lead">Asker symfoniorkester spiller sentrale symfoniske verk, med særlig vekt på den klassiske og romantiske tradisjonen. Her kan du lytte til et utvalg av orkesterets konsertopptak.</p><section class="content-section"><h2>Opptak fra konserter</h2><div class="recording-grid">${videos.map(([,id,title,date])=>`<article><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener"><img src="/images/video-thumbnails/${id}.jpg" alt="Konsertopptak: ${title}" loading="lazy"><h3>${title}</h3></a><p>${date} · Asker symfoniorkester</p></article>`).join('\n')}</div></section><section class="content-section"><h2>Fra symfonier til solistkonserter</h2><p>Opptakene omfatter blant annet Griegs Peer Gynt-suiter, Dvořáks symfoni nr. 8, Brahms' Ungarsk dans nr. 5 og Hummels trompetkonsert. De gir et innblikk i orkesterets arbeid med både symfonisk repertoar og samarbeid med solister.</p><p>På det annonserte konsertprogrammet finner du også Tsjaikovskij og Bruch, opera- og operetteperler og Beethovens trippelkonsert. <a href="/konserter/">Se programmet for kommende konserter</a>.</p></section>`});
const urls = [{url:'/',file:'index.html'}, {url:'/personvern.html',file:'personvern.html'}, ...pages];
// File mtimes preserve each page's actual content-change date across regeneration.
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({url,file})=>`  <url><loc>${site + url}</loc><lastmod>${new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Oslo'}).format(fs.statSync(path.join(root,file)).mtime)}</lastmod></url>`).join('\n')}\n</urlset>`);
console.log(`Generated ${pages.length} pages; sitemap contains ${urls.length} canonical URLs.`);
