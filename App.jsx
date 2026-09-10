import React, { useState, useEffect, useMemo } from "react";
import {
  Search, ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, Newspaper,
  LayoutDashboard, LogOut, Plus, Trash2, Pencil, X, CheckCircle2,
  XCircle, Lock, ArrowRight, Radar, FileText, ChevronRight, Menu,
  LogIn, Bell, UserCircle2, Activity, Mail, Eye, EyeOff, AlertOctagon,
  ArrowUpDown, Scale, ExternalLink, SlidersHorizontal, DollarSign, Globe, Sparkles, BarChart3, Sun, Moon, MessageCircle, Send
} from "lucide-react";

/* ---------------------------------------------------------
   CONFIG & DESIGN TOKENS

--------------------------------------------------------- */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const C = {
  ink: "var(--c-ink)",
  surface: "var(--c-surface)",
  surfaceHi: "var(--c-surface-hi)",
  surfaceHover: "var(--c-surface-hov)",
  paper: "var(--c-paper)",
  paperDim: "var(--c-paper-dim)",
  muted: "var(--c-muted)",
  verified: "var(--c-verified)",
  verifiedDim: "var(--c-verified-dim)",
  alert: "var(--c-alert)",
  alertDim: "var(--c-alert-dim)",
  amber: "var(--c-amber)",
  amberDim: "var(--c-amber-dim)",
  line: "var(--c-line)",
  lineStrong: "var(--c-line-strong)",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

// Initial seed data if PostgreSQL is booting or offline
const initialBrokers = [
  { id: "b1", name: "Solaris Prime", years: 16, score: 9.4, regulator: "FCA, ASIC, FSCA", license: "UK-771102", country: "United Kingdom", type: "ECN", min_deposit: 100, max_leverage: "1:500", flags: [], licenseStatus: "Regulated", subScores: { license: 9.6, business: 9.2, risk: 9.8, software: 9.0 }, tradingEnv: "AAA", fieldSurvey: "Physical office verified in London. Operations align with regulatory filings.", userRating: 4.8, reviews: [{user: "TraderJohn", rating: 5, text: "Excellent spreads and fast execution."}, {user: "FXPro99", rating: 4, text: "Good broker, but support can be slow sometimes."}] },
  { id: "b2", name: "Vantage Global", years: 12, score: 9.1, regulator: "ASIC, FCA", license: "MM-208841", country: "Australia", type: "ECN", min_deposit: 50, max_leverage: "1:500", flags: [], licenseStatus: "Regulated", subScores: { license: 9.4, business: 9.0, risk: 9.1, software: 8.9 }, tradingEnv: "AA", fieldSurvey: "Verified presence in Sydney. Excellent execution speeds recorded.", userRating: 4.6, reviews: [{user: "AussieTrader", rating: 5, text: "Never had an issue with withdrawals."}] },
  { id: "b3", name: "Halcyon Capital", years: 9, score: 8.6, regulator: "CySEC", license: "CY-118820", country: "Cyprus", type: "STP", min_deposit: 200, max_leverage: "1:30", flags: [], licenseStatus: "Regulated", subScores: { license: 8.8, business: 8.5, risk: 8.9, software: 8.2 }, tradingEnv: "A", fieldSurvey: "Office located in Limassol. Standard STP execution models confirmed.", userRating: 4.2, reviews: [{user: "EuroTrade", rating: 4, text: "Reliable, but leverage is too low for me."}] },
  { id: "b4", name: "Northbridge FX", years: 4, score: 5.2, regulator: "Offshore (SVG)", license: "SVG-33211", country: "St. Vincent", type: "Market Maker", min_deposit: 10, max_leverage: "1:1000", flags: ["Offshore registration"], licenseStatus: "Offshore Regulatory", subScores: { license: 4.5, business: 5.5, risk: 4.8, software: 6.0 }, tradingEnv: "C", fieldSurvey: "No physical office found at registered address. Virtual mailbox only.", userRating: 2.5, reviews: [{user: "RiskTaker", rating: 1, text: "They widened spreads during news and wiped my account."}] },
  { id: "b5", name: "Copperline Trade", years: 2, score: 4.1, regulator: "Offshore (Vanuatu)", license: "VU-44092", country: "Vanuatu", type: "Market Maker", min_deposit: 20, max_leverage: "1:2000", flags: ["Frequent withdrawal delays"], licenseStatus: "Suspicious", subScores: { license: 3.5, business: 4.2, risk: 3.8, software: 4.9 }, tradingEnv: "D", fieldSurvey: "Unable to verify physical operations. High incidence of slippage reported.", userRating: 1.8, reviews: [{user: "AngryClient", rating: 1, text: "Pending withdrawal for 2 months. Stay away!"}] },
  { id: "b6", name: "Reef Markets", years: 1, score: 2.8, regulator: "Unregistered", license: "—", country: "Unknown", type: "Unknown", min_deposit: 250, max_leverage: "1:500", flags: ["No physical registry", "Open dispute cases"], licenseStatus: "Unregulated Clone", subScores: { license: 1.0, business: 2.5, risk: 1.5, software: 3.0 }, tradingEnv: "F", fieldSurvey: "Entity is a suspected clone. Warning issued by multiple regulators.", userRating: 1.0, reviews: [{user: "Scammed123", rating: 1, text: "This is a scam. They took my money and blocked my number."}] },
];

const initialExposures = [
  { id: "e1", brokerName: "Reef Markets", title: "Withdrawal pending $3,400 for 4 weeks", text: "Requested a withdrawal on August 2. Support account managers deleted their Telegram after transfer request.", date: "2026-08-19", amount: 3400, status: "published" },
  { id: "e2", brokerName: "Copperline Trade", title: "Account wiped with arbitrary slippage", text: "Turned $600 into $2,800 on EUR/USD. Spreads artificially jumped 45 pips during calm session and stopped out account.", date: "2026-08-16", amount: 2200, status: "published" },
];

const initialNews = [
  { id: "n1", title: "Global Regulatory Coalition Tightens Unregulated Broker Blocking", summary: "Financial regulators announce unified DNS filtering for unverified financial institutions targeting retail investors.", category: "Regulation", date: "2026-08-20" },
  { id: "n2", title: "Decoding Tier-1 vs Offshore Licensures: An Investor Guide", summary: "Understand the genuine legal and compensation differences between UK FCA, Australian ASIC, and offshore entities.", category: "Education", date: "2026-08-18" },
];

const marketPairs = [
  { symbol: "EUR/USD", price: 1.1663, change: 2.85, spread: 0.1, volume: "53.8M", status: "bullish" },
  { symbol: "GBP/USD", price: 1.3347, change: -0.04, spread: 0.2, volume: "31.2M", status: "neutral" },
  { symbol: "USD/JPY", price: 159.06, change: 11.16, spread: 0.3, volume: "42.5M", status: "bullish" },
  { symbol: "XAU/USD", price: 4625.55, change: 36.02, spread: 1.8, volume: "19.1M", status: "bullish" },
  { symbol: "BTC/USD", price: 61420.4, change: 4.18, spread: 14.2, volume: "12.7M", status: "bullish" },
  { symbol: "USD/CHF", price: 0.8262, change: 0.04, spread: 0.1, volume: "18.4M", status: "neutral" },
];

const leaderboardMetrics = [
  { label: "Total Margin", value: "19.06%", leader: "Vantage Global" },
  { label: "Trading Activity", value: "14.61%", leader: "Exness" },
  { label: "Lots Traded", value: "4.21%", leader: "FBS" },
  { label: "Profitable Orders", value: "15.60%", leader: "XM" },
  { label: "Net Deposit", value: "90.07%", leader: "Axitrader" },
  { label: "Spread Cost", value: "17.48", leader: "Exness" },
];

const scamAlerts = [
  { id: "sa1", broker: "Reef Markets", country: "Unknown", type: "Clone Fraud", severity: "Critical", description: "Entity impersonating a licensed broker. Multiple regulators have issued cease-and-desist orders.", date: "2026-09-01", regulator: "FCA, ASIC" },
  { id: "sa2", broker: "TrustFX Global", country: "Comoros", type: "Withdrawal Theft", severity: "High", description: "Over 140 users report frozen accounts with no communication from broker since July 2026.", date: "2026-08-28", regulator: "None" },
  { id: "sa3", broker: "Copperline Trade", country: "Vanuatu", type: "Spread Manipulation", severity: "High", description: "Systematic spread widening during high-volatility sessions confirmed by independent audit.", date: "2026-08-22", regulator: "VFSC" },
  { id: "sa4", broker: "BlueChip FX", country: "Marshall Islands", type: "Unlicensed Operation", severity: "Medium", description: "Operating without any financial services license. Customer funds not segregated.", date: "2026-08-15", regulator: "None" },
];

const fieldSurveys = [
  { id: "fs1", broker: "Solaris Prime", country: "United Kingdom", address: "1 Canada Square, Canary Wharf, London", score: 9.4, date: "2026-07-15", findings: "Physical office verified. Staff present. Regulatory certificates displayed. Trading servers operational.", status: "Verified" },
  { id: "fs2", broker: "Vantage Global", country: "Australia", address: "Level 29, 31 Market Street, Sydney NSW", score: 9.1, date: "2026-07-10", findings: "Office confirmed. ASIC registration plaque visible. Support staff available. Fully operational.", status: "Verified" },
  { id: "fs3", broker: "Northbridge FX", country: "St. Vincent", address: "Suite 305, Griffith Corporate Centre, SVG", score: 5.2, date: "2026-08-01", findings: "Address leads to a virtual office mailbox service. No staff found. Phone lines disconnected.", status: "Suspicious" },
  { id: "fs4", broker: "Reef Markets", country: "Unknown", address: "Registration address unverifiable", score: 2.8, date: "2026-08-10", findings: "No physical presence found. Website domain registered 3 months ago. Regulatory numbers are forged.", status: "Fraudulent" },
];

const forumPosts = [
  { id: "fp1", user: "TraderJohn", avatar: "TJ", title: "Best ECN brokers with tight spreads in 2026?", body: "Looking for recommendations on ECN brokers with sub-0.1 pip spreads on EUR/USD. Currently using Solaris Prime but want alternatives.", replies: 24, views: 1240, date: "2026-09-05", category: "Broker Discussion", upvotes: 47 },
  { id: "fp2", user: "FXPro99", avatar: "FX", title: "Warning: Copperline Trade spreads spiking during news", body: "Just noticed that during NFP releases, Copperline widens EUR/USD spreads to 8+ pips then immediately returns them. This is clearly manipulation.", replies: 18, views: 890, date: "2026-09-03", category: "Scam Alert", upvotes: 82 },
  { id: "fp3", user: "AussieTrader", avatar: "AT", title: "How to verify an FCA license properly", body: "Many traders just Google the broker name but that's not enough. Here's how to do a proper FCA register check step by step...", replies: 31, views: 2100, date: "2026-08-30", category: "Education", upvotes: 115 },
  { id: "fp4", user: "EuroTrade", avatar: "ET", title: "MT5 or cTrader — which do you prefer for scalping?", body: "Been using MT5 for 3 years but heard cTrader has better execution for scalping. Anyone made the switch?", replies: 42, views: 3400, date: "2026-08-27", category: "Trading Tools", upvotes: 63 },
];

const spreadCalcPairs = [
  { pair: "EUR/USD", spread: 0.1, pip_value: 10, category: "Majors" },
  { pair: "GBP/USD", spread: 0.2, pip_value: 10, category: "Majors" },
  { pair: "USD/JPY", spread: 0.3, pip_value: 9.24, category: "Majors" },
  { pair: "USD/CHF", spread: 0.1, pip_value: 11.20, category: "Majors" },
  { pair: "AUD/USD", spread: 0.3, pip_value: 10, category: "Majors" },
  { pair: "XAU/USD", spread: 1.8, pip_value: 100, category: "Metals" },
  { pair: "XAG/USD", spread: 2.5, pip_value: 50, category: "Metals" },
  { pair: "BTC/USD", spread: 14.2, pip_value: 1, category: "Crypto" },
  { pair: "ETH/USD", spread: 2.1, pip_value: 1, category: "Crypto" },
  { pair: "GBP/JPY", spread: 0.5, pip_value: 9.24, category: "Crosses" },
];

/* ---------------------------------------------------------
   DATA ADAPTER LAYER (Postgres with Local Fallback)
--------------------------------------------------------- */
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers }
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error(`[API Error ${res.status}]`, errData);
      return { error: errData.error || `API call failed with status ${res.status}` };
    }
    return await res.json();
  } catch (err) {
    console.error("[fetchAPI Error]", err);
    return null;
  }
}

function normalizeBroker(broker) {
  return {
    ...broker,
    years: broker.years ?? broker.years_active ?? 0,
    license: broker.license ?? broker.license_no ?? "—",
    type: broker.type ?? broker.account_type ?? "Unknown",
    flags: Array.isArray(broker.flags) ? broker.flags : [],
    licenseStatus: broker.licenseStatus ?? broker.license_status ?? "Regulated",
    tradingEnv: broker.tradingEnv ?? broker.trading_env ?? "AAA",
    fieldSurvey: broker.fieldSurvey ?? broker.field_survey ?? "",
    userRating: broker.userRating ?? broker.user_rating ?? 4.5,
    subScores: broker.subScores ?? broker.sub_scores ?? { license: 8.0, business: 8.0, risk: 8.0, software: 8.0 },
    reviews: Array.isArray(broker.reviews) ? broker.reviews : [],
  };
}

function normalizeExposure(exposure) {
  return {
    ...exposure,
    brokerName: exposure.brokerName ?? exposure.broker_name ?? "Unknown broker",
    text: exposure.text ?? exposure.details ?? "",
    amount: exposure.amount ?? exposure.disputed_amount ?? 0,
    date: exposure.date ?? exposure.created_at?.slice(0, 10) ?? "",
  };
}

function normalizeNews(article) {
  return {
    ...article,
    summary: article.summary ?? article.details ?? "",
    date: article.date ?? article.published_at?.slice(0, 10) ?? "",
  };
}

function normalizeSurvey(survey) {
  return {
    ...survey,
    date: survey.date ?? survey.created_at?.slice(0, 10) ?? "",
    score: Number(survey.score ?? 8.0),
  };
}

function normalizeAlert(alert) {
  return {
    ...alert,
    date: alert.date ?? alert.created_at?.slice(0, 10) ?? "",
  };
}

/* ---------------------------------------------------------
   COMPONENTS
--------------------------------------------------------- */
function Stamp({ score, alert, size = 52 }) {
  const s = alert ? "var(--c-alert)" : "var(--c-verified)";
  const bg = alert ? "var(--c-alert-dim)" : "var(--c-verified-dim)";
  const borderColor = alert ? "rgba(255,65,54,0.3)" : "rgba(0,230,118,0.3)";
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${borderColor}`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", color: s,
        background: bg, transform: "rotate(-6deg)",
        fontFamily: "'IBM Plex Mono', monospace",
        boxShadow: alert ? "0 0 12px rgba(255,65,54,0.18)" : "0 0 12px rgba(0,230,118,0.15)",
      }}
    >
      <div style={{ fontSize: size * 0.28, fontWeight: 700, lineHeight: 1 }}>{Number(score).toFixed(1)}</div>
      <div style={{ fontSize: size * 0.14, color: "var(--c-muted)", marginTop: 2 }}>/ 10</div>
    </div>
  );
}


function Badge({ children, tone = "default" }) {
  return (
    <span
      className={`badge badge-${tone}`}
      style={{
        fontSize: 11, padding: "3px 8px", borderRadius: 4,
        fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap",
        display: "inline-flex", alignItems: "center", gap: 4,
        // Default (no tone) style — others handled by .badge-reg/warn/pending CSS classes
        ...(tone === "default" && {
          color: "var(--c-paper-dim)",
          border: "1px solid var(--c-line-strong)",
          background: "transparent",
        }),
      }}
    >
      {children}
    </span>
  );
}



function GlassCard({ children, style = {}, className = "" }) {
  return (
    <div className={`glass-card-hover ${className}`} style={{
      borderRadius: 14,
      ...style
    }}>
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", type = "button", style = {}, disabled }) {
  const base = {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
    padding: "9px 18px", borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", display: "inline-flex", alignItems: "center", gap: 7,
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", opacity: disabled ? 0.4 : 1,
    letterSpacing: "0.01em",
  };
  const variants = {
    primary: {
      background: "var(--gradient-brand)", color: "#03030A",
      boxShadow: "0 4px 16px rgba(0, 230, 118, 0.25), 0 2px 4px rgba(0,0,0,0.3)"
    },
    ghost: {
      background: "transparent", color: "var(--c-paper)",
      border: `1px solid var(--c-line-strong)`
    },
    danger: {
      background: "var(--c-alert-dim)", color: "var(--c-alert)",
      border: `1px solid rgba(255,65,54,0.25)`
    },
    subtle: {
      background: "var(--c-surface-hi)", color: "var(--c-paper)",
      border: `1px solid var(--c-line-strong)`
    },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`ui-button button-${variant}`}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 6,
  color: "var(--input-color)", padding: "10px 12px", fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none",
  boxSizing: "border-box"
};

/* ---------------------------------------------------------
   NAVBAR
--------------------------------------------------------- */
function Header({ view, setView, compareList, openCompare, isLight, toggleTheme, adminAuthed, onLoginClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginHover, setLoginHover] = useState(false);
  const items = [
    { id: "home", label: "Registry" },
    { id: "brokers", label: "Brokers" },
    { id: "rankings", label: "Rankings" },
    { id: "exposure", label: "Exposures" },
    { id: "scam-alerts", label: "🚨 Scam Alerts" },
    { id: "field-survey", label: "Field Survey" },
    { id: "forum", label: "Forum" },
    { id: "market", label: "Markets" },
    { id: "news", label: "News" },
    { id: "education", label: "Education" },
    { id: "calculator", label: "Spread Calc" },
    { id: "tools", label: "EA/VPS" },
    { id: "media", label: "Live" },
    { id: "regulators", label: "Regulatory" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 60, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: `1px solid var(--c-line)`, transition: "background 0.3s ease" }}>

      <div className="ledger-header-inner" style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 22, cursor: "pointer" }} onClick={() => setView("home")}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px dashed ${C.verified}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.verified, fontSize: 13 }}>✓</div>
          LEDGER
        </div>
        <nav className={`ledger-nav ${menuOpen ? "is-open" : ""}`}>
          {items.map((it) => (
            <span
              key={it.id}
              onClick={() => { setView(it.id); setMenuOpen(false); }}
              style={{
                cursor: "pointer", color: view === it.id ? C.paper : C.paperDim,
                fontWeight: view === it.id ? 600 : 400,
                borderBottom: view === it.id ? `2px solid ${C.verified}` : "2px solid transparent",
                paddingBottom: 4, transition: "color 0.2s"
              }}
            >
              {it.label}
            </span>
          ))}
        </nav>
        <div className="ledger-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {compareList.length > 0 && (
            <Button variant="primary" onClick={openCompare} style={{ padding: "6px 12px", fontSize: 12 }}>
              <Scale size={13} /> Compare ({compareList.length})
            </Button>
          )}
        </div>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"} title={isLight ? "Switch to dark mode" : "Switch to light mode"}>
          {isLight ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Premium Login / Admin button */}
        {adminAuthed ? (
          <div className="header-admin-pill">
            <div className="header-admin-avatar">
              <UserCircle2 size={17} />
            </div>
            <span className="header-admin-label">Admin</span>
            <button
              type="button"
              className="header-admin-logout"
              onClick={onLogout}
              title="Sign out"
              aria-label="Sign out from admin"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="header-login-btn"
            id="header-login-btn"
            onClick={onLoginClick}
            aria-label="Login to admin panel"
            onMouseEnter={() => setLoginHover(true)}
            onMouseLeave={() => setLoginHover(false)}
          >
            <span className="header-login-icon-wrap">
              <UserCircle2 size={16} />
            </span>
          </button>
        )}

        <button className="mobile-menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------
   HOME VIEW
--------------------------------------------------------- */
function Home({ brokers, exposures, setView, openDetail, toggleCompare, compareList, isLight, setBrokerSearch }) {
  const [q, setQ] = useState("");
  const topThree = useMemo(() => [...brokers].sort((a, b) => b.score - a.score).slice(0, 3), [brokers]);
  const recentExposures = useMemo(() => [...exposures].filter(e => e.status === "published").slice(0, 3), [exposures]);
  const flaggedCount = brokers.filter(b => b.flags?.length > 0).length;
  const disputedTotal = exposures.reduce((total, exposure) => total + Number(exposure.amount || 0), 0);

  return (
    <div className="fade-in-up">
      <section className="home-hero tech-grid" style={{
        position: "relative", overflow: "hidden",
        padding: "110px 24px 90px",
        borderBottom: `1px solid var(--c-line)`,
        background: "var(--gradient-hero)",
        transition: "background 0.3s ease"
      }}>
        {/* Ambient glow orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div className="ambient-orb" style={{ width: 500, height: 500, background: "rgba(0,230,118,1)", top: -200, right: -100, animationDelay: "0s" }} />
          <div className="ambient-orb" style={{ width: 400, height: 400, background: "rgba(41,121,255,1)", bottom: -180, left: -80, animationDelay: "4s" }} />
          <div className="ambient-orb" style={{ width: 280, height: 280, background: "rgba(255,171,0,0.4)", top: "40%", right: "20%", animationDelay: "2s", opacity: 0.06 }} />
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Live pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "var(--c-verified)", fontSize: 11.5,
            fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
            border: `1px solid var(--c-line-accent)`,
            padding: "5px 12px", borderRadius: 24, marginBottom: 28,
            background: "var(--c-verified-dim)",
            letterSpacing: "0.04em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--c-verified)", boxShadow: "0 0 6px var(--c-verified)" }} />
            LIVE · PostgreSQL Registry · {brokers.length} Entities Indexed
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 600,
            fontSize: "clamp(38px, 5.5vw, 62px)", lineHeight: 1.02,
            maxWidth: 780, letterSpacing: "-0.02em",
            margin: "0 0 20px",
          }}>
            Audited transparency for{" "}
            <em style={{ color: "var(--c-verified)", fontStyle: "italic", position: "relative" }}>
              forex & CFD brokers.
            </em>
          </h1>
          <p style={{
            color: "var(--c-paper-dim)", fontSize: 17,
            maxWidth: 560, lineHeight: 1.65, margin: "0 0 40px",
            fontWeight: 400,
          }}>
            Cross-referencing tier-1 regulators, financial filings, and validated
            victim exposure logs to protect trader capital.
          </p>

          {/* Search bar */}
          <div style={{
            maxWidth: 680, display: "flex",
            background: "rgba(8,8,18,0.8)",
            border: `1px solid var(--c-line-strong)`,
            borderRadius: 18, overflow: "hidden",
            boxShadow: "0 24px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,230,118,0.05)",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", padding: "0 18px" }}>
              <Search size={16} color="var(--c-muted)" />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (setBrokerSearch(q), setView("brokers"))}
              placeholder="Search broker, license, or country..."
              style={{
                flex: 1, background: "transparent", border: "none",
                outline: "none", color: "var(--c-paper)",
                padding: "17px 0", fontSize: 15, fontFamily: "'Inter', sans-serif",
              }}
            />
            <button
              onClick={() => { setBrokerSearch(q); setView("brokers"); }}
              style={{
                background: "var(--gradient-brand)", color: "#03030A",
                border: "none", padding: "0 28px", fontWeight: 700,
                cursor: "pointer", transition: "opacity 0.2s",
                fontSize: 14, letterSpacing: "0.02em", fontFamily: "'Inter', sans-serif",
                margin: "8px", borderRadius: 12,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Examine
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 20, marginTop: 36, flexWrap: "wrap" }}>
            {[
              ["FCA", "Tier-1 UK"],
              ["ASIC", "Australia"],
              ["CySEC", "European"],
              ["FSCA", "South Africa"],
            ].map(([reg, region]) => (
              <div key={reg} style={{
                display: "flex", alignItems: "center", gap: 8,
                color: "var(--c-paper-dim)", fontSize: 12,
                fontFamily: "'IBM Plex Mono', monospace",
              }}>
                <span style={{ color: "var(--c-verified)", fontWeight: 700 }}>{reg}</span>
                <span style={{ color: "var(--c-muted)" }}>{region}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="telemetry-strip">
        <div className="telemetry-grid">
          {[
            { Icon: ShieldCheck, label: "Registry coverage", value: `${brokers.length} entities`, note: "Live indexed universe", variant: "" },
            { Icon: Activity, label: "Average trust score", value: `${(brokers.reduce((sum, b) => sum + Number(b.score || 0), 0) / Math.max(brokers.length, 1)).toFixed(1)} / 10`, note: "Across all records", variant: "" },
            { Icon: AlertOctagon, label: "Flagged entities", value: `${flaggedCount} requiring review`, note: "Risk signals on file", variant: "tc-alert" },
            { Icon: DollarSign, label: "Disputed capital", value: `$${disputedTotal.toLocaleString()}`, note: "Reported exposure value", variant: "tc-money" },
          ].map(({ Icon, label, value, note, variant }) => (
            <div className={`telemetry-cell ${variant}`} key={label}>
              <div className="tc-icon"><Icon size={17} color={variant === "tc-alert" ? "var(--c-alert)" : variant === "tc-money" ? "var(--c-amber)" : "var(--c-verified)"} /></div>
              <div className="tc-label">{label}</div>
              <div className="tc-value">{value}</div>
              <div className="tc-note">{note}</div>
            </div>
          ))}
        </div>
      </section>

      <AIRiskAnalyst brokers={brokers} exposures={exposures} openDetail={openDetail} />
      <AICommandDeck brokers={brokers} exposures={exposures} setView={setView} openDetail={openDetail} />

      {/* Top 3 Brokers */}
      <section style={{ padding: "72px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <div className="section-kicker"><TrendingUp size={11} /> Benchmark Leaders</div>
            <h2 className="section-heading">Top Rated Financial Institutions</h2>
            <p style={{ color: "var(--c-paper-dim)", fontSize: 14, margin: 0 }}>Sorted by independent trust scoring across all verification criteria.</p>
          </div>
          <Button variant="ghost" onClick={() => setView("rankings")}>View Leaderboard →</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {topThree.map((b) => (
            <BrokerCard key={b.id} b={b} onClick={() => openDetail(b)} onCompare={() => toggleCompare(b)} isCompared={compareList.some(x => x.id === b.id)} />
          ))}
          {!topThree.length && <div className="empty-state-panel">No broker records are currently indexed. Open Admin to add the first dossier.</div>}
        </div>
      </section>

      {/* Latest Exposure Reports */}
      <section className="exposure-band" style={{
        padding: "68px 24px",
        background: "var(--c-surface)",
        borderTop: `1px solid var(--c-line)`,
        borderBottom: `1px solid var(--c-line)`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <div className="section-kicker kicker-alert"><AlertTriangle size={11} /> High-Risk Exposure</div>
              <h2 className="section-heading">Recent Victim Complaints & Claims</h2>
            </div>
            <Button variant="ghost" onClick={() => setView("exposure")}>File a Claim →</Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 }}>
            {recentExposures.map(e => (
              <div key={e.id} style={{
                background: "var(--gradient-card)",
                border: `1px solid rgba(255,65,54,0.15)`,
                padding: 24, borderRadius: 14,
                transition: "border-color 0.2s, box-shadow 0.2s",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(el) => { el.currentTarget.style.borderColor = "rgba(255,65,54,0.3)"; el.currentTarget.style.boxShadow = "var(--shadow-md), var(--shadow-glow-alert)"; }}
              onMouseLeave={(el) => { el.currentTarget.style.borderColor = "rgba(255,65,54,0.15)"; el.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,65,54,0.3), transparent)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <Badge tone="warn">{e.brokerName}</Badge>
                  {e.amount && <span style={{ color: "var(--c-alert)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700 }}>${Number(e.amount).toLocaleString()} Disputed</span>}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{e.title}</h4>
                <p style={{ color: "var(--c-paper-dim)", fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{e.text}</p>
                <div style={{ fontSize: 10.5, color: "var(--c-muted)", fontFamily: "'IBM Plex Mono', monospace", marginTop: 16, letterSpacing: "0.06em" }}>VERIFIED DOSSIER · {e.date}</div>
              </div>
            ))}
            {!recentExposures.length && <div className="empty-state-panel">No published exposure dossiers are available yet.</div>}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div className="section-kicker"><BarChart3 size={11} /> Market Overview</div>
            <h2 className="section-heading">Live trading finance snapshot</h2>
          </div>
          <Button variant="ghost" onClick={() => setView("market")}>Open Market Pulse →</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))", gap: 14 }}>
          {marketPairs.map((pair) => {
            const isUp = Number(pair.change) >= 0;
            return (
              <div key={pair.symbol} className="market-pair-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <strong style={{ fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{pair.symbol}</strong>
                  <span style={{
                    color: isUp ? "var(--c-verified)" : "var(--c-alert)",
                    fontSize: 11, fontWeight: 700, padding: "3px 7px", borderRadius: 6,
                    background: isUp ? "var(--c-verified-dim)" : "var(--c-alert-dim)",
                  }}>{isUp ? "+" : ""}{pair.change}%</span>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>{pair.price.toLocaleString()}</div>
                <div style={{ color: "var(--c-muted)", fontSize: 11 }}>Spr {pair.spread} · {pair.volume}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div className="section-kicker"><Scale size={11} /> Mediation Center</div>
            <h2 className="section-heading">Resolved dispute activity</h2>
          </div>
          <Badge tone="reg">$72,130,288 resolved</Badge>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            ["15,696", "Resolved cases"],
            ["1,420", "Active reviews"],
            ["7.2%", "Average dispute reduction"],
            ["94.6%", "Support response rate"]
          ].map(([number, label]) => (
            <div key={label} style={{
              background: "var(--gradient-card)", border: `1px solid var(--c-line)`,
              borderRadius: 14, padding: "24px 20px",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--c-line-accent)"; e.currentTarget.style.boxShadow = "var(--shadow-md), var(--shadow-glow)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-line)"; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--c-verified)", fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>{number}</div>
              <div style={{ color: "var(--c-paper-dim)", fontSize: 13 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-ledger">
        <div className="about-ledger-intro">
          <Badge tone="reg"><Radar size={12} /> ABOUT LEDGER</Badge>
          <h2>A clearer signal in a noisy market.</h2>
          <p>Ledger turns scattered regulatory records and trader reports into a single, inspectable view before capital moves.</p>
          <div className="about-ledger-mark"><span>LEDGER</span><strong>VERIFY FIRST</strong></div>
        </div>
        <div className="about-ledger-points">
          {[
            [ShieldCheck, "Evidence-led", "Every rating starts with a license, regulator, or documented case signal."],
            [FileText, "Plain-language dossiers", "Complex broker details become comparable facts for faster decisions."],
            [Activity, "Always inspectable", "Scores, flags, and exposure history stay visible instead of hiding behind a black box."],
          ].map(([Icon, title, copy]) => (
            <div className="about-ledger-point" key={title}><div className="about-ledger-icon"><Icon size={18} /></div><div><h3>{title}</h3><p>{copy}</p></div></div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AICommandDeck({ brokers, exposures, setView, openDetail }) {
  const [selectedId, setSelectedId] = useState(brokers[0]?.id || "");
  const [priority, setPriority] = useState("risk");
  const selectedBroker = brokers.find((broker) => broker.id === selectedId) || brokers[0];
  const flagged = brokers.filter((broker) => broker.flags?.length > 0).sort((a, b) => Number(a.score) - Number(b.score));
  const pending = exposures.filter((exposure) => exposure.status === "pending");
  const focusBroker = priority === "trust" ? [...brokers].sort((a, b) => Number(b.score) - Number(a.score))[0] : flagged[0] || selectedBroker;
  const focusScore = Number(focusBroker?.score || 0);
  const confidence = brokers.length ? Math.min(98, Math.round(64 + (brokers.length * 4) + (exposures.length ? 10 : 0))) : 0;
  const signalTone = focusScore < 5 ? "critical" : focusScore < 7 ? "elevated" : "clear";
  const signals = selectedBroker ? [
    { label: "Trust score", value: `${Number(selectedBroker.score).toFixed(1)} / 10`, detail: Number(selectedBroker.score) >= 7 ? "Above review threshold" : "Below review threshold", tone: Number(selectedBroker.score) >= 7 ? "clear" : "critical" },
    { label: "Regulatory posture", value: selectedBroker.regulator || "Not recorded", detail: /offshore|unregistered/i.test(selectedBroker.regulator || "") ? "Independent verification required" : "License evidence available", tone: /offshore|unregistered/i.test(selectedBroker.regulator || "") ? "elevated" : "clear" },
    { label: "Exposure history", value: `${exposures.filter((item) => item.brokerName?.toLowerCase() === selectedBroker.name?.toLowerCase()).length} cases`, detail: pending.length ? `${pending.length} file${pending.length === 1 ? "" : "s"} awaiting triage` : "No pending triage files", tone: pending.length ? "elevated" : "clear" },
  ] : [
    { label: "Trust score", value: "Awaiting records", detail: "Add a broker to activate the radar", tone: "elevated" },
    { label: "Regulatory posture", value: "No registry data", detail: "Connect verified license records", tone: "elevated" },
    { label: "Exposure history", value: `${exposures.length} files`, detail: "Review the exposure desk for details", tone: exposures.length ? "elevated" : "clear" },
  ];

  return (
    <section className="ai-command-deck">
      <div className="ai-deck-header">
        <div>
          <Badge tone="reg"><Sparkles size={12} /> AI COMMAND DECK</Badge>
          <h2>Make the next decision legible.</h2>
          <p>Transparent heuristics turn registry evidence into a short, actionable brief.</p>
        </div>
        <div className="ai-confidence"><span>Evidence confidence</span><strong>{confidence}%</strong><i><b style={{ width: `${confidence}%` }} /></i></div>
      </div>
      <div className="ai-deck-body">
        <div className="ai-radar-panel">
          <div className="radar-sweep-effect" />
          <div className="ai-radar-orbit ai-radar-orbit-one" /><div className="ai-radar-orbit ai-radar-orbit-two" />
          <div className="ai-radar-core" style={{ background: `conic-gradient(${signalTone === "critical" ? C.alert : signalTone === "elevated" ? C.amber : C.verified} ${Math.max(focusScore * 10, 8)}%, rgba(255,255,255,.08) 0)` }}><div><strong>{focusScore.toFixed(1)}</strong><span>risk index</span></div></div>
          <div className="ai-radar-label"><span>Priority signal</span><strong className={`ai-signal-${signalTone}`}>{focusBroker ? (signalTone === "critical" ? "Escalate review" : signalTone === "elevated" ? "Verify evidence" : "Monitor record") : "Awaiting data"}</strong></div>
        </div>
        <div className="ai-deck-evidence">
          <div className="ai-deck-controls">
            <select aria-label="Select broker for AI radar" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} disabled={!brokers.length}>
              {!brokers.length && <option value="">No broker records available</option>}
              {brokers.map((broker) => <option key={broker.id} value={broker.id}>{broker.name}</option>)}
            </select>
            <div className="ai-priority-toggle"><button type="button" className={priority === "risk" ? "is-active" : ""} onClick={() => setPriority("risk")}>Risk first</button><button type="button" className={priority === "trust" ? "is-active" : ""} onClick={() => setPriority("trust")}>Trust first</button></div>
          </div>
          <div className="ai-evidence-grid">{signals.map((signal) => <div className="ai-evidence-item" key={signal.label}><span className={`ai-evidence-dot ai-evidence-dot-${signal.tone}`} /><div><small>{signal.label}</small><strong>{signal.value}</strong><p>{signal.detail}</p></div></div>)}</div>
        </div>
      </div>
      <div className="ai-deck-footer"><div><span>RECOMMENDED NEXT MOVE</span><strong>{pending.length ? "Review the exposure queue before publishing new records." : focusBroker ? `${focusBroker.name}: verify the full dossier before funding.` : "Populate the registry to unlock broker prioritization."}</strong></div><div className="ai-deck-actions">{selectedBroker && <Button variant="subtle" onClick={() => openDetail(selectedBroker)}><Eye size={14} /> Inspect dossier</Button>}<Button onClick={() => setView(pending.length ? "exposure" : "brokers")}><ArrowRight size={14} /> {pending.length ? "Open triage" : "Open registry"}</Button></div></div>
    </section>
  );
}

/* ---------------------------------------------------------
   BROKER CARD COMPONENT
--------------------------------------------------------- */
function BrokerCard({ b, onClick, onCompare, isCompared }) {
  const isFlagged = b.flags && b.flags.length > 0;
  const scoreColor = Number(b.score) >= 8 ? "var(--c-verified)" : Number(b.score) >= 5 ? "var(--c-amber)" : "var(--c-alert)";
  const scoreBg = Number(b.score) >= 8 ? "var(--c-verified-dim)" : Number(b.score) >= 5 ? "var(--c-amber-dim)" : "var(--c-alert-dim)";
  const scoreBorder = Number(b.score) >= 8 ? "rgba(0,230,118,0.3)" : Number(b.score) >= 5 ? "rgba(255,171,0,0.3)" : "rgba(255,65,54,0.3)";

  return (
    <div className={`broker-card ${isFlagged ? "flagged" : ""}`}>
      {/* Top accent line on hover (handled by CSS ::before) */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600,
              lineHeight: 1.2, margin: "0 0 4px",
            }}>{b.name}</h3>
            <div style={{
              fontSize: 11.5, color: "var(--c-muted)",
              fontFamily: "'IBM Plex Mono', monospace",
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
            }}>
              <span>{b.years}yr · {b.country}</span>
              {b.userRating && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  color: "var(--c-amber)",
                  background: "var(--c-amber-dim)",
                  padding: "1px 6px", borderRadius: 4, fontSize: 11,
                }}>★ {b.userRating}</span>
              )}
            </div>
          </div>
          {/* Score ring */}
          <div style={{
            width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${scoreBorder}`,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: scoreBg, color: scoreColor,
            fontFamily: "'IBM Plex Mono', monospace",
            boxShadow: `0 0 16px ${scoreBg}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{Number(b.score).toFixed(1)}</div>
            <div style={{ fontSize: 8.5, opacity: 0.55, marginTop: 2 }}>/10</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", margin: "12px 0 14px" }}>
          {b.licenseStatus && <Badge tone={b.licenseStatus === "Regulated" ? "reg" : b.licenseStatus === "Suspicious" || b.licenseStatus === "Unregulated Clone" ? "warn" : "pending"}>{b.licenseStatus}</Badge>}
          <Badge tone="reg">{b.regulator}</Badge>
          <Badge>{b.type}</Badge>
          {b.flags.map((f, i) => <Badge key={i} tone="warn">{f}</Badge>)}
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          padding: "12px 0",
          borderTop: `1px solid var(--c-line)`,
          borderBottom: `1px solid var(--c-line)`,
          fontSize: 12,
        }}>
          <div>
            <div style={{ color: "var(--c-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 }}>Min Deposit</div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>${b.min_deposit || 50}</div>
          </div>
          <div>
            <div style={{ color: "var(--c-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 }}>Leverage</div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{b.max_leverage || '1:500'}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <Button variant="subtle" onClick={onClick} style={{ flex: 1, justifyContent: "center" }}>View Dossier</Button>
        <Button
          variant={isCompared ? "primary" : "ghost"}
          onClick={(e) => { e.stopPropagation(); onCompare(); }}
          style={{ padding: "8px 12px" }}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
        >
          <Scale size={14} />
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   COMPARISON MODAL COMPONENT
--------------------------------------------------------- */
function ComparisonModal({ items, onClose, onRemove }) {
  if (items.length === 0) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5, 10, 18, 0.85)", backdropFilter: "blur(6px)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 10, maxWidth: 960, width: "100%", padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: `1px solid ${C.line}`, paddingBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24 }}>Broker Side-by-Side Audit</h2>
            <div style={{ fontSize: 13, color: C.muted }}>Evaluating safety metrics, regulation tiers, and execution parameters.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.paperDim, cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${items.length}, 1fr)`, gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, color: C.muted, fontSize: 13, fontWeight: 600, paddingTop: 60 }}>
            <div>Trust Rating</div>
            <div>Jurisdiction</div>
            <div>Regulation Tier</div>
            <div>Execution Model</div>
            <div>Min Deposit</div>
            <div>Max Leverage</div>
            <div>Risk Flags</div>
          </div>
          {items.map((b) => (
            <div key={b.id} style={{ background: C.ink, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</div>
                <button onClick={() => onRemove(b.id)} style={{ background: "none", border: "none", color: C.alert, cursor: "pointer" }}><Trash2 size={14} /></button>
              </div>
              <Stamp score={b.score} alert={b.flags.length > 0} size={42} />
              <div style={{ fontSize: 13.5 }}>{b.country}</div>
              <div><Badge tone="reg">{b.regulator}</Badge></div>
              <div style={{ fontSize: 13.5 }}>{b.type}</div>
              <div style={{ fontSize: 13.5 }}>${b.min_deposit || 50}</div>
              <div style={{ fontSize: 13.5 }}>{b.max_leverage || "1:500"}</div>
              <div>
                {b.flags.length ? b.flags.map((f, i) => <Badge key={i} tone="warn">{f}</Badge>) : <span style={{ color: C.verified, fontSize: 12 }}>None on file</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ALL BROKERS VIEW (Search & Filtering)
--------------------------------------------------------- */
function BrokersPage({ brokers, openDetail, toggleCompare, compareList, initialQuery = "" }) {
  const [q, setQ] = useState(initialQuery);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const filtered = brokers.filter((b) => {
    const matchQ = b.name.toLowerCase().includes(q.toLowerCase()) || b.regulator.toLowerCase().includes(q.toLowerCase()) || b.country.toLowerCase().includes(q.toLowerCase());
    const matchF = filter === "all" || (filter === "flagged" ? b.flags.length > 0 : b.flags.length === 0);
    return matchQ && matchF;
  }).sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "years") return b.years - a.years;
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 600 }}>Broker Case Directory</h1>
          <p style={{ color: C.paperDim, fontSize: 14, marginTop: 4 }}>Full regulatory dossier and inspection database.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.lineStrong}`, padding: "8px 14px", borderRadius: 6 }}>
            <Search size={15} color={C.muted} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter directory..." style={{ background: "transparent", border: "none", outline: "none", color: C.paper, fontSize: 13 }} />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "8px 12px" }}>
            <option value="score">Sort: Trust Score</option>
            <option value="years">Sort: Operating Longevity</option>
            <option value="name">Sort: Alphabetical</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {filtered.map((b) => (
          <BrokerCard key={b.id} b={b} onClick={() => openDetail(b)} onCompare={() => toggleCompare(b)} isCompared={compareList.some(x => x.id === b.id)} />
        ))}
        {!filtered.length && <div className="empty-state-panel">No broker records match this search or the current database is empty.</div>}
      </div>
    </div>
  );
}

function MarketPage() {
  const winners = [...marketPairs].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 4);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 12, color: C.verified, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>Live market intelligence</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 600, marginTop: 6 }}>Trading pair pulse and spread comparison</h1>
        </div>
        <Badge tone="reg"><TrendingUp size={12} /> Updated 2 min ago</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {marketPairs.map((pair) => {
          const isUp = Number(pair.change) >= 0;
          return (
            <div key={pair.symbol} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 10, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>Pair</div>
                  <strong style={{ display: "block", fontSize: 18, marginTop: 4 }}>{pair.symbol}</strong>
                </div>
                <span style={{ color: isUp ? C.verified : C.alert, fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 6, background: isUp ? C.verifiedDim + "40" : C.alertDim + "40" }}>
                  {isUp ? "+" : ""}{pair.change}%
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{pair.price.toLocaleString()}</div>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.paperDim, fontSize: 12 }}>
                <span>Spread: {pair.spread}</span>
                <span>Vol: {pair.volume}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 10, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>Spread comparison</h3>
            <Badge tone="reg">EURUSD</Badge>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.line}` }}>
                <th style={{ textAlign: "left", color: C.muted, fontWeight: 600, padding: "8px 10px" }}>Broker</th>
                <th style={{ textAlign: "right", color: C.muted, fontWeight: 600, padding: "8px 10px" }}>Buy</th>
                <th style={{ textAlign: "right", color: C.muted, fontWeight: 600, padding: "8px 10px" }}>Sell</th>
                <th style={{ textAlign: "right", color: C.muted, fontWeight: 600, padding: "8px 10px" }}>Spread</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Vantage", "1.16627", "1.16639", "0.12"],
                ["IC Markets", "1.16620", "1.16640", "0.20"],
                ["STARTRADER", "1.16610", "1.16635", "0.25"],
                ["XM", "1.16608", "1.16642", "0.34"],
              ].map(([broker, buy, sell, spread]) => (
                <tr key={broker} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={{ padding: "12px 10px", fontWeight: 600 }}>{broker}</td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>{buy}</td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>{sell}</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", color: C.verified, fontWeight: 700 }}>{spread}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 10, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>Top movers</h3>
            <BarChart3 size={18} color={C.verified} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {winners.map((pair) => (
              <div key={pair.symbol} style={{ background: C.ink, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <strong>{pair.symbol}</strong>
                  <span style={{ color: Number(pair.change) >= 0 ? C.verified : C.alert }}>{pair.change > 0 ? "+" : ""}{pair.change}%</span>
                </div>
                <div style={{ color: C.paperDim, fontSize: 12 }}>{pair.volume} volume</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardPage({ brokers }) {
  const [activeTab, setActiveTab] = useState("forex");
  
  let ranked = [];
  if (activeTab === "forex") {
    ranked = [...brokers].filter(b => b.score >= 5).sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 10);
  } else if (activeTab === "crypto") {
    ranked = [...brokers].filter(b => b.type.includes("Crypto") || b.score >= 7).sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 10);
  } else if (activeTab === "blacklist") {
    ranked = [...brokers].filter(b => b.score < 5 || (b.flags && b.flags.length > 0)).sort((a, b) => Number(a.score) - Number(b.score));
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 18 }}>
        <div>
          <div className="section-kicker">Ranking Dashboard</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginTop: 4, marginBottom: 0, letterSpacing: "-0.01em" }}>Broker leaderboard</h1>
        </div>
        <Badge tone="reg">Live scoring snapshot</Badge>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 28, borderBottom: `1px solid var(--c-line-strong)`, paddingBottom: 16 }}>
        <button onClick={() => setActiveTab("forex")} style={{ background: "none", border: "none", color: activeTab === "forex" ? "var(--c-paper)" : "var(--c-muted)", fontWeight: activeTab === "forex" ? 700 : 400, fontSize: 15, cursor: "pointer", fontFamily: "'Inter', sans-serif", borderBottom: activeTab === "forex" ? `2px solid var(--c-verified)` : "2px solid transparent", paddingBottom: 8 }}>Top 10 Forex</button>
        <button onClick={() => setActiveTab("crypto")} style={{ background: "none", border: "none", color: activeTab === "crypto" ? "var(--c-paper)" : "var(--c-muted)", fontWeight: activeTab === "crypto" ? 700 : 400, fontSize: 15, cursor: "pointer", fontFamily: "'Inter', sans-serif", borderBottom: activeTab === "crypto" ? `2px solid var(--c-verified)` : "2px solid transparent", paddingBottom: 8 }}>Top Crypto</button>
        <button onClick={() => setActiveTab("blacklist")} style={{ background: "none", border: "none", color: activeTab === "blacklist" ? "var(--c-alert)" : "var(--c-muted)", fontWeight: activeTab === "blacklist" ? 700 : 400, fontSize: 15, cursor: "pointer", fontFamily: "'Inter', sans-serif", borderBottom: activeTab === "blacklist" ? `2px solid var(--c-alert)` : "2px solid transparent", paddingBottom: 8 }}>Global Blacklist</button>
      </div>

      {activeTab === "forex" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
          {leaderboardMetrics.map((metric) => (
            <div key={metric.label} style={{
              background: "var(--gradient-card)",
              border: `1px solid var(--c-line)`,
              borderRadius: 14, padding: 20,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--c-line-accent)"; e.currentTarget.style.boxShadow = "var(--shadow-sm), var(--shadow-glow)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-line)"; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ color: "var(--c-muted)", fontSize: 10.5, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.07em" }}>{metric.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, margin: "10px 0 6px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "-0.02em" }}>{metric.value}</div>
              <div style={{ color: "var(--c-paper-dim)", fontSize: 12 }}>Leader: {metric.leader}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ranked.map((broker, index) => (
          <div key={broker.id} className="leaderboard-row" style={{ display: "grid", gridTemplateColumns: "70px 1.2fr 1fr 1fr 1fr 120px", alignItems: "center", gap: 16, padding: "18px 22px" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: index < 3 ? "var(--c-verified)" : "var(--c-muted)", fontWeight: index < 3 ? 700 : 400, fontSize: index < 3 ? 16 : 14 }}>#{index + 1}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{broker.name}</div>
              <div style={{ color: "var(--c-paper-dim)", fontSize: 12, marginTop: 2 }}>{broker.country}</div>
            </div>
            <div><Badge tone={Number(broker.score) >= 8 ? "reg" : Number(broker.score) >= 5 ? "pending" : "warn"}>{broker.score}/10</Badge></div>
            <div style={{ color: "var(--c-paper-dim)", fontSize: 13 }}>{broker.regulator}</div>
            <div style={{ color: "var(--c-paper-dim)", fontSize: 13 }}>{broker.type}</div>
            <div style={{ textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{broker.min_deposit ? `$${broker.min_deposit}` : "-"}</div>
          </div>
        ))}
        {!ranked.length && <div className="empty-state-panel">No brokers found in this category.</div>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   EXPOSURE / COMPLAINT FILING VIEW
--------------------------------------------------------- */
function ExposurePage({ exposures, brokers, onSubmitReport }) {
  const [form, setForm] = useState({ brokerName: "", title: "", text: "", amount: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.brokerName || !form.title || !form.text) return;
    const saved = await onSubmitReport(form);
    if (!saved) return;
    setForm({ brokerName: "", title: "", text: "", amount: "", email: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const published = exposures.filter(e => e.status === "published");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, marginBottom: 8 }}>Active Public Complaints</h2>
          <p style={{ color: C.paperDim, fontSize: 14, marginBottom: 28 }}>Verified investor withdrawal and trade disruption records.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {published.map((e) => (
              <div key={e.id} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, padding: 22, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{e.brokerName}</span>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: C.paperDim, marginTop: 2 }}>{e.title}</h4>
                  </div>
                  {e.amount && <Badge tone="warn">${Number(e.amount).toLocaleString()}</Badge>}
                </div>
                <p style={{ fontSize: 13.5, color: C.paperDim, lineHeight: 1.5 }}>{e.text}</p>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", marginTop: 12 }}>CASE FILED: {e.date}</div>
              </div>
            ))}
            {!published.length && <div className="empty-state-panel">No published complaints are available yet.</div>}
          </div>
        </div>

        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: 28, position: "sticky", top: 90 }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 6 }}>Submit an Exposure Dossier</h3>
            <p style={{ fontSize: 13, color: C.paperDim, marginBottom: 20 }}>Evidence submitted is held in the PostgreSQL triage database prior to publication.</p>
            {submitted && (
              <div style={{ background: C.verifiedDim, color: C.verified, padding: 12, borderRadius: 6, fontSize: 13, marginBottom: 16 }}>
                ✓ Case successfully logged and submitted for audit.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <Field label="Broker Name">
                <input required style={inputStyle} value={form.brokerName} onChange={(e) => setForm({ ...form, brokerName: e.target.value })} placeholder="e.g. Reef Markets" list="brokers-dl" />
                <datalist id="brokers-dl">{brokers.map(b => <option key={b.id} value={b.name} />)}</datalist>
              </Field>
              <Field label="Disputed Amount (USD)">
                <input type="number" style={inputStyle} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 1500" />
              </Field>
              <Field label="Incident Subject">
                <input required style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Summary of infringement" />
              </Field>
              <Field label="Detailed Testimony">
                <textarea required rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Include dates, account numbers, and support replies." />
              </Field>
              <Button type="submit" style={{ width: "100%", justifyContent: "center" }}>Transmit to Audit Queue</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DETAIL MODAL
--------------------------------------------------------- */
function DetailModal({ broker, exposures, onClose }) {
  if (!broker) return null;
  const related = exposures.filter((e) => e.status === "published" && e.brokerName.toLowerCase() === broker.name.toLowerCase());

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(6,11,19,0.75)", backdropFilter: "blur(6px)", zIndex: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 10, maxWidth: 640, width: "100%", padding: 32, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: C.paperDim, cursor: "pointer" }}><X size={18} /></button>
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 24 }}>
          <Stamp score={broker.score} alert={broker.flags.length > 0} size={58} />
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24 }}>{broker.name}</h2>
            <div style={{ color: C.muted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>Operating {broker.years} Years · Jurisdiction: {broker.country}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            ["License Index", broker.subScores?.license || "N/A"],
            ["Business Index", broker.subScores?.business || "N/A"],
            ["Risk Management", broker.subScores?.risk || "N/A"],
            ["Software Index", broker.subScores?.software || "N/A"],
            ["Regulator Bodies", broker.regulator],
            ["License ID", broker.license],
            ["Execution Type", broker.type],
            ["Trading Environment", broker.tradingEnv || "Unrated"],
            ["Field Survey", broker.fieldSurvey || "Pending Inspection"],
            ["Infringement Flags", broker.flags.length ? broker.flags.join(", ") : "Clean Record"]
          ].map(([k, v]) => (
            <div key={k} style={{ background: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "10px 12px", gridColumn: k === "Field Survey" || k === "Infringement Flags" ? "span 2" : "span 1" }}>
              <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>{k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <h4 style={{ fontSize: 13, textTransform: "uppercase", color: C.muted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>Case History ({related.length})</h4>
            {related.length === 0 ? (
              <div style={{ color: C.muted, fontSize: 13 }}>No recorded dispute dossiers for this broker.</div>
            ) : related.map(r => (
              <div key={r.id} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 10, fontSize: 13 }}>
                <div style={{ fontWeight: 600 }}>{r.title}</div>
                <div style={{ color: C.paperDim, marginTop: 2 }}>{r.text}</div>
              </div>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 13, textTransform: "uppercase", color: C.muted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>Community Reviews</h4>
            {(!broker.reviews || broker.reviews.length === 0) ? (
              <div style={{ color: C.muted, fontSize: 13 }}>No community reviews available yet.</div>
            ) : broker.reviews.map((r, i) => (
              <div key={i} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 10, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontWeight: 600 }}>{r.user}</div>
                  <div style={{ color: C.amber }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                </div>
                <div style={{ color: C.paperDim }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ADMIN PANEL (Full Database Management)
--------------------------------------------------------- */
function AdminPanel({ brokers, setBrokers, exposures, setExposures, news, setNews, alerts: propsAlerts, setAlerts: propsSetAlerts, surveys: propsSurveys, setSurveys: propsSetSurveys, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [newBroker, setNewBroker] = useState({ name: "", years: 5, score: 8.0, regulator: "", license: "", country: "", type: "ECN", min_deposit: 100, max_leverage: "1:500", flags: "", licenseStatus: "Regulated" });
  const [newNews, setNewNews] = useState({ title: "", summary: "", category: "Regulation" });
  const [newAlert, setNewAlert] = useState({ broker: "", country: "", type: "Clone Fraud", severity: "High", description: "" });
  const [newSurvey, setNewSurvey] = useState({ broker: "", country: "", address: "", score: 8.0, findings: "", status: "Verified" });
  const [brokerSearch, setBrokerSearch] = useState("");
  const [exposureFilter, setExposureFilter] = useState("all");
  const [adminMessage, setAdminMessage] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [localAlerts, setLocalAlerts] = useState(scamAlerts);
  const [localSurveys, setLocalSurveys] = useState(fieldSurveys);

  const alerts = propsAlerts || localAlerts;
  const setAlerts = propsSetAlerts || setLocalAlerts;
  const surveys = propsSurveys || localSurveys;
  const setSurveys = propsSetSurveys || setLocalSurveys;

  const [forumMod, setForumMod] = useState(forumPosts.map(p => ({ ...p, hidden: false })));
  const [editingBroker, setEditingBroker] = useState(null);

  const notify = (msg, type = "success") => { setAdminMessage(msg); setMsgType(type); setTimeout(() => setAdminMessage(""), 4000); };

  const filteredBrokers = useMemo(() => brokers.filter((b) => {
    const q = brokerSearch.trim().toLowerCase();
    if (!q) return true;
    return [b.name, b.country, b.regulator, b.license].join(" ").toLowerCase().includes(q);
  }), [brokers, brokerSearch]);

  const filteredExposures = useMemo(() => exposures.filter((item) => {
    if (exposureFilter === "all") return true;
    return item.status === exposureFilter;
  }), [exposures, exposureFilter]);

  const riskWatch = useMemo(() => brokers.filter((b) => Number(b.score) < 5 || (b.flags || []).length > 0).slice(0, 5), [brokers]);

  /* ---- Broker handlers ---- */
  async function handleAddBroker(e) {
    e.preventDefault();
    const payload = {
      ...newBroker,
      id: "b" + Date.now(),
      flags: newBroker.flags ? newBroker.flags.split(",").map(f => f.trim()) : [],
      years_active: Number(newBroker.years || 0),
      license_no: newBroker.license,
      account_type: newBroker.type,
      license_status: newBroker.licenseStatus || "Regulated",
      trading_env: "AAA",
      user_rating: 4.5
    };
    const saved = await fetchAPI("/brokers", { method: "POST", body: JSON.stringify(payload) });
    if (saved && !saved.error) {
      setBrokers([normalizeBroker(saved), ...brokers]);
      notify("✅ Broker saved directly to Supabase!");
      setNewBroker({ name: "", years: 5, score: 8.0, regulator: "", license: "", country: "", type: "ECN", min_deposit: 100, max_leverage: "1:500", flags: "", licenseStatus: "Regulated" });
    } else {
      const errMsg = saved?.error || "Check backend / Supabase RLS policies.";
      notify(`⚠️ ${errMsg}`, "alert");
    }
  }

  async function handleDeleteBroker(id) {
    await fetchAPI(`/brokers/${id}`, { method: "DELETE" });
    setBrokers(brokers.filter((b) => b.id !== id));
    notify("🗑 Broker record removed.", "warn");
  }

  async function handleUpdateScore(id, newScore) {
    setBrokers(brokers.map(b => b.id === id ? { ...b, score: Number(newScore) } : b));
    notify(`Score updated to ${newScore}.`);
  }

  /* ---- Exposure handlers ---- */
  async function handleStatus(id, status) {
    const saved = await fetchAPI(`/exposures/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    setExposures(exposures.map(e => e.id === id ? { ...e, status: saved?.status || status } : e));
    notify(status === "published" ? "✅ Exposure published." : "❌ Exposure rejected.", status === "published" ? "success" : "warn");
  }

  async function handleDeleteExposure(id) {
    await fetchAPI(`/exposures/${id}`, { method: "DELETE" });
    setExposures(exposures.filter((e) => e.id !== id));
    notify("🗑 Exposure deleted.", "warn");
  }

  /* ---- News handlers ---- */
  async function handleAddNews(e) {
    e.preventDefault();
    if (!newNews.title || !newNews.summary) return;
    const saved = await fetchAPI("/news", { method: "POST", body: JSON.stringify(newNews) });
    setNews([normalizeNews(saved || { ...newNews, id: "n" + Date.now(), date: new Date().toISOString().slice(0, 10) }), ...news]);
    notify("📰 Dispatch published.");
    setNewNews({ title: "", summary: "", category: "Regulation" });
  }

  async function handleDeleteNews(id) {
    await fetchAPI(`/news/${id}`, { method: "DELETE" });
    setNews(news.filter((a) => a.id !== id));
    notify("🗑 Dispatch deleted.", "warn");
  }

  /* ---- Alert handlers ---- */
  async function handleAddAlert(e) {
    e.preventDefault();
    if (!newAlert.broker || !newAlert.description) return;
    const payload = {
      ...newAlert,
      date: new Date().toISOString().slice(0, 10)
    };
    const saved = await fetchAPI("/scam-alerts", { method: "POST", body: JSON.stringify(payload) });
    if (saved && !saved.error) {
      setAlerts([normalizeAlert(saved), ...alerts]);
      notify("🚨 Scam alert saved directly to Supabase!");
      setNewAlert({ broker: "", country: "", type: "Clone Fraud", severity: "High", description: "" });
    } else {
      notify(`⚠️ ${saved?.error || "Failed to save scam alert."}`, "alert");
    }
  }

  async function handleDeleteAlert(id) {
    await fetchAPI(`/scam-alerts/${id}`, { method: "DELETE" });
    setAlerts(alerts.filter(x => x.id !== id));
    notify("🗑 Scam alert deleted.", "warn");
  }

  /* ---- Survey handlers ---- */
  async function handleAddSurvey(e) {
    e.preventDefault();
    if (!newSurvey.broker || !newSurvey.address) return;
    const payload = {
      ...newSurvey,
      score: Number(newSurvey.score || 8.0),
      date: new Date().toISOString().slice(0, 10)
    };
    const saved = await fetchAPI("/field-surveys", { method: "POST", body: JSON.stringify(payload) });
    if (saved && !saved.error) {
      setSurveys([normalizeSurvey(saved), ...surveys]);
      notify("✅ Field survey saved directly to Supabase!");
      setNewSurvey({ broker: "", country: "", address: "", score: 8.0, findings: "", status: "Verified" });
    } else {
      notify(`⚠️ ${saved?.error || "Failed to save field survey."}`, "alert");
    }
  }

  async function handleDeleteSurvey(id) {
    await fetchAPI(`/field-surveys/${id}`, { method: "DELETE" });
    setSurveys(surveys.filter(x => x.id !== id));
    notify("🗑 Field survey deleted.", "warn");
  }

  /* ---- Bulk handlers ---- */
  async function handleHighlightRisk() {
    const flagged = brokers.filter(b => Number(b.score) < 5 && !(b.flags || []).includes("High risk review"));
    await Promise.all(flagged.map(b => fetchAPI(`/brokers/${b.id}`, { method: "PATCH", body: JSON.stringify({ flags: [...(b.flags || []), "High risk review"] }) })));
    setBrokers(cur => cur.map(b => flagged.some(f => f.id === b.id) ? { ...b, flags: [...(b.flags || []), "High risk review"] } : b));
    notify(`⚠️ ${flagged.length} brokers flagged for high risk review.`);
  }

  async function handleBulkReview() {
    const pending = exposures.filter(e => e.status === "pending");
    await Promise.all(pending.map(e => fetchAPI(`/exposures/${e.id}/status`, { method: "PATCH", body: JSON.stringify({ status: "published" }) })));
    setExposures(cur => cur.map(e => e.status === "pending" ? { ...e, status: "published" } : e));
    notify(`✅ ${pending.length} exposures published.`);
  }

  const sidebarItems = [
    { id: "overview", Icon: LayoutDashboard, label: "Dashboard", meta: "Analytics" },
    { id: "brokers", Icon: ShieldCheck, label: "Brokers", meta: brokers.length + " records" },
    { id: "exposures", Icon: AlertTriangle, label: "Exposures", meta: exposures.filter(e => e.status === "pending").length + " pending" },
    { id: "news", Icon: Newspaper, label: "News", meta: news.length + " dispatches" },
    { id: "scam-alerts-admin", Icon: AlertOctagon, label: "Scam Alerts", meta: alerts.length + " active" },
    { id: "field-surveys-admin", Icon: Globe, label: "Field Surveys", meta: surveys.length + " reports" },
    { id: "forum-admin", Icon: MessageCircle, label: "Forum Mod", meta: forumMod.length + " posts" },
    { id: "tools", Icon: SlidersHorizontal, label: "System Tools", meta: "Actions" },
  ];

  const cardStyle = { background: "rgba(7,14,24,0.55)", border: `1px solid ${C.lineStrong}`, padding: "18px 20px", borderRadius: 12 };
  const rowHover = { transition: "background 0.2s" };

  return (
    <div className="admin-shell" style={{ maxWidth: 1440, margin: "0 auto", padding: "36px 28px 70px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, borderBottom: `1px solid ${C.line}`, paddingBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: C.verified, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>🛡 Ledger Intelligence</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Admin Control Centre</h1>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Full platform management · Logged in as Administrator</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={handleHighlightRisk}><AlertTriangle size={14} /> Flag Risk</Button>
          <Button variant="subtle" onClick={handleBulkReview}><CheckCircle2 size={14} /> Bulk Review</Button>
          <Button variant="danger" onClick={onLogout}><LogOut size={14} /> Logout</Button>
        </div>
      </div>

      {/* Notification */}
      {adminMessage && (
        <div role="status" style={{ marginBottom: 20, padding: "12px 16px", border: `1px solid ${msgType === "success" ? C.verifiedDim : C.amberDim}`, background: `${msgType === "success" ? "rgba(0,230,118,0.08)" : "rgba(255,196,0,0.08)"}`, color: msgType === "success" ? C.verified : C.amber, borderRadius: 10, fontSize: 13, fontWeight: 500 }}>
          {adminMessage}
        </div>
      )}

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar" aria-label="Admin sections">
          <div className="admin-sidebar-label">Navigation</div>
          <nav className="admin-sidebar-nav">
            {sidebarItems.map(({ id, Icon, label, meta }) => (
              <button key={id} type="button" className={`admin-sidebar-link ${tab === id ? "is-active" : ""}`} onClick={() => setTab(id)}>
                <Icon size={16} /><span>{label}</span><small>{meta}</small>
              </button>
            ))}
          </nav>
          <div className="admin-sidebar-status"><i /> Database connected<strong>PostgreSQL</strong></div>
        </aside>

        <main className="admin-content">

          {/* ─── OVERVIEW DASHBOARD ─── */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* KPI row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
                {[
                  { label: "Broker Records", value: brokers.length, color: C.verified, icon: "🏦" },
                  { label: "Pending Review", value: exposures.filter(e => e.status === "pending").length, color: C.amber, icon: "⏳" },
                  { label: "Published Alerts", value: exposures.filter(e => e.status === "published").length, color: "#6C8EF5", icon: "📣" },
                  { label: "Scam Alerts", value: alerts.length, color: C.alert, icon: "🚨" },
                  { label: "Field Surveys", value: surveys.length, color: C.amber, icon: "🔍" },
                  { label: "News Dispatches", value: news.length, color: C.verified, icon: "📰" },
                ].map(({ label, value, color, icon }) => (
                  <div key={label} style={{ ...cardStyle, textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div>
                    <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Activity + Risk Watch */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }}>
                <GlassCard style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20 }}>Recent Exposures</h3>
                    <Badge tone="reg">Live Feed</Badge>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[...exposures].slice(0, 5).map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: `1px solid ${C.line}`, paddingBottom: 10, alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{item.brokerName}</div>
                          <div style={{ color: C.paperDim, fontSize: 12, marginTop: 2 }}>{item.title}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {item.amount && <Badge tone="warn">${Number(item.amount).toLocaleString()}</Badge>}
                          <Badge tone={item.status === "pending" ? "pending" : item.status === "rejected" ? "warn" : "reg"}>{item.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20 }}>Risk Watch</h3>
                    <AlertTriangle size={17} color={C.alert} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {riskWatch.map((b) => (
                      <div key={b.id} style={{ background: "rgba(255,61,0,0.06)", border: `1px solid ${C.alertDim}`, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: 14 }}>{b.name}</strong>
                          <Badge tone="warn">{Number(b.score).toFixed(1)}/10</Badge>
                        </div>
                        <div style={{ color: C.paperDim, fontSize: 12, marginTop: 5 }}>{(b.flags || []).join(" · ") || "Due for review"}</div>
                      </div>
                    ))}
                    {!riskWatch.length && <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "24px 0" }}>No critical risk signals detected</div>}
                  </div>
                </GlassCard>
              </div>

              {/* Score distribution bar */}
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 16 }}>Registry Score Distribution</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {[
                    { label: "High Trust (8–10)", count: brokers.filter(b => Number(b.score) >= 8).length, color: C.verified, bg: "rgba(0,230,118,0.08)" },
                    { label: "Medium (5–7.9)", count: brokers.filter(b => Number(b.score) >= 5 && Number(b.score) < 8).length, color: C.amber, bg: "rgba(255,196,0,0.08)" },
                    { label: "High Risk (<5)", count: brokers.filter(b => Number(b.score) < 5).length, color: C.alert, bg: "rgba(255,61,0,0.08)" },
                  ].map(({ label, count, color, bg }) => {
                    const pct = brokers.length ? Math.round((count / brokers.length) * 100) : 0;
                    return (
                      <div key={label} style={{ background: bg, border: `1px solid ${color}33`, borderRadius: 12, padding: "16px 20px" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color }}>{count}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{label}</div>
                        <div style={{ marginTop: 10, background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 4 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 1s ease" }} />
                        </div>
                        <div style={{ fontSize: 11, color, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{pct}% of registry</div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <AdminOverview brokers={brokers} exposures={exposures} news={news} />
            </div>
          )}

          {/* ─── BROKER MANAGEMENT ─── */}
          {tab === "brokers" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 28 }}>
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: "'Fraunces', serif" }}>Add New Broker</h3>
                <form onSubmit={handleAddBroker}>
                  <Field label="Broker Name"><input required style={inputStyle} value={newBroker.name} onChange={e => setNewBroker({ ...newBroker, name: e.target.value })} placeholder="e.g. Global FX Ltd" /></Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Years Active"><input type="number" min={0} style={inputStyle} value={newBroker.years} onChange={e => setNewBroker({ ...newBroker, years: e.target.value })} /></Field>
                    <Field label="Trust Score (0-10)"><input type="number" step="0.1" min="0" max="10" style={inputStyle} value={newBroker.score} onChange={e => setNewBroker({ ...newBroker, score: e.target.value })} /></Field>
                  </div>
                  <Field label="Regulators"><input required style={inputStyle} value={newBroker.regulator} onChange={e => setNewBroker({ ...newBroker, regulator: e.target.value })} placeholder="FCA, ASIC" /></Field>
                  <Field label="License Number"><input required style={inputStyle} value={newBroker.license} onChange={e => setNewBroker({ ...newBroker, license: e.target.value })} /></Field>
                  <Field label="Jurisdiction Country"><input required style={inputStyle} value={newBroker.country} onChange={e => setNewBroker({ ...newBroker, country: e.target.value })} /></Field>
                  <Field label="License Status">
                    <select style={inputStyle} value={newBroker.licenseStatus} onChange={e => setNewBroker({ ...newBroker, licenseStatus: e.target.value })}>
                      {["Regulated", "Offshore Regulatory", "Suspicious", "Unregulated Clone"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Broker Type">
                    <select style={inputStyle} value={newBroker.type} onChange={e => setNewBroker({ ...newBroker, type: e.target.value })}>
                      {["ECN", "STP", "Market Maker", "DMA", "Hybrid"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Min Deposit ($)"><input type="number" style={inputStyle} value={newBroker.min_deposit} onChange={e => setNewBroker({ ...newBroker, min_deposit: e.target.value })} /></Field>
                    <Field label="Max Leverage"><input style={inputStyle} value={newBroker.max_leverage} onChange={e => setNewBroker({ ...newBroker, max_leverage: e.target.value })} placeholder="1:500" /></Field>
                  </div>
                  <Field label="Infringement Flags (comma-separated)"><input style={inputStyle} value={newBroker.flags} onChange={e => setNewBroker({ ...newBroker, flags: e.target.value })} placeholder="Offshore, Withdrawal delays" /></Field>
                  <Button type="submit" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}><Plus size={14} /> Add Broker to Registry</Button>
                </form>
              </GlassCard>

              <GlassCard style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 16, fontFamily: "'Fraunces', serif" }}>Registry Roster <span style={{ color: C.muted, fontSize: 14 }}>({filteredBrokers.length})</span></h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.ink, border: `1px solid ${C.lineStrong}`, borderRadius: 10, minWidth: 220, padding: "8px 12px" }}>
                    <Search size={14} color={C.muted} />
                    <input value={brokerSearch} onChange={(e) => setBrokerSearch(e.target.value)} placeholder="Search broker..." style={{ background: "transparent", border: "none", outline: "none", color: C.paper, flex: 1, fontSize: 13 }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 600, overflowY: "auto" }}>
                  {filteredBrokers.map((b) => (
                    <div key={b.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{b.name}</span>
                          <Badge tone={b.licenseStatus === "Regulated" ? "reg" : b.licenseStatus === "Suspicious" || b.licenseStatus === "Unregulated Clone" ? "warn" : "pending"}>{b.licenseStatus || b.regulator}</Badge>
                        </div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{b.country} · {b.type} · Score: <span style={{ color: Number(b.score) >= 8 ? C.verified : Number(b.score) >= 5 ? C.amber : C.alert, fontWeight: 700 }}>{b.score}/10</span></div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input type="number" step="0.1" min="0" max="10" defaultValue={b.score} onBlur={e => handleUpdateScore(b.id, e.target.value)} style={{ ...inputStyle, width: 60, padding: "5px 8px", fontSize: 13 }} title="Update score" />
                        <Button variant="danger" onClick={() => handleDeleteBroker(b.id)}><Trash2 size={13} /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* ─── EXPOSURE TRIAGE ─── */}
          {tab === "exposures" && (
            <GlassCard style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ fontSize: 18, fontFamily: "'Fraunces', serif" }}>Exposure Triage Queue</h3>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{exposures.filter(e => e.status === "pending").length} items awaiting review</div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["all", "pending", "published", "rejected"].map(f => (
                    <button key={f} onClick={() => setExposureFilter(f)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${exposureFilter === f ? C.verified : C.lineStrong}`, background: exposureFilter === f ? "rgba(0,230,118,0.1)" : "transparent", color: exposureFilter === f ? C.verified : C.paperDim, cursor: "pointer", fontSize: 13, fontWeight: exposureFilter === f ? 700 : 400, textTransform: "capitalize", transition: "all 0.2s" }}>
                      {f}
                    </button>
                  ))}
                  <Button variant="primary" onClick={handleBulkReview} style={{ padding: "7px 16px", fontSize: 13 }}><CheckCircle2 size={13} /> Publish All Pending</Button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filteredExposures.map((e) => (
                  <div key={e.id} style={{ ...cardStyle, border: `1px solid ${e.status === "pending" ? C.amberDim : e.status === "rejected" ? C.alertDim : C.lineStrong}`, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                        <Badge tone={e.status === "pending" ? "pending" : e.status === "rejected" ? "warn" : "reg"}>{e.status.toUpperCase()}</Badge>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{e.brokerName}</span>
                        {e.amount && <Badge tone="warn">Disputed: ${Number(e.amount).toLocaleString()}</Badge>}
                      </div>
                      <h4 style={{ fontSize: 15, margin: "0 0 6px", lineHeight: 1.3 }}>{e.title}</h4>
                      <p style={{ color: C.paperDim, fontSize: 13.5, lineHeight: 1.6 }}>{e.text}</p>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 10, fontFamily: "'IBM Plex Mono', monospace" }}>Filed: {e.date}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap", flexShrink: 0 }}>
                      {e.status === "pending" && (
                        <>
                          <Button variant="primary" onClick={() => handleStatus(e.id, "published")} style={{ padding: "7px 14px", fontSize: 13 }}><CheckCircle2 size={13} /> Publish</Button>
                          <Button variant="danger" onClick={() => handleStatus(e.id, "rejected")} style={{ padding: "7px 14px", fontSize: 13 }}><XCircle size={13} /> Reject</Button>
                        </>
                      )}
                      <Button variant="danger" onClick={() => handleDeleteExposure(e.id)} style={{ padding: "7px 12px" }}><Trash2 size={13} /></Button>
                    </div>
                  </div>
                ))}
                {!filteredExposures.length && <div style={{ color: C.muted, textAlign: "center", padding: "40px 0", fontSize: 15 }}>No exposures match this filter.</div>}
              </div>
            </GlassCard>
          )}

          {/* ─── NEWS PUBLISHER ─── */}
          {tab === "news" && (
            <div className="admin-news-layout">
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontFamily: "'Fraunces', serif", marginBottom: 16 }}>Publish Intelligence Dispatch</h3>
                <form onSubmit={handleAddNews}>
                  <Field label="Headline"><input required style={inputStyle} value={newNews.title} onChange={e => setNewNews({ ...newNews, title: e.target.value })} placeholder="Enter article headline..." /></Field>
                  <Field label="Category">
                    <select style={inputStyle} value={newNews.category} onChange={e => setNewNews({ ...newNews, category: e.target.value })}>
                      {["Regulation", "Education", "Market Watch", "Scam Alert", "Industry News"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Briefing / Summary"><textarea required rows={6} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} value={newNews.summary} onChange={e => setNewNews({ ...newNews, summary: e.target.value })} placeholder="Write the article summary..." /></Field>
                  <Button type="submit" style={{ width: "100%", justifyContent: "center" }}><Plus size={14} /> Publish Dispatch</Button>
                </form>
              </GlassCard>
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontFamily: "'Fraunces', serif", marginBottom: 16 }}>Published Dispatches ({news.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 600, overflowY: "auto" }}>
                  {news.map((a) => (
                    <div key={a.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                          <Badge tone="reg">{a.category}</Badge>
                          <span style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{a.date}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{a.title}</div>
                        <div style={{ color: C.paperDim, fontSize: 13, marginTop: 5, lineHeight: 1.5 }}>{a.summary}</div>
                      </div>
                      <Button variant="danger" onClick={() => handleDeleteNews(a.id)} style={{ flexShrink: 0 }}><Trash2 size={13} /></Button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* ─── SCAM ALERT MANAGER ─── */}
          {tab === "scam-alerts-admin" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 28 }}>
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontFamily: "'Fraunces', serif", marginBottom: 16 }}>Issue Scam Alert</h3>
                <form onSubmit={handleAddAlert}>
                  <Field label="Broker Name"><input required style={inputStyle} value={newAlert.broker} onChange={e => setNewAlert({ ...newAlert, broker: e.target.value })} placeholder="e.g. FraudBroker Ltd" /></Field>
                  <Field label="Country"><input style={inputStyle} value={newAlert.country} onChange={e => setNewAlert({ ...newAlert, country: e.target.value })} placeholder="e.g. Comoros" /></Field>
                  <Field label="Alert Type">
                    <select style={inputStyle} value={newAlert.type} onChange={e => setNewAlert({ ...newAlert, type: e.target.value })}>
                      {["Clone Fraud", "Withdrawal Theft", "Spread Manipulation", "Unlicensed Operation", "Account Freezing", "Signal Scam"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Severity">
                    <select style={inputStyle} value={newAlert.severity} onChange={e => setNewAlert({ ...newAlert, severity: e.target.value })}>
                      {["Critical", "High", "Medium"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Description"><textarea required rows={5} style={{ ...inputStyle, resize: "vertical" }} value={newAlert.description} onChange={e => setNewAlert({ ...newAlert, description: e.target.value })} placeholder="Describe the fraudulent activity..." /></Field>
                  <Button type="submit" style={{ width: "100%", justifyContent: "center" }}><AlertOctagon size={14} /> Issue Alert</Button>
                </form>
              </GlassCard>

              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontFamily: "'Fraunces', serif", marginBottom: 16 }}>Active Alerts ({alerts.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 640, overflowY: "auto" }}>
                  {alerts.map((a) => (
                    <div key={a.id} style={{ ...cardStyle, borderLeft: `4px solid ${a.severity === "Critical" ? C.alert : a.severity === "High" ? "#FF6B00" : C.amber}`, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <Badge tone={a.severity === "Critical" ? "warn" : "pending"}>{a.severity}</Badge>
                          <span style={{ fontWeight: 700 }}>{a.broker}</span>
                          <Badge>{a.type}</Badge>
                        </div>
                        <div style={{ fontSize: 12, color: C.muted, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>📍 {a.country} · {a.date}</div>
                        <p style={{ fontSize: 13, color: C.paperDim, lineHeight: 1.5 }}>{a.description}</p>
                      </div>
                      <Button variant="danger" onClick={() => handleDeleteAlert(a.id)} style={{ flexShrink: 0 }}><Trash2 size={13} /></Button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* ─── FIELD SURVEY MANAGER ─── */}
          {tab === "field-surveys-admin" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 28 }}>
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontFamily: "'Fraunces', serif", marginBottom: 16 }}>Submit Field Survey</h3>
                <form onSubmit={handleAddSurvey}>
                  <Field label="Broker Name"><input required style={inputStyle} value={newSurvey.broker} onChange={e => setNewSurvey({ ...newSurvey, broker: e.target.value })} /></Field>
                  <Field label="Country"><input required style={inputStyle} value={newSurvey.country} onChange={e => setNewSurvey({ ...newSurvey, country: e.target.value })} /></Field>
                  <Field label="Registered Address"><input required style={inputStyle} value={newSurvey.address} onChange={e => setNewSurvey({ ...newSurvey, address: e.target.value })} placeholder="Full street address" /></Field>
                  <Field label="Inspection Score (0-10)"><input type="number" step="0.1" min="0" max="10" style={inputStyle} value={newSurvey.score} onChange={e => setNewSurvey({ ...newSurvey, score: e.target.value })} /></Field>
                  <Field label="Status">
                    <select style={inputStyle} value={newSurvey.status} onChange={e => setNewSurvey({ ...newSurvey, status: e.target.value })}>
                      {["Verified", "Suspicious", "Fraudulent"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Field Findings"><textarea required rows={5} style={{ ...inputStyle, resize: "vertical" }} value={newSurvey.findings} onChange={e => setNewSurvey({ ...newSurvey, findings: e.target.value })} placeholder="Describe what inspectors found..." /></Field>
                  <Button type="submit" style={{ width: "100%", justifyContent: "center" }}><Plus size={14} /> Publish Survey</Button>
                </form>
              </GlassCard>

              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontFamily: "'Fraunces', serif", marginBottom: 16 }}>Survey Reports ({surveys.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 640, overflowY: "auto" }}>
                  {surveys.map((s) => {
                    const statusColor = { Verified: C.verified, Suspicious: C.amber, Fraudulent: C.alert };
                    return (
                      <div key={s.id} style={{ ...cardStyle, borderLeft: `4px solid ${statusColor[s.status]}`, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                            <Badge tone={s.status === "Verified" ? "reg" : s.status === "Suspicious" ? "pending" : "warn"}>{s.status}</Badge>
                            <span style={{ fontWeight: 700 }}>{s.broker}</span>
                            <span style={{ color: statusColor[s.status], fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>{s.score}/10</span>
                          </div>
                          <div style={{ fontSize: 12, color: C.muted, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>📍 {s.address} · {s.date}</div>
                          <p style={{ fontSize: 13, color: C.paperDim, lineHeight: 1.5 }}>{s.findings}</p>
                        </div>
                        <Button variant="danger" onClick={() => handleDeleteSurvey(s.id)} style={{ flexShrink: 0 }}><Trash2 size={13} /></Button>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          )}

          {/* ─── FORUM MODERATOR ─── */}
          {tab === "forum-admin" && (
            <GlassCard style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontFamily: "'Fraunces', serif" }}>Forum Moderation</h3>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Review and moderate community forum posts</div>
                </div>
                <Badge tone="pending">{forumMod.filter(p => !p.hidden).length} visible · {forumMod.filter(p => p.hidden).length} hidden</Badge>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {forumMod.map((post) => (
                  <div key={post.id} style={{ ...cardStyle, opacity: post.hidden ? 0.5 : 1, transition: "opacity 0.3s", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#000" }}>{post.avatar}</div>
                        <span style={{ fontWeight: 600 }}>{post.user}</span>
                        <Badge>{post.category}</Badge>
                        <span style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{post.date}</span>
                        {post.hidden && <Badge tone="warn">HIDDEN</Badge>}
                      </div>
                      <h4 style={{ fontSize: 15, margin: "0 0 6px", lineHeight: 1.3 }}>{post.title}</h4>
                      <p style={{ fontSize: 13, color: C.paperDim, lineHeight: 1.5 }}>{post.body.slice(0, 150)}...</p>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>▲ {post.upvotes} upvotes · 💬 {post.replies} replies · 👁 {post.views.toLocaleString()} views</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexShrink: 0, flexWrap: "wrap" }}>
                      <button onClick={() => setForumMod(forumMod.map(p => p.id === post.id ? { ...p, hidden: !p.hidden } : p))} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.lineStrong}`, background: post.hidden ? "rgba(0,230,118,0.1)" : "rgba(255,196,0,0.1)", color: post.hidden ? C.verified : C.amber, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
                        {post.hidden ? "Restore" : "Hide"}
                      </button>
                      <Button variant="danger" onClick={() => setForumMod(forumMod.filter(p => p.id !== post.id))} style={{ padding: "7px 12px" }}><Trash2 size={13} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* ─── SYSTEM TOOLS ─── */}
          {tab === "tools" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              {[
                { title: "Flag Risk Brokers", desc: "Automatically tag all brokers with a score below 5 as 'High risk review'. Updates registry instantly.", action: handleHighlightRisk, icon: "⚠️", tone: "warn", btnLabel: "Run Auto-Flag" },
                { title: "Publish Pending Queue", desc: "Move all pending exposure reports to published status. Use after batch reviewing submissions.", action: handleBulkReview, icon: "✅", tone: "reg", btnLabel: "Publish All Pending" },
                { title: "Sync Registry", desc: "Refresh data from the live server. Use when expecting database updates from external sources.", action: () => window.location.reload(), icon: "🔄", tone: "pending", btnLabel: "Sync Now" },
                { title: "Export Registry CSV", desc: "Download all broker records as a CSV file for offline analysis or reporting.", action: () => { const csv = brokers.map(b => `${b.name},${b.score},${b.country},${b.regulator}`).join("\n"); notify("CSV export prepared. (Demo — copy console output)"); console.log("NAME,SCORE,COUNTRY,REGULATOR\n" + csv); }, icon: "📥", tone: "pending", btnLabel: "Export CSV" },
                { title: "Clear All Rejected", desc: "Permanently remove all rejected exposure files from the database to keep the queue clean.", action: () => { setExposures(exposures.filter(e => e.status !== "rejected")); notify("Rejected exposures cleared.", "warn"); }, icon: "🗑", tone: "warn", btnLabel: "Clear Rejected" },
                { title: "Platform Statistics", desc: `Registry: ${brokers.length} brokers · Exposures: ${exposures.length} total · News: ${news.length} articles · Forum: ${forumMod.length} posts · Alerts: ${alerts.length} active`, action: null, icon: "📊", tone: "reg", btnLabel: null },
              ].map((tool) => (
                <GlassCard key={tool.title} style={{ padding: 24 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{tool.icon}</div>
                  <Badge tone={tool.tone}>{tool.title}</Badge>
                  <p style={{ color: C.paperDim, lineHeight: 1.6, fontSize: 13, margin: "12px 0 18px" }}>{tool.desc}</p>
                  {tool.btnLabel && tool.action && (
                    <Button onClick={tool.action} style={{ width: "100%", justifyContent: "center" }}>{tool.btnLabel}</Button>
                  )}
                </GlassCard>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
/* ---------------------------------------------------------
   TICKER TAPE COMPONENT
--------------------------------------------------------- */
function TickerTape({ pairs }) {
  return (
    <div className="ticker-tape">
      <div className="ticker-tape-track">
        {[...pairs, ...pairs, ...pairs, ...pairs].map((pair, i) => {
          const isUp = Number(pair.change) >= 0;
          return (
            <div className="ticker-item" key={i}>
              <span className="ticker-symbol">{pair.symbol}</span>
              <span className="ticker-price">{pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
              <span className={`ticker-change ${isUp ? 'ticker-up' : 'ticker-down'}`}>
                {isUp ? '+' : ''}{pair.change}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   EDUCATION & TOOLS PAGES
--------------------------------------------------------- */
function EducationPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 12 }}>Trader Education Hub</h1>
      <p style={{ color: C.paperDim, fontSize: 15, marginBottom: 32 }}>Learn how to identify legitimate brokers and protect your capital from sophisticated scams.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {[
          { title: "Beginner's Guide to Forex Regulations", desc: "Understanding the difference between Tier-1 (FCA, ASIC) and offshore licenses.", time: "10 min read" },
          { title: "How to Spot a Clone Broker", desc: "Clones use real license numbers but fake websites. Learn the tell-tale signs.", time: "8 min read" },
          { title: "The Reality of 'Guaranteed Returns'", desc: "Why promises of fixed monthly profits are mathematically impossible in live markets.", time: "12 min read" },
          { title: "Understanding Slippage vs Manipulation", desc: "How to tell if your broker is intentionally widening spreads to hunt your stop losses.", time: "15 min read" },
        ].map((course, i) => (
          <GlassCard key={i} style={{ padding: 24, borderRadius: 12, border: `1px solid ${C.lineStrong}`, display: "flex", flexDirection: "column", gap: 12 }}>
            <Badge tone="reg">Course</Badge>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20 }}>{course.title}</h3>
            <p style={{ color: C.paperDim, fontSize: 13.5, lineHeight: 1.5, flex: 1 }}>{course.desc}</p>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{course.time}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ToolsPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 12 }}>EA & VPS Trading Tools</h1>
      <p style={{ color: C.paperDim, fontSize: 15, marginBottom: 32 }}>Enhance your trading environment with verified low-latency servers and trusted Expert Advisors.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 16 }}>Low Latency VPS</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { name: "London Equinix LD4", latency: "< 1ms", price: "$25/mo" },
              { name: "New York NY4", latency: "< 2ms", price: "$30/mo" },
              { name: "Tokyo TY3", latency: "< 2ms", price: "$35/mo" },
            ].map(vps => (
              <div key={vps.name} style={{ background: C.surface, padding: 18, borderRadius: 8, border: `1px solid ${C.lineStrong}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{vps.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Optimized for MT4/MT5</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge tone="reg">{vps.latency}</Badge>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{vps.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 16 }}>Verified EAs</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { name: "Grid Master Pro", type: "Mean Reversion", rating: "4.8" },
              { name: "Breakout Sniper", type: "Momentum", rating: "4.5" },
              { name: "Trend Follower EA", type: "Trend", rating: "4.2" },
            ].map(ea => (
              <div key={ea.name} style={{ background: C.surface, padding: 18, borderRadius: 8, border: `1px solid ${C.lineStrong}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{ea.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Strategy: {ea.type}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <span style={{ color: C.amber }}>★</span> <span style={{ fontWeight: 600 }}>{ea.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 12 }}>Live Streams & Media</h1>
      <p style={{ color: C.paperDim, fontSize: 15, marginBottom: 32 }}>Watch live market analysis and webinar recordings from industry experts.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {[
          { title: "NFP Live Trading Session", viewer: "Live - 1.2k Viewers", duration: "LIVE" },
          { title: "How to Trade Gold Breakouts", viewer: "Recorded", duration: "45:20" },
          { title: "Exposing Offshore Scams 2026", viewer: "Recorded", duration: "1:12:05" },
        ].map(vid => (
          <GlassCard key={vid.title} style={{ padding: 0, borderRadius: 12, border: `1px solid ${C.lineStrong}`, overflow: "hidden" }}>
            <div style={{ background: "var(--c-line)", height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--c-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</div>
              <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, padding: "2px 6px", borderRadius: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{vid.duration}</div>
            </div>
            <div style={{ padding: 16 }}>
              <Badge tone={vid.duration === "LIVE" ? "warn" : "reg"}>{vid.viewer}</Badge>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginTop: 12 }}>{vid.title}</h3>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function RegulatoryPage({ brokers, openDetail }) {
  const regulators = ["FCA", "ASIC", "CySEC", "Offshore"];
  const [selectedReg, setSelectedReg] = useState(null);

  const filtered = brokers.filter(b => selectedReg ? b.regulator.includes(selectedReg) || (selectedReg === "Offshore" && b.regulator.includes("Offshore")) : false);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 12 }}>Regulatory Centers</h1>
      <p style={{ color: C.paperDim, fontSize: 15, marginBottom: 32 }}>Filter and verify brokers by their official regulatory jurisdiction.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
        {regulators.map(reg => (
          <button key={reg} onClick={() => setSelectedReg(reg)} style={{ background: selectedReg === reg ? "var(--c-surface-hov)" : "var(--c-surface)", border: `1px solid ${selectedReg === reg ? C.verified : C.lineStrong}`, padding: 24, borderRadius: 8, cursor: "pointer", color: "var(--c-paper)", textAlign: "center", transition: "all 0.2s" }}>
            <h3 style={{ fontSize: 24, fontWeight: 700 }}>{reg}</h3>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>View regulated brokers</div>
          </button>
        ))}
      </div>

      {selectedReg && (
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 16 }}>Brokers Regulated by {selectedReg}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map(b => <BrokerCard key={b.id} b={b} onClick={() => openDetail(b)} onCompare={() => {}} isCompared={false} />)}
            {filtered.length === 0 && <div style={{ color: C.muted }}>No brokers found in this jurisdiction.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid var(--c-line)`, background: "var(--c-surface)", padding: "60px 32px 32px", marginTop: 60 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* App Promo Banner */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60, padding: "40px", background: "var(--gradient-hero)", border: `1px solid var(--c-line-strong)`, borderRadius: 16, alignItems: "center" }}>
          <div>
            <Badge tone="reg">📱 Mobile App</Badge>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginTop: 12, marginBottom: 12 }}>Check Any Broker in Seconds</h2>
            <p style={{ color: "var(--c-paper-dim)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Scan brokers, receive live scam alerts, and file exposures from anywhere. Download the Ledger Intelligence mobile app.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="primary">⬇ App Store</Button>
              <Button variant="ghost">⬇ Google Play</Button>
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 80 }}>📊</div>
        </div>

        {/* Footer Links Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
          {[
            { heading: "Platform", links: ["Registry", "All Brokers", "Leaderboard", "Market Pulse"] },
            { heading: "Safety Tools", links: ["Scam Alerts", "Exposure Desk", "Field Surveys", "Regulatory Centers"] },
            { heading: "Community", links: ["Forum", "Live Streams", "User Reviews", "Spread Calculator"] },
            { heading: "Learn", links: ["Education Hub", "EA/VPS Tools", "Industry News", "Trading Glossary"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--c-muted)", marginBottom: 16, fontFamily: "'IBM Plex Mono', monospace" }}>{col.heading}</div>
              {col.links.map(link => (
                <div key={link} style={{ fontSize: 14, color: "var(--c-paper-dim)", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--c-paper)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--c-paper-dim)"}>{link}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid var(--c-line)`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px dashed var(--c-verified)`, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-verified)", fontSize: 10 }}>✓</div>
            LEDGER
          </div>
          <div style={{ color: "var(--c-muted)", fontSize: 12 }}>© 2026 Ledger Intelligence. All rights reserved. For informational purposes only.</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------
   SCAM ALERTS PAGE
--------------------------------------------------------- */
function ScamAlertsPage({ alerts: propAlerts }) {
  const alerts = propAlerts || scamAlerts;
  const [filter, setFilter] = useState("All");
  const severities = ["All", "Critical", "High", "Medium"];
  const filtered = filter === "All" ? alerts : alerts.filter(a => a.severity === filter);
  const severityColor = { Critical: C.alert, High: "#FF6B00", Medium: C.amber };
  const severityBg = { Critical: "rgba(255,61,0,0.12)", High: "rgba(255,107,0,0.12)", Medium: "rgba(255,196,0,0.12)" };
  
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Badge tone="warn">⚠ Live Alert Feed</Badge>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, marginTop: 10, marginBottom: 10 }}>Scam Alert Board</h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 600 }}>Real-time warnings about fraudulent brokers, clone operations, and withdrawal theft cases verified by our intelligence network.</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
        {[
          { label: "Critical Alerts", value: alerts.filter(a => a.severity === "Critical").length, color: C.alert },
          { label: "High Severity", value: alerts.filter(a => a.severity === "High").length, color: "#FF6B00" },
          { label: "Active Investigations", value: "12", color: C.amber },
          { label: "Resolved This Month", value: "8", color: C.verified },
        ].map(stat => (
          <div key={stat.label} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, fontFamily: "'IBM Plex Mono', monospace" }}>{stat.value}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {severities.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 18px", borderRadius: 20, border: `1px solid ${filter === s ? severityColor[s] || C.verified : C.lineStrong}`, background: filter === s ? (severityBg[s] || "rgba(0,230,118,0.1)") : "transparent", color: filter === s ? (severityColor[s] || C.verified) : C.paperDim, cursor: "pointer", fontWeight: filter === s ? 700 : 400, fontSize: 13, transition: "all 0.2s" }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map(alert => (
          <div key={alert.id} style={{ background: C.surface, border: `1px solid ${severityColor[alert.severity]}33`, borderLeft: `4px solid ${severityColor[alert.severity]}`, borderRadius: 12, padding: "24px 28px", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>{alert.broker}</span>
                  <Badge tone={alert.severity === "Critical" ? "warn" : "pending"}>{alert.severity}</Badge>
                  <Badge>{alert.type}</Badge>
                </div>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>📍 {alert.country} · Regulators Notified: {alert.regulator} · {alert.date}</div>
              </div>
            </div>
            <p style={{ color: C.paperDim, fontSize: 14, lineHeight: 1.6 }}>{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   FIELD SURVEY PAGE
--------------------------------------------------------- */
function FieldSurveyPage({ surveys: propSurveys }) {
  const surveys = propSurveys || fieldSurveys;
  const statusColor = { Verified: C.verified, Suspicious: C.amber, Fraudulent: C.alert };
  const statusBg = { Verified: "rgba(0,230,118,0.1)", Suspicious: "rgba(255,196,0,0.1)", Fraudulent: "rgba(255,61,0,0.1)" };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Badge tone="reg">🔍 On-Site Inspection Reports</Badge>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, marginTop: 10, marginBottom: 10 }}>Field Survey Reports</h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 600 }}>Our teams physically visit broker offices worldwide to verify registration addresses, staff presence, and operational legitimacy.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 24 }}>
        {surveys.map(fs => (
          <div key={fs.id} style={{ background: C.surface, border: `1px solid ${statusColor[fs.status]}33`, borderRadius: 16, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
            {/* Status ribbon */}
            <div style={{ position: "absolute", top: 20, right: -8, background: statusColor[fs.status], color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 20px", transform: "rotate(0deg)", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{fs.status}</div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: statusBg[fs.status], border: `1px solid ${statusColor[fs.status]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {fs.status === "Verified" ? "✅" : fs.status === "Suspicious" ? "⚠️" : "🚨"}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 4 }}>{fs.broker}</h3>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>📍 {fs.address}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Country</div>
                <div style={{ fontWeight: 600, marginTop: 2, fontSize: 13 }}>{fs.country}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Score</div>
                <div style={{ fontWeight: 700, color: statusColor[fs.status], marginTop: 2, fontSize: 13 }}>{fs.score}/10</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Survey Date</div>
                <div style={{ fontWeight: 600, marginTop: 2, fontSize: 13 }}>{fs.date}</div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid var(--c-line)`, paddingTop: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 8 }}>Field Findings</div>
              <p style={{ color: C.paperDim, fontSize: 14, lineHeight: 1.6 }}>{fs.findings}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   FORUM / COMMUNITY PAGE
--------------------------------------------------------- */
function ForumPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Broker Discussion", "Scam Alert", "Education", "Trading Tools"];
  const filtered = activeCategory === "All" ? forumPosts : forumPosts.filter(p => p.category === activeCategory);
  const categoryColor = { "Scam Alert": C.alert, "Education": C.verified, "Broker Discussion": "#6C8EF5", "Trading Tools": C.amber };
  const [votes, setVotes] = useState(Object.fromEntries(forumPosts.map(p => [p.id, p.upvotes])));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Badge tone="reg">💬 Trader Community</Badge>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, marginTop: 10, marginBottom: 10 }}>Community Forum</h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 600 }}>Discuss brokers, share experiences, report suspicious activity, and learn from the community.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
        {[{ label: "Active Topics", value: "2,840" }, { label: "Community Members", value: "48.2K" }, { label: "Posts Today", value: "347" }, { label: "Verified Brokers", value: "1,204" }].map(s => (
          <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 12, padding: "18px 22px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{ padding: "8px 18px", borderRadius: 20, border: `1px solid ${activeCategory === c ? (categoryColor[c] || C.verified) : C.lineStrong}`, background: activeCategory === c ? `${categoryColor[c] || C.verified}18` : "transparent", color: activeCategory === c ? (categoryColor[c] || C.verified) : C.paperDim, cursor: "pointer", fontWeight: activeCategory === c ? 700 : 400, fontSize: 13, transition: "all 0.2s" }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(post => (
          <div key={post.id} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 14, padding: "24px 28px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "start", transition: "all 0.2s", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.verified + "44"; e.currentTarget.style.transform = "translateX(4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.lineStrong; e.currentTarget.style.transform = "translateX(0)"; }}>

            {/* Upvote */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <button onClick={() => setVotes(v => ({ ...v, [post.id]: v[post.id] + 1 }))} style={{ background: "rgba(0,230,118,0.1)", border: `1px solid ${C.verified}33`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: C.verified, fontSize: 16, transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,230,118,0.2)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(0,230,118,0.1)"}>▲</button>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{votes[post.id]}</span>
            </div>

            {/* Content */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 4, background: `${categoryColor[post.category] || C.verified}18`, color: categoryColor[post.category] || C.verified, fontWeight: 600 }}>{post.category}</span>
              </div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 8, lineHeight: 1.3 }}>{post.title}</h3>
              <p style={{ color: C.paperDim, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{post.body.slice(0, 120)}...</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: C.muted }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#000" }}>{post.avatar}</div>
                  <span>{post.user}</span>
                </div>
                <span>💬 {post.replies} replies</span>
                <span>👁 {post.views.toLocaleString()} views</span>
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SPREAD CALCULATOR PAGE
--------------------------------------------------------- */
function SpreadCalculatorPage() {
  const [lots, setLots] = useState(1);
  const [category, setCategory] = useState("Majors");
  const categories = ["Majors", "Metals", "Crypto", "Crosses"];
  const filtered = spreadCalcPairs.filter(p => p.category === category);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Badge tone="reg">🧮 Trading Tools</Badge>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, marginTop: 10, marginBottom: 10 }}>Spread Cost Calculator</h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 600 }}>Calculate the true cost of trading spreads before you open a position. Compare costs across different brokers and instruments.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
        {/* Controls */}
        <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 16, padding: 28, position: "sticky", top: 90, height: "fit-content" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 20 }}>Configure Trade</h3>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", display: "block", marginBottom: 8 }}>Lot Size</label>
            <input type="number" value={lots} min={0.01} step={0.1} onChange={e => setLots(Number(e.target.value))} style={{ width: "100%", background: "var(--c-ink)", border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: "10px 14px", color: "var(--c-paper)", fontSize: 16, fontFamily: "'IBM Plex Mono', monospace" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", display: "block", marginBottom: 8 }}>Category</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${category === c ? C.verified : C.lineStrong}`, background: category === c ? "rgba(0,230,118,0.1)" : "transparent", color: category === c ? C.verified : C.paperDim, cursor: "pointer", fontWeight: category === c ? 700 : 400, textAlign: "left", transition: "all 0.2s" }}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(0,230,118,0.08)", border: `1px solid rgba(0,230,118,0.2)`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>FORMULA</div>
            <div style={{ fontSize: 13, color: C.paperDim }}>Cost = Spread × Lot Size × Pip Value</div>
          </div>
        </div>

        {/* Results Table */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, padding: "12px 20px", fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", borderBottom: `1px solid ${C.lineStrong}` }}>
              <span>Instrument</span><span>Spread (pips)</span><span>Pip Value</span><span style={{ color: C.verified }}>Total Cost (USD)</span>
            </div>
            {filtered.map((p, i) => {
              const cost = (p.spread * lots * p.pip_value).toFixed(2);
              return (
                <div key={p.pair} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, padding: "18px 20px", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)", borderRadius: 8, alignItems: "center", border: "1px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,230,118,0.04)"; e.currentTarget.style.borderColor = "rgba(0,230,118,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "transparent"; }}>
                  <span style={{ fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{p.pair}</span>
                  <span style={{ color: C.paperDim }}>{p.spread}</span>
                  <span style={{ color: C.paperDim }}>${p.pip_value}</span>
                  <span style={{ fontWeight: 700, color: C.verified, fontSize: 16 }}>${cost}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN ROOT EXPORT
--------------------------------------------------------- */

export default function App() {
  const [view, setView] = useState("home");
  const [brokerSearch, setBrokerSearch] = useState("");
  const [isLight, setIsLight] = useState(() => {
    const saved = localStorage.getItem("ledger-theme") === "light";
    document.documentElement.setAttribute("data-theme", saved ? "light" : "dark");
    return saved;
  });
  const [brokers, setBrokers] = useState(initialBrokers);
  const [exposures, setExposures] = useState(initialExposures);
  const [news, setNews] = useState(initialNews);
  const [surveys, setSurveys] = useState(fieldSurveys);
  const [alerts, setAlerts] = useState(scamAlerts);
  const [selected, setSelected] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState("");

  useEffect(() => {
    async function loadData() {
      const b = await fetchAPI("/brokers");
      const e = await fetchAPI("/exposures");
      const n = await fetchAPI("/news");
      const s = await fetchAPI("/field-surveys");
      const a = await fetchAPI("/scam-alerts");
      if (Array.isArray(b) && b.length > 0) setBrokers(b.map(normalizeBroker));
      if (Array.isArray(e) && e.length > 0) setExposures(e.map(normalizeExposure));
      if (Array.isArray(n) && n.length > 0) setNews(n.map(normalizeNews));
      if (Array.isArray(s) && s.length > 0) setSurveys(s.map(normalizeSurvey));
      if (Array.isArray(a) && a.length > 0) setAlerts(a.map(normalizeAlert));
    }
    loadData();
  }, []);

  function toggleCompare(broker) {
    if (compareList.some(x => x.id === broker.id)) {
      setCompareList(compareList.filter(x => x.id !== broker.id));
    } else {
      if (compareList.length >= 4) return;
      setCompareList([...compareList, broker]);
    }
  }

  async function handleAddExposure(report) {
    const item = {
      id: "e" + Date.now(),
      brokerName: report.brokerName,
      title: report.title,
      text: report.text,
      amount: report.amount,
      date: new Date().toISOString().slice(0, 10),
      status: "pending"
    };
    const saved = await fetchAPI("/exposures", {
      method: "POST",
      body: JSON.stringify({
        broker_name: item.brokerName,
        title: item.title,
        details: item.text,
        disputed_amount: item.amount,
        reporter_email: report.email,
      }),
    });
    if (!saved) return false;
    setExposures([normalizeExposure(saved), ...exposures]);
    return true;
  }

  function toggleTheme() {
    setIsLight((current) => {
      const next = !current;
      localStorage.setItem("ledger-theme", next ? "light" : "dark");
      document.documentElement.setAttribute("data-theme", next ? "light" : "dark");
      return next;
    });
  }

  function handleAdminLogin(event) {
    event.preventDefault();
    if (adminUser.trim().toLowerCase() === "admin" && adminPasscode === "admin123") {
      setAdminAuthed(true);
      setAdminLoginError("");
      return;
    }
    setAdminLoginError("Access denied. Check your administrator ID and password.");
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <Header
        view={view}
        setView={setView}
        compareList={compareList}
        openCompare={() => setCompareOpen(true)}
        isLight={isLight}
        toggleTheme={toggleTheme}
        adminAuthed={adminAuthed}
        onLoginClick={() => setView("admin")}
        onLogout={() => { setAdminAuthed(false); setView("home"); }}
      />

      <TickerTape pairs={marketPairs} />

      {view === "home" && <div className="view-transition-wrap"><Home brokers={brokers} exposures={exposures} setView={setView} openDetail={setSelected} toggleCompare={toggleCompare} compareList={compareList} isLight={isLight} setBrokerSearch={setBrokerSearch} /></div>}
      {view === "brokers" && <div className="view-transition-wrap"><BrokersPage brokers={brokers} openDetail={setSelected} toggleCompare={toggleCompare} compareList={compareList} initialQuery={brokerSearch} /></div>}
      {view === "market" && <div className="view-transition-wrap"><MarketPage /></div>}
      {view === "rankings" && <div className="view-transition-wrap"><LeaderboardPage brokers={brokers} /></div>}
      {view === "exposure" && <div className="view-transition-wrap"><ExposurePage exposures={exposures} brokers={brokers} onSubmitReport={handleAddExposure} /></div>}
      {view === "news" && (
        <div className="view-transition-wrap" style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 24 }}>Dispatches & Intelligence</h1>
          {news.map(n => (
            <div key={n.id} style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 24, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <Badge tone="reg">{n.category}</Badge>
                <span style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{n.date}</span>
              </div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 6 }}>{n.title}</h3>
              <p style={{ color: C.paperDim, fontSize: 14 }}>{n.summary}</p>
            </div>
          ))}
        </div>
      )}
      {view === "education" && <div className="view-transition-wrap"><EducationPage /></div>}
      {view === "tools" && <div className="view-transition-wrap"><ToolsPage /></div>}
      {view === "media" && <div className="view-transition-wrap"><MediaPage /></div>}
      {view === "regulators" && <div className="view-transition-wrap"><RegulatoryPage brokers={brokers} openDetail={setSelected} /></div>}
      {view === "scam-alerts" && <div className="view-transition-wrap"><ScamAlertsPage alerts={alerts} /></div>}
      {view === "field-survey" && <div className="view-transition-wrap"><FieldSurveyPage surveys={surveys} /></div>}
      {view === "forum" && <div className="view-transition-wrap"><ForumPage /></div>}
      {view === "calculator" && <div className="view-transition-wrap"><SpreadCalculatorPage /></div>}
      {view === "admin" && (
        adminAuthed ? (
          <div className="view-transition-wrap"><AdminPanel brokers={brokers} setBrokers={setBrokers} exposures={exposures} setExposures={setExposures} news={news} setNews={setNews} alerts={alerts} setAlerts={setAlerts} surveys={surveys} setSurveys={setSurveys} onLogout={() => setAdminAuthed(false)} /></div>
        ) : (
          <main className="admin-login-page view-transition-wrap">
            <div className="admin-login-orbit orbit-one" /><div className="admin-login-orbit orbit-two" />
            <section className="admin-login-card">
              <div className="admin-login-brand"><div className="admin-login-mark"><ShieldCheck size={22} /></div><div><span>LEDGER // CONTROL</span><strong>Administrator access</strong></div></div>
              <div className="admin-login-intro"><Badge tone="reg"><Lock size={11} /> SECURE CHANNEL</Badge><h1>Welcome back.</h1><p>Sign in to monitor the registry, review exposure files, and publish intelligence.</p></div>
              <form onSubmit={handleAdminLogin} className="admin-login-form">
                <Field label="Administrator ID"><input required autoComplete="username" style={inputStyle} value={adminUser} onChange={e => { setAdminUser(e.target.value); setAdminLoginError(""); }} placeholder="admin" /></Field>
                <Field label="Password"><div className="password-field"><input required autoComplete="current-password" type={showAdminPassword ? "text" : "password"} style={inputStyle} value={adminPasscode} onChange={e => { setAdminPasscode(e.target.value); setAdminLoginError(""); }} placeholder="Enter administrator password" /><button type="button" className="password-toggle" aria-label={showAdminPassword ? "Hide password" : "Show password"} onClick={() => setShowAdminPassword(!showAdminPassword)}>{showAdminPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></Field>
                {adminLoginError && <div className="admin-login-error" role="alert"><AlertTriangle size={15} />{adminLoginError}</div>}
                <Button type="submit" style={{ width: "100%", justifyContent: "center", padding: "12px 16px" }}><LogIn size={15} /> Login </Button>
              </form>
              <div className="admin-login-footer"><span><i className="status-light" /> Registry systems online</span><span>Demo ID: admin</span></div>
            </section>
          </main>
        )
      )}

      {view === "home" && <LedgerChatbot brokers={brokers} exposures={exposures} setView={setView} />}
      <DetailModal broker={selected} exposures={exposures} onClose={() => setSelected(null)} />
      {compareOpen && <ComparisonModal items={compareList} onClose={() => setCompareOpen(false)} onRemove={(id) => setCompareList(compareList.filter(x => x.id !== id))} />}
      <Footer />
    </div>
  );
}

function buildRiskBrief(broker, exposures) {
  const relatedCases = exposures.filter((exposure) => exposure.brokerName?.toLowerCase() === broker.name?.toLowerCase());
  const flagCount = broker.flags?.length || 0;
  const score = Number(broker.score || 0);
  const riskLevel = flagCount >= 2 || score < 4 ? "Critical" : flagCount > 0 || score < 7 ? "Elevated" : "Low concern";
  const reasons = [];
  if (flagCount) reasons.push(`${flagCount} risk signal${flagCount > 1 ? "s" : ""} on file`);
  if (relatedCases.length) reasons.push(`${relatedCases.length} public exposure case${relatedCases.length > 1 ? "s" : ""}`);
  if (broker.regulator?.toLowerCase().includes("offshore") || broker.regulator?.toLowerCase().includes("unregistered")) reasons.push("limited regulatory jurisdiction");
  if (!reasons.length) reasons.push("no recorded flags or public exposure cases");
  return { riskLevel, reasons, recommendation: riskLevel === "Low concern" ? "Proceed to license verification and read the full dossier." : "Pause funding until the regulator, license, and withdrawal history are independently verified." };
}

function AIRiskAnalyst({ brokers, exposures, openDetail }) {
  const [brokerId, setBrokerId] = useState(brokers[0]?.id || "");
  const broker = brokers.find((item) => item.id === brokerId) || brokers[0];
  if (!broker) return null;
  const brief = buildRiskBrief(broker, exposures);
  const tone = brief.riskLevel === "Critical" ? "warn" : brief.riskLevel === "Elevated" ? "pending" : "reg";

  return (
    <section className="ai-analyst">
      <div className="ai-analyst-heading"><div><Badge tone="reg"><Sparkles size={12} /> AI ANALYST</Badge><h2>Instant risk briefing</h2><p>Evidence-weighted guidance from the live Ledger registry.</p></div><Activity size={34} color={C.verified} /></div>
      <div className="ai-analyst-controls"><label htmlFor="ai-broker">Analyze a broker</label><select id="ai-broker" value={brokerId} onChange={(event) => setBrokerId(event.target.value)}>{brokers.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><Button variant="subtle" onClick={() => openDetail(broker)}>Open dossier <ArrowRight size={14} /></Button></div>
      <div className="ai-brief-result"><div><span className="ai-kicker">MODEL ASSESSMENT</span><strong className={`ai-risk ai-risk-${tone}`}>{brief.riskLevel}</strong></div><div><span className="ai-kicker">WHY IT MATTERS</span><p>{brief.reasons.join(" · ")}</p></div><div><span className="ai-kicker">NEXT ACTION</span><p>{brief.recommendation}</p></div></div>
    </section>
  );
}

function AdminOverview({ brokers, exposures, news }) {
  const trustBands = [
    { label: "High trust", range: "8.0 - 10", count: brokers.filter(b => Number(b.score) >= 8).length, color: C.verified },
    { label: "Watch list", range: "5.0 - 7.9", count: brokers.filter(b => Number(b.score) >= 5 && Number(b.score) < 8).length, color: C.amber },
    { label: "Critical", range: "0.0 - 4.9", count: brokers.filter(b => Number(b.score) < 5).length, color: C.alert },
  ];
  const totalExposures = exposures.length || 1;
  const exposureStates = [
    { label: "Published", count: exposures.filter(e => e.status === "published").length, color: C.verified },
    { label: "Pending", count: exposures.filter(e => e.status === "pending").length, color: C.amber },
    { label: "Rejected", count: exposures.filter(e => e.status === "rejected").length, color: C.alert },
  ];
  const scoreDistribution = [0, 2, 4, 6, 8].map((start) => ({
    label: `${start}-${start + 1.9}`,
    count: brokers.filter((broker) => Number(broker.score) >= start && Number(broker.score) < start + 2).length,
  }));
  const activityTrend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { label: date.toLocaleDateString("en-US", { weekday: "short" }), count: exposures.filter((item) => item.date === key).length };
  });
  const maxActivity = Math.max(...activityTrend.map((day) => day.count), 1);
  return (
    <div className="admin-overview">
      <div className="admin-chart-grid">
        <div className="admin-chart-panel"><div className="admin-panel-heading"><div><span className="ai-kicker">DISTRIBUTION</span><h3>Trust score bands</h3></div><BarChart3 size={18} color={C.verified} /></div><div className="trust-bars">{trustBands.map(band => <div className="trust-row" key={band.label}><div className="trust-label"><span>{band.label}</span><small>{band.range}</small><strong>{band.count}</strong></div><div className="trust-track"><div style={{ width: `${brokers.length ? Math.max((band.count / brokers.length) * 100, band.count ? 8 : 0) : 0}%`, background: band.color }} /></div></div>)}</div></div>
        <div className="admin-chart-panel"><div className="admin-panel-heading"><div><span className="ai-kicker">MODERATION</span><h3>Exposure pipeline</h3></div><Activity size={18} color={C.amber} /></div><div className="donut-wrap"><div className="exposure-donut" style={{ background: `conic-gradient(${C.verified} 0 ${(exposureStates[0].count / totalExposures) * 100}%, ${C.amber} ${(exposureStates[0].count / totalExposures) * 100}% ${((exposureStates[0].count + exposureStates[1].count) / totalExposures) * 100}%, ${C.alert} ${((exposureStates[0].count + exposureStates[1].count) / totalExposures) * 100}% 100%)` }}><div>{exposures.length}<small>FILES</small></div></div><div className="chart-legend">{exposureStates.map(state => <div key={state.label}><i style={{ background: state.color }} />{state.label}<strong>{state.count}</strong></div>)}</div></div></div>
        <div className="admin-chart-panel"><div className="admin-panel-heading"><div><span className="ai-kicker">QUALITY CONTROL</span><h3>Score distribution</h3></div><Scale size={18} color={C.verified} /></div><div className="score-chart">{scoreDistribution.map((band) => <div className="score-column" key={band.label}><div className="score-bar-track"><div className="score-bar" style={{ height: `${brokers.length ? Math.max((band.count / brokers.length) * 100, band.count ? 10 : 0) : 0}%` }}><span>{band.count}</span></div></div><small>{band.label}</small></div>)}</div><div className="chart-caption">Broker records grouped into two-point trust intervals.</div></div>
        <div className="admin-chart-panel"><div className="admin-panel-heading"><div><span className="ai-kicker">LAST 7 DAYS</span><h3>Exposure activity</h3></div><TrendingUp size={18} color={C.amber} /></div><div className="activity-chart">{activityTrend.map((day) => <div className="activity-column" key={day.label}><div className="activity-bar-track"><div className="activity-bar" style={{ height: `${Math.max((day.count / maxActivity) * 100, day.count ? 12 : 3)}%` }} /></div><strong>{day.count}</strong><small>{day.label}</small></div>)}</div><div className="chart-caption">New files logged by date from the live moderation queue.</div></div>
      </div>
      <div className="admin-activity"><div className="admin-panel-heading"><div><span className="ai-kicker">AUDIT TRAIL</span><h3>Latest registry activity</h3></div><span className="live-pulse">LIVE</span></div><div className="activity-list">{[...exposures].slice(0, 3).map(item => <div className="activity-item" key={item.id}><span className="activity-dot" /><div><strong>{item.status === "pending" ? "New exposure queued" : `Exposure ${item.status}`}</strong><p>{item.brokerName} · {item.title}</p></div><time>{item.date || "Today"}</time></div>)}{!exposures.length && <div className="empty-state">No exposure activity recorded yet.</div>}</div></div>
    </div>
  );
}

function getChatReply(question, brokers, exposures) {
  const query = question.toLowerCase();
  const highestRated = [...brokers].sort((a, b) => Number(b.score) - Number(a.score))[0];
  const flagged = brokers.filter((broker) => broker.flags?.length > 0);
  const pending = exposures.filter((exposure) => exposure.status === "pending").length;
  if (query.includes("safe") || query.includes("recommend") || query.includes("best") || query.includes("strongest")) {
    return `${highestRated?.name || "The highest-rated broker"} currently leads the registry at ${Number(highestRated?.score || 0).toFixed(1)}/10. Review its full dossier and verify the license independently before funding.`;
  }
  if (query.includes("risk") || query.includes("flag") || query.includes("warning")) {
    return `${flagged.length} broker${flagged.length === 1 ? " has" : "s have"} active risk signals. ${flagged.slice(0, 3).map((broker) => broker.name).join(", ") || "No flagged brokers are currently indexed"}.`;
  }
  if (query.includes("complaint") || query.includes("exposure") || query.includes("dispute")) {
    return `${exposures.length} exposure file${exposures.length === 1 ? " is" : "s are"} indexed, with ${pending} awaiting moderation. Open Exposure Desk to inspect the published case history.`;
  }
  if (query.includes("compare")) return "Select the scale icon on up to four broker cards, then open Compare for a side-by-side audit of scores, regulation, leverage, and flags.";
  return "I can help you scan broker risk, find the strongest record, explain exposure activity, or guide you through comparison. What would you like to inspect?";
}

function LedgerChatbot({ brokers, exposures, setView }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Welcome to Ledger Intelligence. Ask me about broker risk, complaints, or comparisons." }]);
  const quickQuestions = ["Which broker looks strongest?", "Show me the risk signals", "How many complaints are indexed?"];

  function sendMessage(event, preset) {
    event?.preventDefault();
    const text = (preset || question).trim();
    if (!text) return;
    setMessages((current) => [...current, { role: "user", text }, { role: "assistant", text: getChatReply(text, brokers, exposures) }]);
    setQuestion("");
  }

  return (
    <div className={`ledger-chatbot ${open ? "is-open" : ""}`}>
      {open && <section className="chat-window" aria-label="Ledger Intelligence assistant">
        <div className="chat-header"><div className="chat-avatar"><Sparkles size={16} /></div><div><strong>Ledger Intelligence</strong><span><i /> Registry-aware assistant</span></div><button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>×</button></div>
        <div className="chat-messages">{messages.map((message, index) => <div className={`chat-message chat-${message.role}`} key={`${message.role}-${index}`}><span>{message.text}</span></div>)}</div>
        <div className="chat-quick-actions">{quickQuestions.map((prompt) => <button type="button" key={prompt} onClick={() => sendMessage(null, prompt)}>{prompt}</button>)}</div>
        <form className="chat-input" onSubmit={sendMessage}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask the registry..." aria-label="Ask the registry" /><button type="submit" aria-label="Send message"><Send size={15} /></button></form>
        <button className="chat-link" type="button" onClick={() => { setView("exposure"); setOpen(false); }}>Open Exposure Desk <ArrowRight size={13} /></button>
      </section>}
      {!open && <button className="chat-launcher" type="button" onClick={() => setOpen(true)} aria-label="Open Ledger Intelligence assistant"><MessageCircle size={20} /><span>Ask Ledger</span><i /></button>}
    </div>
  );
}
