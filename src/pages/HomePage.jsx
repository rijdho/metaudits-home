import { useState, useEffect } from "react";
import { useI18n } from "../i18n/index.jsx";
import { formatStat } from "../format.js";

// Cards are sorted by theme within each section (tools, dashboards), so same-theme cards cluster.
const THEME_ORDER = ["scholarly", "rdm", "oer", "national"];

function LockIcon({ label }) {
  return (
    <span className="lock" title={label} aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </span>
  );
}

function GitHubTag({ label }) {
  // The card is itself a link, so the tag marks the repository instead of linking to it. Icon
  // only, like the lock: with a word it pushed long theme labels onto two lines.
  return (
    <span className="gh-tag" title={label} aria-label={label}>
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
    </span>
  );
}

function AuditCard({ audit }) {
  const { t, lang, locale } = useI18n();
  const locked = audit.access === "protected";
  const description = audit.i18n?.[lang]?.description ?? audit.description;
  // A stat value is a number or figure (formatted in the interface language, src/format.js),
  // a name, or a short phrase with its own translation key (val.<text>).
  const value = (v) => (t(`val.${v}`) === `val.${v}` ? formatStat(v, locale) : t(`val.${v}`));
  return (
    <a href={audit.href} className="card tool-card fade-in">
      <div className="tool-head">
        <span className="tool-theme">{t(`theme.${audit.category}`)}</span>
        <span className="tool-flags">
          {audit.repo && <GitHubTag label={t("card.github")} />}
          {locked && <LockIcon label={t("card.locked")} />}
        </span>
      </div>
      <h2 className="tool-title">{audit.title}</h2>
      <p className="tool-desc">{description}</p>
      <dl className="tool-stats">
        {Object.entries(audit.stats).map(([key, val]) => (
          <div key={key}>
            <dt>{t(`stat.${key}`)}</dt>
            <dd>{value(val)}</dd>
          </div>
        ))}
      </dl>
      <div className="tool-foot">
        <span className="tool-badge">{audit.badge}</span>
        {audit.lastUpdated && <span className="tool-date">{t("card.updated", { date: audit.lastUpdated })}</span>}
      </div>
    </a>
  );
}

function KindSection({ id, title, subtitle, audits }) {
  if (audits.length === 0) return null;
  const sorted = [...audits].sort((a, b) => THEME_ORDER.indexOf(a.category) - THEME_ORDER.indexOf(b.category));
  return (
    <section id={id} className="access-section">
      <div className="section-head fade-in">
        <h2>{title}</h2>
        <span className="count">{audits.length}</span>
      </div>
      {subtitle && <p className="muted">{subtitle}</p>}
      <div className="tool-grid">
        {sorted.map((audit) => <AuditCard key={audit.id} audit={audit} />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { t } = useI18n();
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    fetch("./data/audits.json")
      .then((r) => (r.ok ? r.json() : []))
      .then(setAudits)
      .catch(() => {});
  }, []);

  const tools = audits.filter((a) => a.kind === "tool");
  const dashboards = audits.filter((a) => a.kind === "dashboard");

  return (
    <div className="home">
      <header className="fade-in">
        <div className="eyebrow">{t("home.eyebrow")}</div>
        <h1 className="home-title">{t("home.title")}</h1>
        <p className="lede">{t("home.lede")}</p>
        <p className="muted legend">{t("home.legend")}</p>
      </header>
      <KindSection id="tools" title={t("section.tool.title")} subtitle={t("section.tool.sub")} audits={tools} />
      <KindSection id="dashboards" title={t("section.dashboard.title")} subtitle={t("section.dashboard.sub")} audits={dashboards} />
    </div>
  );
}
