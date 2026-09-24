import { useState, useEffect } from "react";
import { useI18n } from "../i18n/index.jsx";

// Cards are sorted by theme within each access block, so same-theme cards cluster.
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

function AuditCard({ audit }) {
  const { t, n, lang } = useI18n();
  const locked = audit.access === "protected";
  const description = audit.i18n?.[lang]?.description ?? audit.description;
  // A stat value is a number (formatted in the interface language), a name, or a short phrase
  // with its own translation key (val.<text>).
  const value = (v) => (typeof v === "number" ? n(v) : t(`val.${v}`) === `val.${v}` ? v : t(`val.${v}`));
  return (
    <a href={audit.href} className="card tool-card fade-in">
      <div className="tool-head">
        <span className="tool-theme">{t(`theme.${audit.category}`)}</span>
        {locked && <LockIcon label={t("card.locked")} />}
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

function AccessSection({ id, title, subtitle, audits }) {
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

  const open = audits.filter((a) => a.access !== "protected");
  const protectedTools = audits.filter((a) => a.access === "protected");

  return (
    <div className="home">
      <header className="fade-in">
        <div className="eyebrow">{t("home.eyebrow")}</div>
        <h1 className="home-title">{t("home.title")}</h1>
        <p className="lede">{t("home.lede")}</p>
      </header>
      <AccessSection id="open" title={t("section.open.title")} subtitle={t("section.open.sub")} audits={open} />
      <AccessSection id="protected" title={t("section.protected.title")} subtitle={t("section.protected.sub")} audits={protectedTools} />
    </div>
  );
}
