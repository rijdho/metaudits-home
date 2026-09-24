import { useState, useEffect } from "react";
import { useI18n } from "../i18n/index.jsx";
import { formatStat } from "../format.js";
import { HOST_ICONS } from "../hostIcons.js";

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

function HostMark({ host, label }) {
  // Where the page is served: GitHub Pages (its source is public there) or Cloudflare Pages.
  // The card is itself a link, so the mark only names the host.
  return (
    <span className={`host-mark host-${host}`} title={label} aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={HOST_ICONS[host]} /></svg>
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
    <a href={audit.href} className={`card tool-card fade-in${locked ? " is-locked" : ""}`}>
      <div className="tool-head">
        <span className="tool-theme">{t(`theme.${audit.category}`)}</span>
        <span className="tool-flags">
          <HostMark host={audit.host} label={t(`card.host.${audit.host}`)} />
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
      {/* Always present, so the footers of neighbouring cards line up; empty where no licence is declared. */}
      <p className="tool-license" title={audit.license ? t("card.license") : undefined} aria-hidden={!audit.license}>
        {audit.license || "\u00a0"}
      </p>
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
