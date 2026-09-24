# metaudits-home

The front page of **Metadata Audits**: one card per audit of how completely and how usefully research
is described in the registries it passes through (DataCite, Crossref, ORCID, OpenAlex, repositories).

🔗 **Live:** https://rijdho.github.io/metaudits-home/

Available in **English, German and Spanish** (auto-detected, switchable).

## What is here

```
src/main.jsx            the house shell: rail, command bar, footer
src/pages/HomePage.jsx  the cards, grouped into open and password-protected tools
src/i18n/               en.js (source of truth), es.js, de.js
src/house/              an exact copy of rijdho/house-style: never edit, run `npm run sync-house`
src/app.css             styles for this page only
public/data/audits.json one entry per tool, with its description in each language
tests/                  catalogues in step; every card complete in every language; house copy intact
```

To add or change a tool, edit `public/data/audits.json`: an `id`, `category`, `access` (`open` or
`protected`), `title`, `badge`, `description` (English), `i18n.es.description`, `i18n.de.description`,
`href`, `stats` and `lastUpdated`. The tests say what is missing.

## Running it

```bash
npm install
npm run dev
npm test
```

The page is published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`,
after the tests pass. The tools themselves live on metaudits.rijdho.org, so every card links there
with an absolute URL (a test enforces it), and the root of metaudits.rijdho.org redirects here.
Nothing is loaded from another origin: the fonts are self-hosted, and a Content-Security-Policy in
`index.html` enforces it.

## License

Code: [MIT](LICENSE). The texts (tool descriptions in `public/data/audits.json` and the catalogues):
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

By [Ricardo Hartley Belmar](https://rijdho.github.io) (ORCID
[0000-0001-5058-9309](https://orcid.org/0000-0001-5058-9309)).
