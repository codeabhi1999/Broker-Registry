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

   abhijit
--------------------------------------------------------- */
const API_BASE = "http://localhost:5000/api";

const C = {
  ink:         "var(--c-ink)",
  surface:     "var(--c-surface)",
  surfaceHi:   "var(--c-surface-hi)",
  surfaceHover:"var(--c-surface-hov)",
  paper:       "var(--c-paper)",
  paperDim:    "var(--c-paper-dim)",
  muted:       "var(--c-muted)",
  verified:    "var(--c-verified)",
  verifiedDim: "var(--c-verified-dim)",
  alert:       "var(--c-alert)",
  alertDim:    "var(--c-alert-dim)",
  amber:       "var(--c-amber)",
  amberDim:    "var(--c-amber-dim)",
  line:        "var(--c-line)",
  lineStrong:  "var(--c-line-strong)",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

// Initial seed data if PostgreSQL is booting or offline
const initialBrokers = [
  { id: "b1", name: "Solaris Prime", years: 16, score: 9.4, regulator: "FCA, ASIC, FSCA", license: "UK-771102", country: "United Kingdom", type: "ECN", min_deposit: 100, max_leverage: "1:500", flags: [] },
  { id: "b2", name: "Vantage Global", years: 12, score: 9.1, regulator: "ASIC, FCA", license: "MM-208841", country: "Australia", type: "ECN", min_deposit: 50, max_leverage: "1:500", flags: [] },
  { id: "b3", name: "Halcyon Capital", years: 9, score: 8.6, regulator: "CySEC", license: "CY-118820", country: "Cyprus", type: "STP", min_deposit: 200, max_leverage: "1:30", flags: [] },
  { id: "b4", name: "Northbridge FX", years: 4, score: 5.2, regulator: "Offshore (SVG)", license: "SVG-33211", country: "St. Vincent", type: "Market Maker", min_deposit: 10, max_leverage: "1:1000", flags: ["Offshore registration"] },
  { id: "b5", name: "Copperline Trade", years: 2, score: 4.1, regulator: "Offshore (Vanuatu)", license: "VU-44092", country: "Vanuatu", type: "Market Maker", min_deposit: 20, max_leverage: "1:2000", flags: ["Frequent withdrawal delays"] },
  { id: "b6", name: "Reef Markets", years: 1, score: 2.8, regulator: "Unregistered", license: "—", country: "Unknown", type: "Unknown", min_deposit: 250, max_leverage: "1:500", flags: ["No physical registry", "Open dispute cases"] },
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

/* ---------------------------------------------------------
   DATA ADAPTER LAYER (Postgres with Local Fallback)
--------------------------------------------------------- */
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers }
    });
    if (!res.ok) throw new Error("API call failed");
    return await res.json();
  } catch (err) {
    return null; // Fallback will handle
  }
}

function normalizeBroker(broker) {
  return {
    ...broker,
    years: broker.years ?? broker.years_active ?? 0,
    license: broker.license ?? broker.license_no ?? "—",
    type: broker.type ?? broker.account_type ?? "Unknown",
    flags: Array.isArray(broker.flags) ? broker.flags : [],
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

/* ---------------------------------------------------------
   COMPONENTS
--------------------------------------------------------- */
function Stamp({ score, alert, size = 52 }) {
  const s = alert ? "var(--c-alert)" : "var(--c-verified)";
  const bg = alert ? "rgba(255,94,91,0.15)" : "rgba(54,199,154,0.15)";
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: `1.5px dashed ${s}`, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", color: s,
        background: bg, transform: "rotate(-5deg)", fontFamily: "'IBM Plex Mono', monospace",
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
    <div
      className={`glass-card-hover ${className}`}
      style={{
        background: "linear-gradient(145deg, var(--c-surface), var(--c-ink))",
        border: `1px solid var(--c-line-strong)`,
        borderRadius: 18,
        boxShadow: "0 24px 50px rgba(3, 7, 15, 0.25)",
        backdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", type = "button", style = {}, disabled }) {
  const base = {
    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
    padding: "9px 16px", borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", display: "inline-flex", alignItems: "center", gap: 7,
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", opacity: disabled ? 0.4 : 1,
    boxShadow: "0 10px 18px rgba(0,0,0,0.18)",
  };
  const variants = {
    primary: { background: "linear-gradient(135deg, #36C79A, #6fe0b6)", color: "#071c1a" },
    ghost: { background: "var(--c-surface)", color: "var(--c-paper)", border: `1px solid var(--c-line-strong)` },
    danger: { background: "linear-gradient(135deg, rgba(255,94,91,0.18), rgba(255,94,91,0.28))", color: "var(--c-alert)", border: `1px solid var(--c-alert)` },
    subtle: { background: "var(--c-surface)", color: "var(--c-paper)", border: `1px solid var(--c-line)` },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`ui-button button-${variant}`}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = "translateY(-1px)")}
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
    { id: "brokers", label: "All Brokers" },
    { id: "market", label: "Market Pulse" },
    { id: "rankings", label: "Leaderboard" },
    { id: "exposure", label: "Exposure Desk" },
    { id: "news", label: "Dispatches" },
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
    <div>
      <section className="home-hero tech-grid" style={{ position: "relative", overflow: "hidden", padding: "80px 24px 60px", borderBottom: `1px solid var(--c-line)`, background: "radial-gradient(ellipse at 80% -20%, var(--c-surface-hi) 0%, var(--c-ink) 70%)", transition: "background 0.3s ease" }}>


        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4 }}>
          <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "rgba(54,199,154,0.11)", top: -120, right: -40, filter: "blur(16px)" }} />
          <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "rgba(59,130,246,0.08)", bottom: -140, left: -30, filter: "blur(18px)" }} />
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.verified, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", border: `1px solid ${C.verifiedDim}`, padding: "4px 10px", borderRadius: 20, marginBottom: 20, background: "rgba(12, 32, 28, 0.55)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.verified }} />
            PostgreSQL Synchronized Registry · {brokers.length} Entities Indexed
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05, maxWidth: 740 }}>
            Audited transparency for <em style={{ color: C.verified, fontStyle: "italic" }}>forex and CFD brokers.</em>
          </h1>
          <p style={{ color: C.paperDim, fontSize: 17, maxWidth: 580, marginTop: 18, lineHeight: 1.6 }}>
            Cross-referencing tier-1 regulators, financial filings, and validated victim exposure logs to protect trader capital.
          </p>

          <div style={{ marginTop: 36, display: "flex", maxWidth: 680, background: "rgba(14,26,41,0.7)", border: `1px solid ${C.lineStrong}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.18)" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search broker, license, or country..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.paper, padding: "16px 18px", fontSize: 15 }}
            />
            <button
              onClick={() => { setBrokerSearch(q); setView("brokers"); }}
              style={{ background: "linear-gradient(135deg, #36C79A, #5ce2b3)", color: C.ink, border: "none", padding: "0 24px", fontWeight: 700, cursor: "pointer" }}
            >
              Examine
            </button>
          </div>
        </div>
      </section>

      <section className="telemetry-strip">
        <div className="telemetry-grid">
          {[
            [ShieldCheck, "Registry coverage", `${brokers.length} entities`, "Live indexed universe"],
            [Activity, "Average trust score", `${(brokers.reduce((sum, b) => sum + Number(b.score || 0), 0) / Math.max(brokers.length, 1)).toFixed(1)} / 10`, "Across all records"],
            [AlertOctagon, "Flagged entities", `${flaggedCount} requiring review`, "Risk signals on file"],
            [DollarSign, "Disputed capital", `$${disputedTotal.toLocaleString()}`, "Reported exposure value"],
          ].map(([Icon, label, value, note]) => (
            <div className="telemetry-cell" key={label}><Icon size={17} color={C.verified} /><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
          ))}
        </div>
      </section>

      <AIRiskAnalyst brokers={brokers} exposures={exposures} openDetail={openDetail} />
      <AICommandDeck brokers={brokers} exposures={exposures} setView={setView} openDetail={openDetail} />

      {/* Top 3 Brokers */}
      <section style={{ padding: "64px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 12, color: C.verified, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>Benchmark Leaders</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, marginTop: 4 }}>Top Rated Financial Institutions</h2>
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
      <section className="exposure-band" style={{ padding: "60px 24px", background: C.surface, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 12, color: C.alert, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>High-Risk Exposure</div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, marginTop: 4 }}>Recent Victim Complaints & Claims</h2>
            </div>
            <Button variant="ghost" onClick={() => setView("exposure")}>File a Claim →</Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
            {recentExposures.map(e => (
              <div key={e.id} style={{ background: C.ink, border: `1px solid ${C.lineStrong}`, padding: 22, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <Badge tone="warn">{e.brokerName}</Badge>
                  {e.amount && <span style={{ color: C.alert, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>${Number(e.amount).toLocaleString()} Disputed</span>}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{e.title}</h4>
                <p style={{ color: C.paperDim, fontSize: 13.5, lineHeight: 1.5 }}>{e.text}</p>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", marginTop: 14 }}>VERIFIED DOSSIER · {e.date}</div>
              </div>
            ))}
            {!recentExposures.length && <div className="empty-state-panel">No published exposure dossiers are available yet.</div>}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: C.verified, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>Market overview</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginTop: 6 }}>Live trading finance snapshot</h2>
          </div>
          <Button variant="ghost" onClick={() => setView("market")}>Open Market Pulse →</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {marketPairs.map((pair) => (
            <div key={pair.symbol} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong style={{ fontSize: 14 }}>{pair.symbol}</strong>
                <span style={{ color: Number(pair.change) >= 0 ? C.verified : C.alert, fontSize: 11, fontWeight: 700 }}>{pair.change > 0 ? "+" : ""}{pair.change}%</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>{pair.price.toLocaleString()}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>Spread {pair.spread} · {pair.volume}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, color: C.verified, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>Mediation center</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginTop: 6 }}>Resolved dispute activity</h2>
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
            <div key={label} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: 18 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.verified, fontSize: 26, marginBottom: 6 }}>{number}</div>
              <div style={{ color: C.paperDim, fontSize: 13 }}>{label}</div>
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
  return (
    <div
      style={{
        background: C.surface, border: `1px solid ${isFlagged ? C.alertDim : C.lineStrong}`,
        borderRadius: 8, padding: 22, display: "flex", flexDirection: "column",
        justifyContent: "space-between", transition: "transform 0.2s, border-color 0.2s"
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600 }}>{b.name}</h3>
            <div style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
              {b.years} Years Record · {b.country}
            </div>
          </div>
          <Stamp score={b.score} alert={isFlagged} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "14px 0" }}>
          <Badge tone="reg">{b.regulator}</Badge>
          <Badge>{b.type}</Badge>
          {b.flags.map((f, i) => <Badge key={i} tone="warn">{f}</Badge>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "10px 0", borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, fontSize: 12 }}>
          <div><span style={{ color: C.muted }}>Min Deposit:</span> ${b.min_deposit || 50}</div>
          <div><span style={{ color: C.muted }}>Leverage:</span> {b.max_leverage || '1:500'}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <Button variant="subtle" onClick={onClick} style={{ flex: 1, justifyContent: "center" }}>Dossier</Button>
        <Button
          variant={isCompared ? "primary" : "ghost"}
          onClick={(e) => { e.stopPropagation(); onCompare(); }}
          style={{ padding: "8px 10px" }}
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
  const ranked = [...brokers].sort((a, b) => Number(b.score) - Number(a.score));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 18 }}>
        <div>
          <div style={{ fontSize: 12, color: C.verified, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>Ranking dashboard</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginTop: 6 }}>Broker leaderboard</h1>
        </div>
        <Badge tone="reg">Live scoring snapshot</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {leaderboardMetrics.map((metric) => (
          <div key={metric.label} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: 18 }}>
            <div style={{ color: C.muted, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>{metric.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "10px 0 6px" }}>{metric.value}</div>
            <div style={{ color: C.paperDim, fontSize: 12 }}>Leader: {metric.leader}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ranked.map((broker, index) => (
          <div key={broker.id} style={{ display: "grid", gridTemplateColumns: "70px 1.2fr 1fr 1fr 1fr 120px", alignItems: "center", gap: 16, background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: "18px 20px" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.muted }}>#{index + 1}</div>
            <div>
              <div style={{ fontWeight: 700 }}>{broker.name}</div>
              <div style={{ color: C.paperDim, fontSize: 12 }}>{broker.country}</div>
            </div>
            <div><Badge tone={Number(broker.score) >= 8 ? "reg" : Number(broker.score) >= 5 ? "pending" : "warn"}>{broker.score}/10</Badge></div>
            <div style={{ color: C.paperDim, fontSize: 13 }}>{broker.regulator}</div>
            <div style={{ color: C.paperDim, fontSize: 13 }}>{broker.type}</div>
            <div style={{ textAlign: "right", fontWeight: 700 }}>{broker.min_deposit ? `$${broker.min_deposit}` : "-"}</div>
          </div>
        ))}
        {!ranked.length && <div className="empty-state-panel">No scored broker records are available for ranking.</div>}
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
            ["Regulator Bodies", broker.regulator],
            ["License ID", broker.license],
            ["Execution Type", broker.type],
            ["Minimum Deposit", `$${broker.min_deposit || 50}`],
            ["Max Leverage", broker.max_leverage || "1:500"],
            ["Infringement Flags", broker.flags.length ? broker.flags.join(", ") : "Clean Record"]
          ].map(([k, v]) => (
            <div key={k} style={{ background: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>{k}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>

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
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ADMIN PANEL (Full Database Management)
--------------------------------------------------------- */
function AdminPanel({ brokers, setBrokers, exposures, setExposures, news, setNews, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [newBroker, setNewBroker] = useState({ name: "", years: 5, score: 8.0, regulator: "", license: "", country: "", type: "ECN", min_deposit: 100, max_leverage: "1:500", flags: "" });
  const [newNews, setNewNews] = useState({ title: "", summary: "", category: "Regulation" });
  const [brokerSearch, setBrokerSearch] = useState("");
  const [exposureFilter, setExposureFilter] = useState("all");
  const [adminMessage, setAdminMessage] = useState("");

  const filteredBrokers = useMemo(() => brokers.filter((broker) => {
    const query = brokerSearch.trim().toLowerCase();
    if (!query) return true;
    return [broker.name, broker.country, broker.regulator, broker.license].join(" ").toLowerCase().includes(query);
  }), [brokers, brokerSearch]);

  const filteredExposures = useMemo(() => exposures.filter((item) => {
    if (exposureFilter === "all") return true;
    return item.status === exposureFilter;
  }), [exposures, exposureFilter]);

  const riskWatch = useMemo(() => brokers.filter((broker) => Number(broker.score) < 5 || (broker.flags || []).length > 0).slice(0, 4), [brokers]);

  async function handleAddBroker(e) {
    e.preventDefault();
    const payload = {
      ...newBroker,
      id: "b" + Date.now(),
      flags: newBroker.flags ? newBroker.flags.split(",").map(f => f.trim()) : []
    };
    const saved = await fetchAPI("/brokers", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        years_active: payload.years,
        license_no: payload.license,
        account_type: payload.type,
      }),
    });
    if (!saved) {
      setAdminMessage("Broker record was not saved. Check that the API and database are online.");
      return;
    }
    setBrokers([normalizeBroker(saved), ...brokers]);
    setAdminMessage("Broker record saved to PostgreSQL.");
    setNewBroker({ name: "", years: 5, score: 8.0, regulator: "", license: "", country: "", type: "ECN", min_deposit: 100, max_leverage: "1:500", flags: "" });
  }

  async function handleStatus(id, status) {
    const saved = await fetchAPI(`/exposures/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    if (!saved) {
      setAdminMessage("Exposure status was not saved.");
      return;
    }
    setExposures(exposures.map(e => e.id === id ? { ...e, status: saved.status || status } : e));
    setAdminMessage(`Exposure marked ${saved.status || status}.`);
  }

  async function handleDeleteExposure(id) {
    const deleted = await fetchAPI(`/exposures/${id}`, { method: "DELETE" });
    if (!deleted?.success) {
      setAdminMessage("Exposure file could not be deleted.");
      return;
    }
    setExposures(exposures.filter((item) => item.id !== id));
    setAdminMessage("Exposure file deleted.");
  }

  async function handleDeleteBroker(id) {
    const deleted = await fetchAPI(`/brokers/${id}`, { method: "DELETE" });
    if (!deleted?.success) {
      setAdminMessage("Broker record could not be deleted.");
      return;
    }
    setBrokers(brokers.filter((broker) => broker.id !== id));
    setAdminMessage("Broker record deleted.");
  }

  async function handleAddNews(e) {
    e.preventDefault();
    if (!newNews.title || !newNews.summary) return;
    const saved = await fetchAPI("/news", { method: "POST", body: JSON.stringify(newNews) });
    if (!saved) {
      setAdminMessage("Dispatch was not saved. Check that the API and database are online.");
      return;
    }
    setNews([normalizeNews(saved), ...news]);
    setAdminMessage("Dispatch saved to PostgreSQL.");
    setNewNews({ title: "", summary: "", category: "Regulation" });
  }

  async function handleDeleteNews(id) {
    const deleted = await fetchAPI(`/news/${id}`, { method: "DELETE" });
    if (!deleted?.success) {
      setAdminMessage("Dispatch could not be deleted.");
      return;
    }
    setNews(news.filter((article) => article.id !== id));
    setAdminMessage("Dispatch deleted.");
  }

  async function handleHighlightRisk() {
    const flaggedBrokers = brokers.filter((broker) => Number(broker.score) < 5 && !(broker.flags || []).includes("High risk review"));
    await Promise.all(flaggedBrokers.map((broker) => fetchAPI(`/brokers/${broker.id}`, {
      method: "PATCH",
      body: JSON.stringify({ flags: [...(broker.flags || []), "High risk review"] }),
    })));
    setBrokers((current) => current.map((broker) => flaggedBrokers.some((item) => item.id === broker.id)
      ? { ...broker, flags: [...(broker.flags || []), "High risk review"] }
      : broker));
    setAdminMessage(`${flaggedBrokers.length} risk record${flaggedBrokers.length === 1 ? "" : "s"} updated.`);
  }

  async function handleBulkReview() {
    const pendingExposures = exposures.filter((item) => item.status === "pending");
    await Promise.all(pendingExposures.map((item) => fetchAPI(`/exposures/${item.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "published" }),
    })));
    setExposures((current) => current.map((item) => item.status === "pending" ? { ...item, status: "published" } : item));
    setAdminMessage(`${pendingExposures.length} exposure file${pendingExposures.length === 1 ? "" : "s"} reviewed.`);
  }

  return (
    <div className="admin-shell" style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 32px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: `1px solid ${C.line}`, paddingBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>PostgreSQL Central Intelligence</h1>
          <div style={{ fontSize: 13, color: C.muted }}>Operational Database Administration</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={handleHighlightRisk}><AlertTriangle size={14} /> Flag risk</Button>
          <Button variant="subtle" onClick={handleBulkReview}><CheckCircle2 size={14} /> Review queue</Button>
          <Button variant="danger" onClick={onLogout}><LogOut size={14} /> Logout</Button>
        </div>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Admin sections">
          <div className="admin-sidebar-label">Control room</div>
          <nav className="admin-sidebar-nav">
            {[
              ["overview", LayoutDashboard, "Overview", "Pulse"],
              ["brokers", ShieldCheck, "Brokers", brokers.length],
              ["exposures", AlertTriangle, "Exposures", exposures.filter(e => e.status === "pending").length + " pending"],
              ["news", Newspaper, "Dispatches", news.length],
              ["tools", SlidersHorizontal, "Tools", "Actions"],
            ].map(([id, Icon, label, meta]) => (
              <button key={id} type="button" className={`admin-sidebar-link ${tab === id ? "is-active" : ""}`} onClick={() => setTab(id)}>
                <Icon size={17} /><span>{label}</span><small>{meta}</small>
              </button>
            ))}
          </nav>
          <div className="admin-sidebar-status"><i /> Database connected<strong>PostgreSQL</strong></div>
        </aside>

        <main className="admin-content">
          {adminMessage && <div role="status" style={{ marginBottom: 20, padding: "11px 14px", border: `1px solid ${C.verifiedDim}`, background: `${C.verifiedDim}55`, color: C.verified, borderRadius: 10, fontSize: 13 }}>{adminMessage}</div>}

          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                {[
                  ["Registry records", brokers.length, "Live database"],
                  ["Review queue", exposures.filter(e => e.status === "pending").length, "Needs triage"],
                  ["Published alerts", exposures.filter(e => e.status === "published").length, "Publicly visible"],
                  ["Risk watches", riskWatch.length, "Critical markers"],
                ].map(([label, value, note]) => (
                  <GlassCard key={label} style={{ padding: 18 }}>
                    <div style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: 30, fontWeight: 700, margin: "12px 0 6px" }}>{value}</div>
                    <div style={{ color: C.paperDim, fontSize: 12 }}>{note}</div>
                  </GlassCard>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
                <GlassCard style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>Signal feed</h3>
                    <Badge tone="reg">Live</Badge>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[...exposures].slice(0, 4).map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: `1px solid ${C.line}`, paddingBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{item.brokerName}</div>
                          <div style={{ color: C.paperDim, fontSize: 12 }}>{item.title}</div>
                        </div>
                        <Badge tone={item.status === "pending" ? "pending" : item.status === "rejected" ? "warn" : "reg"}>{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>Risk watch</h3>
                    <AlertTriangle size={18} color={C.alert} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {riskWatch.map((broker) => (
                      <div key={broker.id} style={{ background: "rgba(255,94,91,0.05)", border: `1px solid ${C.alertDim}`, borderRadius: 10, padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong>{broker.name}</strong>
                          <Badge tone="warn">{Number(broker.score).toFixed(1)}</Badge>
                        </div>
                        <div style={{ color: C.paperDim, fontSize: 12, marginTop: 6 }}>{(broker.flags || []).join(" • ") || "Due for review"}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
              <AdminOverview brokers={brokers} exposures={exposures} news={news} />
            </div>
          )}

          {tab === "brokers" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16, marginBottom: 16 }}>Insert New Broker File</h3>
                <form onSubmit={handleAddBroker}>
                  <Field label="Broker Name"><input required style={inputStyle} value={newBroker.name} onChange={e => setNewBroker({ ...newBroker, name: e.target.value })} /></Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Years"><input type="number" style={inputStyle} value={newBroker.years} onChange={e => setNewBroker({ ...newBroker, years: e.target.value })} /></Field>
                    <Field label="Score (0-10)"><input type="number" step="0.1" style={inputStyle} value={newBroker.score} onChange={e => setNewBroker({ ...newBroker, score: e.target.value })} /></Field>
                  </div>
                  <Field label="Regulators"><input required style={inputStyle} value={newBroker.regulator} onChange={e => setNewBroker({ ...newBroker, regulator: e.target.value })} placeholder="FCA, ASIC" /></Field>
                  <Field label="License Number"><input required style={inputStyle} value={newBroker.license} onChange={e => setNewBroker({ ...newBroker, license: e.target.value })} /></Field>
                  <Field label="Jurisdiction Country"><input required style={inputStyle} value={newBroker.country} onChange={e => setNewBroker({ ...newBroker, country: e.target.value })} /></Field>
                  <Field label="Infringement Flags (CSV)"><input style={inputStyle} value={newBroker.flags} onChange={e => setNewBroker({ ...newBroker, flags: e.target.value })} placeholder="Offshore, Withdrawal issues" /></Field>
                  <Button type="submit" style={{ width: "100%", justifyContent: "center" }}>Insert Record into DB</Button>
                </form>
              </GlassCard>

              <GlassCard style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 16 }}>Registry roster</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.ink, border: `1px solid ${C.lineStrong}`, borderRadius: 10, minWidth: 220, padding: "8px 12px" }}>
                    <Search size={14} color={C.muted} />
                    <input value={brokerSearch} onChange={(e) => setBrokerSearch(e.target.value)} placeholder="Search broker" style={{ background: "transparent", border: "none", outline: "none", color: C.paper, flex: 1 }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredBrokers.map((b) => (
                    <div key={b.id} style={{ background: "rgba(7,14,24,0.55)", border: `1px solid ${C.lineStrong}`, padding: 16, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{b.name} <span style={{ color: C.muted, fontWeight: 500 }}>({Number(b.score).toFixed(1)}/10)</span></div>
                        <div style={{ fontSize: 12, color: C.muted }}>{b.regulator} · {b.country}</div>
                      </div>
                      <Button variant="danger" onClick={() => handleDeleteBroker(b.id)}><Trash2 size={14} /></Button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {tab === "exposures" && (
            <GlassCard style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 16 }}>Exposure queue</h3>
                <select value={exposureFilter} onChange={(e) => setExposureFilter(e.target.value)} style={{ ...inputStyle, width: "auto", minWidth: 160 }}>
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filteredExposures.map((e) => (
                  <div key={e.id} style={{ background: "rgba(7,14,24,0.55)", border: `1px solid ${e.status === 'pending' ? C.amber : C.lineStrong}`, padding: 20, borderRadius: 12, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                        <Badge tone={e.status === "pending" ? "pending" : e.status === "rejected" ? "warn" : "reg"}>{e.status.toUpperCase()}</Badge>
                        <span style={{ fontWeight: 700 }}>{e.brokerName}</span>
                      </div>
                      <h4 style={{ fontSize: 15, margin: "4px 0" }}>{e.title}</h4>
                      <p style={{ color: C.paperDim, fontSize: 13.5 }}>{e.text}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {e.status === "pending" && (
                        <>
                          <Button variant="primary" onClick={() => handleStatus(e.id, "published")}><CheckCircle2 size={14} /> Publish</Button>
                          <Button variant="danger" onClick={() => handleStatus(e.id, "rejected")}><XCircle size={14} /> Reject</Button>
                        </>
                      )}
                      <Button variant="danger" onClick={() => handleDeleteExposure(e.id)}><Trash2 size={14} /> Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {tab === "news" && (
            <div className="admin-news-layout">
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16, marginBottom: 16 }}>Publish Intelligence</h3>
                <form onSubmit={handleAddNews}>
                  <Field label="Headline"><input required style={inputStyle} value={newNews.title} onChange={e => setNewNews({ ...newNews, title: e.target.value })} /></Field>
                  <Field label="Category"><select style={inputStyle} value={newNews.category} onChange={e => setNewNews({ ...newNews, category: e.target.value })}><option>Regulation</option><option>Education</option><option>Market Watch</option></select></Field>
                  <Field label="Briefing"><textarea required rows={6} style={{ ...inputStyle, resize: "vertical" }} value={newNews.summary} onChange={e => setNewNews({ ...newNews, summary: e.target.value })} /></Field>
                  <Button type="submit" style={{ width: "100%", justifyContent: "center" }}><Plus size={14} /> Publish Dispatch</Button>
                </form>
              </GlassCard>
              <GlassCard style={{ padding: 22 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {news.map((article) => (
                    <div key={article.id} style={{ background: "rgba(7,14,24,0.55)", border: `1px solid ${C.lineStrong}`, padding: 18, borderRadius: 12, display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
                      <div>
                        <Badge tone="reg">{article.category}</Badge>
                        <div style={{ fontWeight: 700, marginTop: 8 }}>{article.title}</div>
                        <div style={{ color: C.paperDim, fontSize: 13, marginTop: 5 }}>{article.summary}</div>
                      </div>
                      <Button variant="danger" onClick={() => handleDeleteNews(article.id)}><Trash2 size={14} /></Button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {tab === "tools" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
              {[
                { title: "Alert automation", desc: "Mark all low-score brokers with risk review tags.", action: handleHighlightRisk, tone: "warn" },
                { title: "Queue triage", desc: "Move all pending exposures into the reviewed state.", action: handleBulkReview, tone: "reg" },
                { title: "Sync registry", desc: "Refresh the current view from the live server state.", action: () => window.location.reload(), tone: "pending" }
              ].map((tool) => (
                <GlassCard key={tool.title} style={{ padding: 22 }}>
                  <Badge tone={tool.tone}>{tool.title}</Badge>
                  <h3 style={{ fontSize: 20, margin: "16px 0 8px" }}>{tool.title}</h3>
                  <p style={{ color: C.paperDim, lineHeight: 1.6, fontSize: 13 }}>{tool.desc}</p>
                  <Button onClick={tool.action} style={{ marginTop: 18, width: "100%", justifyContent: "center" }}>Run action</Button>
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
      if (Array.isArray(b)) setBrokers(b.map(normalizeBroker));
      if (Array.isArray(e)) setExposures(e.map(normalizeExposure));
      if (Array.isArray(n)) setNews(n.map(normalizeNews));
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
      {view === "admin" && (
        adminAuthed ? (
          <div className="view-transition-wrap"><AdminPanel brokers={brokers} setBrokers={setBrokers} exposures={exposures} setExposures={setExposures} news={news} setNews={setNews} onLogout={() => setAdminAuthed(false)} /></div>
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