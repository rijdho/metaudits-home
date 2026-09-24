# metaudits-home

The front page of **Metaudits**, the metadata audits family: one card per audit of how completely and how usefully research
is described in the registries it passes through (DataCite, Crossref, ORCID, OpenAlex, repositories).

🔗 **Live:** https://rijdho.github.io/metaudits-home/

Available in **English, German and Spanish** (auto-detected, switchable).

## What is here

```
src/main.jsx            the house shell: rail, command bar, footer
src/pages/HomePage.jsx  the cards, in two sections: tools and dashboards
src/i18n/               en.js (source of truth), es.js, de.js
src/house/              an exact copy of rijdho/house-style: never edit, run `npm run sync-house`
src/app.css             styles for this page only
public/data/audits.json one entry per tool, with its description in each language
tests/                  catalogues in step; every card complete in every language; house copy intact
```

The page has two sections. **Tools** are interactive: the visitor brings the input (a repository,
an institution, their own answers). **Dashboards** show an audit already done, to explore. A lock
marks a password-protected page. A logo says where the page is served: GitHub Pages (its source
is public) or Cloudflare Pages. Where a tool declares a licence, its short names close the card.

To add or change one, edit `public/data/audits.json`: `id`, `kind` (`tool` or `dashboard`),
`category`, `access` (`open` or `protected`), `title`, `badge`, `description` (English),
`i18n.es.description`, `i18n.de.description`, `href` (absolute), `host` (`github` or `cloudflare`, checked
against `href`), `repo`, `license` and `version` (only where they exist), and `lastUpdated`. The tests say what is missing.

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

Code: [Apache-2.0](LICENSE), copyright 2026 Ricardo Hartley Belmar. The texts (tool descriptions in `public/data/audits.json` and the catalogues):
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). [`NOTICE`](NOTICE) carries both, and the
font's licence; a derivative keeps it. Until 2026-09-24 the code was under MIT, and a copy taken
then keeps those terms.

By [Ricardo Hartley Belmar](https://rijdho.github.io) (ORCID
[0000-0001-5058-9309](https://orcid.org/0000-0001-5058-9309)).
