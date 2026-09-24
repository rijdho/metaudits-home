/**
 * Stat values on the cards, in the interface language.
 *
 * audits.json keeps values as they are read aloud in English: 60921, "1.32M", "835K+",
 * "46.9%", "3+". A value of that shape is parsed back to a number and formatted for the
 * locale (46,9 % in German, 1,32 M in Spanish). Anything else ("2015-2025", "v1.7.1",
 * "Chile") is returned unchanged. English gets the value as written, which is already its
 * form, and Intl's en-GB compact style would lower-case it (1.32m).
 */
const SHAPE = /^(\d+(?:\.\d+)?)(%|K|M)?(\+)?$/;
const SCALE = { K: 1e3, M: 1e6 };

export function formatStat(v, locale) {
  if (typeof v === "number") return v.toLocaleString(locale);
  const m = SHAPE.exec(String(v));
  if (!m || locale.startsWith("en")) return v;
  const [, num, unit, plus = ""] = m;
  const x = Number(num);
  const decimals = (num.split(".")[1] || "").length;
  if (unit === "%") {
    return new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: decimals,
      maximumFractionDigits: decimals }).format(x / 100) + plus;
  }
  if (unit) {
    return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: decimals })
      .format(x * SCALE[unit]) + plus;
  }
  return x.toLocaleString(locale) + plus;
}
