import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage";
import { LangProvider, useI18n, LANGS } from "./i18n/index.jsx";
import "./house/house.css";
import "./app.css";

const THEME_KEY = "ma-theme";
const REPO = "https://github.com/rijdho/metaudits-home";
// The concept DOI, once archived on Zenodo; the footer shows it only when set.
const DOI = null;

function readTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}

const Sep = () => <span className="sep" aria-hidden="true">·</span>;

function App() {
  const { t, tr, lang, setLang } = useI18n();
  // No stored choice: follow the OS preference, as house.css does before this runs.
  const [theme, setTheme] = useState(() => readTheme()
    || (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  const [railOpen, setRailOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* storage blocked */ }
  }, [theme]);

  const nav = [
    { href: "#open", step: "OP", key: "rail.open" },
    { href: "#protected", step: "PW", key: "rail.protected" },
  ];

  return (
    <div className={`app${railOpen ? " rail-open" : ""}`}>
      <aside className="rail">
        <a className="brand-mark" href="./">
          <span className="brand-glyph" style={{ "--glyph": "'MA'" }} aria-hidden="true" />
          <span>
            <p className="brand-name">{t("app.title")}</p>
            <p className="brand-sub">rijdho.github.io</p>
          </span>
        </a>
        <nav aria-label={t("rail.tools")}>
          <div className="nav-label">{t("rail.tools")}</div>
          {nav.map((item) => (
            <a key={item.href} className="nav-item" href={item.href} onClick={() => setRailOpen(false)}>
              <span className="nav-step" aria-hidden="true">{item.step}</span>
              {t(item.key)}
            </a>
          ))}
        </nav>
        <nav aria-label={t("rail.elsewhere")}>
          <div className="nav-label">{t("rail.elsewhere")}</div>
          <a className="nav-item" href="https://rijdho.github.io">
            <span className="nav-step" aria-hidden="true">RH</span>
            {t("rail.site")}
          </a>
        </nav>
        <div className="rail-foot">
          {tr("rail.credits")}<br />
          {t("footer.license")}<br />
          {tr("footer.source")}
        </div>
      </aside>
      <button className="rail-backdrop" aria-label={t("top.closeMenu")} tabIndex={-1} onClick={() => setRailOpen(false)} />

      <div className="main-col">
        <header className="cmdbar">
          <button className="menu-btn" aria-label={t("top.menu")} onClick={() => setRailOpen(true)}>
            <svg viewBox="0 0 24 24" strokeLinecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <span className="cmd-title">{t("app.title")}</span>
          <span className="cmd-spacer" />
          <div className="langs" role="group" aria-label={t("app.language")}>
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} aria-current={lang === l.code} title={l.label}>
                {l.short}
              </button>
            ))}
          </div>
          <a className="ghost-btn" href={REPO} target="_blank" rel="noopener">{t("top.source")} ↗</a>
          <button className="icon-btn" onClick={() => setTheme((v) => (v === "dark" ? "light" : "dark"))}
            title={t("app.theme")} aria-label={t("app.theme")}>
            {theme === "dark"
              ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>}
          </button>
        </header>

        <main className="content">
          <div className="content-inner">
            <HomePage />
          </div>
        </main>

        <footer className="site-foot">
          {tr("footer.by")}<Sep />{t("footer.license")}<Sep />{tr("footer.source")}
          {DOI && <><Sep /><a href={`https://doi.org/${DOI}`}>DOI {DOI}</a></>}
        </footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
);
