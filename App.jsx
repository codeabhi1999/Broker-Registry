import React, { useState, useEffect, useMemo } from "react";
import {
  Search, ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, Newspaper,
  LayoutDashboard, LogOut, Plus, Trash2, Pencil, X, CheckCircle2,
  XCircle, Lock, ArrowRight, Radar, FileText, ChevronRight, ChevronDown, Menu,
  LogIn, Bell, UserCircle2, Activity, Mail, Eye, EyeOff, AlertOctagon,
  ArrowUpDown, Scale, ExternalLink, SlidersHorizontal, DollarSign, Globe, Sparkles, BarChart3, Sun, Moon, MessageCircle, Send,
  Zap, Award, Calculator, Check, Layers,
  Share2, ShieldAlert, Coins, Building2, Users, CheckSquare, History, FileWarning, ArrowUpRight, Camera
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
  blue: "var(--c-blue)",
  blueDim: "var(--c-blue-dim)",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

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
  {
    id: "fs1",
    broker: "Solaris Prime",
    country: "United Kingdom",
    address: "1 Canada Square, Level 38, Canary Wharf, London E14 5AA",
    score: 9.4,
    date: "2026-07-15",
    inspector: "Senior Examiner C. Davies (UK-ID #772)",
    coords: "51.5050° N, 0.0195° W",
    status: "Verified",
    findings: "Physical executive office confirmed at 1 Canada Square. Permanent staff of 45+ observed on trading operations and compliance floors. FCA regulatory license plaque prominently displayed at reception.",
    checkpoints: { staffOnSite: true, directoryListed: true, physicalLease: true, phoneActive: true },
    photos: [
      { tab: "Exterior", label: "Canary Wharf Tower", desc: "1 Canada Square commercial skyscraper entrance and security turnstiles" },
      { tab: "Reception", label: "Branded Reception", desc: "Permanent corporate reception desk with direct elevator access" },
      { tab: "Operations", label: "Institutional Floor", desc: "Trading technology, market surveillance and support teams on-site" },
      { tab: "License Wall", label: "FCA Registration", desc: "UK Companies House & FCA certificate registration verified" }
    ]
  },
  {
    id: "fs2",
    broker: "Vantage Global",
    country: "Australia",
    address: "Level 29, 31 Market Street, Sydney NSW 2000",
    score: 9.1,
    date: "2026-07-10",
    inspector: "Field Auditor R. Jenkins (AU-ID #409)",
    coords: "33.8715° S, 151.2065° E",
    status: "Verified",
    findings: "Verified full floor lease in central Sydney business district. Client support, institutional liquidity, and executive management rooms verified in active operation.",
    checkpoints: { staffOnSite: true, directoryListed: true, physicalLease: true, phoneActive: true },
    photos: [
      { tab: "Exterior", label: "Sydney Financial Center", desc: "Grade-A office complex located at 31 Market Street" },
      { tab: "Reception", label: "Client Greeting Hall", desc: "Digital directory confirmation and staffed front desk" },
      { tab: "Operations", label: "Dealing Room", desc: "Operations staff managing Asia-Pacific market execution" },
      { tab: "License Wall", label: "ASIC Plaque", desc: "Australian Financial Services License display plaque" }
    ]
  },
  {
    id: "fs3",
    broker: "Northbridge FX",
    country: "St. Vincent",
    address: "Suite 305, Griffith Corporate Centre, Kingstown, SVG",
    score: 5.2,
    date: "2026-08-01",
    inspector: "Offshore Inspector M. Santos (SVG-ID #114)",
    coords: "13.1557° N, 61.2248° W",
    status: "Suspicious",
    findings: "Address is a multi-tenant virtual mailbox facility housing over 2,000 registered shell entities. No operational staff or equipment present. Incoming phone calls forward to VoIP offshore.",
    checkpoints: { staffOnSite: false, directoryListed: false, physicalLease: false, phoneActive: false },
    photos: [
      { tab: "Exterior", label: "Mailbox Building", desc: "Offshore registered mailbox hub with no company branding" },
      { tab: "Reception", label: "Shared Mailroom", desc: "Single clerk handling correspondence for hundreds of shell firms" },
      { tab: "Operations", label: "Empty Office", desc: "No desks, no computers, no trading personnel found" },
      { tab: "License Wall", label: "No Plaque", desc: "Only IBC certificate on file without retail investor insurance" }
    ]
  },
  {
    id: "fs4",
    broker: "Reef Markets",
    country: "Unknown",
    address: "Declared address does not exist in municipal records",
    score: 2.8,
    date: "2026-08-10",
    inspector: "Fraud Unit Investigator K. Vance",
    coords: "Unverifiable Coordinates",
    status: "Fraudulent",
    findings: "Investigation revealed fraudulent claim of physical office. Declared address corresponds to an empty parking structure. Domain registered anonymously 3 months prior to retail launch.",
    checkpoints: { staffOnSite: false, directoryListed: false, physicalLease: false, phoneActive: false },
    photos: [
      { tab: "Exterior", label: "Fabricated Location", desc: "Investigators confirmed declared address is an empty lot" },
      { tab: "Reception", label: "Non-Existent", desc: "No physical structure or commercial building present" },
      { tab: "Operations", label: "Virtual Ghost", desc: "Entire operation exists solely as an offshore web portal" },
      { tab: "License Wall", label: "Counterfeit PDF", desc: "Website regulatory document is an altered clone image" }
    ]
  }
];

const initialNetworks = [
  {
    id: "net-1",
    brokerName: "Solaris Prime",
    parentCompany: "Solaris Financial Holdings PLC",
    jurisdiction: "United Kingdom (London)",
    regNo: "UK-CH-09448120",
    contagionScore: 9.6,
    contagionRisk: "Low Risk (Grade AAA)",
    custodianBank: "Barclays Bank UK (Segregated Tier-1)",
    sharedLicenses: [
      { name: "Solaris UK Ltd", reg: "FCA #771102", status: "Active" },
      { name: "Solaris Capital Pty Ltd", reg: "ASIC #441092", status: "Active" },
      { name: "Solaris Global Markets Ltd", reg: "FSCA #48810", status: "Active" }
    ],
    whiteLabels: [
      { name: "Solaris Prime Asia", platform: "MT5", jurisdiction: "Singapore", status: "Verified" },
      { name: "PrimeX Execution Hub", platform: "cTrader", jurisdiction: "UK", status: "Verified" }
    ],
    cloneAlerts: [
      { domain: "solaris-prime-traders.net", detected: "2026-08-14", status: "Banned / Impersonator", severity: "Critical" },
      { domain: "solaris-fx-vip.com", detected: "2026-07-29", status: "Cease & Desist Issued", severity: "High" }
    ]
  },
  {
    id: "net-2",
    brokerName: "Vantage Global",
    parentCompany: "Vantage Group Holdings Ltd",
    jurisdiction: "Australia (Sydney)",
    regNo: "AU-ABN-39140",
    contagionScore: 9.2,
    contagionRisk: "Low Risk (Grade AA)",
    custodianBank: "National Australia Bank (NAB)",
    sharedLicenses: [
      { name: "Vantage Global Prime Pty Ltd", reg: "ASIC #428289", status: "Active" },
      { name: "Vantage Markets UK", reg: "FCA #590299", status: "Active" }
    ],
    whiteLabels: [
      { name: "VT Markets International", platform: "MT4 / MT5", jurisdiction: "Australia", status: "Verified" },
      { name: "Alpha Direct Brokerage", platform: "MT4", jurisdiction: "UAE", status: "Verified" }
    ],
    cloneAlerts: [
      { domain: "vantage-invest-crypto.io", detected: "2026-09-02", status: "Phishing Clone", severity: "Critical" }
    ]
  },
  {
    id: "net-3",
    brokerName: "Halcyon Capital",
    parentCompany: "Halcyon Investments Europe Ltd",
    jurisdiction: "Cyprus (Limassol)",
    regNo: "CY-HE-24901",
    contagionScore: 8.5,
    contagionRisk: "Regulated (Grade A)",
    custodianBank: "Bank of Cyprus (ICF Covered)",
    sharedLicenses: [
      { name: "Halcyon Capital Markets", reg: "CySEC #118820", status: "Active" }
    ],
    whiteLabels: [
      { name: "Halcyon Direct EU", platform: "STP Pro", jurisdiction: "Cyprus", status: "Verified" }
    ],
    cloneAlerts: []
  },
  {
    id: "net-4",
    brokerName: "Copperline Trade",
    parentCompany: "Copperline Ventures Pacific Ltd",
    jurisdiction: "Vanuatu (Port Vila)",
    regNo: "VU-IBC-44092",
    contagionScore: 3.8,
    contagionRisk: "High Contagion Risk (Grade D)",
    custodianBank: "Unverified Offshore Bank",
    sharedLicenses: [
      { name: "Copperline Trade International", reg: "VFSC #44092", status: "Suspended" }
    ],
    whiteLabels: [
      { name: "SwiftTrade Global", platform: "MT4 White Label", jurisdiction: "Seychelles", status: "Unverified" }
    ],
    cloneAlerts: [
      { domain: "copperline-fx.org", detected: "2026-08-01", status: "Active Unregulated Shell", severity: "Critical" }
    ]
  },
  {
    id: "net-5",
    brokerName: "Reef Markets",
    parentCompany: "Suspected Ghost Shell Group",
    jurisdiction: "Unknown Offshore Entity",
    regNo: "None / Fabricated",
    contagionScore: 1.4,
    contagionRisk: "Scam Syndicate (Grade F)",
    custodianBank: "No Segregation (Crypto Wallet Only)",
    sharedLicenses: [],
    whiteLabels: [
      { name: "Reef Forex Pro", platform: "Cracked MT4", jurisdiction: "Unknown", status: "Pirated" }
    ],
    cloneAlerts: [
      { domain: "reefmarkets.cc", detected: "2026-08-19", status: "Scam Clone Network", severity: "Critical" },
      { domain: "reef-fx-online.com", detected: "2026-08-25", status: "Blacklisted by FCA & ASIC", severity: "Critical" }
    ]
  }
];

const initialProtectionCases = [
  {
    id: "LRP-8921",
    brokerName: "Solaris Prime",
    claimant: "David M. (UK)",
    category: "Execution Slippage Dispute",
    amountClaimed: 14500,
    amountRecovered: 14500,
    stage: 4,
    status: "Resolved & Paid",
    date: "2026-09-18",
    auditNotes: "Independent order ticket logs analyzed against LSEG interbank feeds. Solaris compliance team reimbursed $14,500 within 72 hours."
  },
  {
    id: "LRP-8884",
    brokerName: "Vantage Global",
    claimant: "Sandro B. (Italy)",
    category: "Delayed SWIFT Withdrawal",
    amountClaimed: 8200,
    amountRecovered: 8200,
    stage: 4,
    status: "Resolved & Paid",
    date: "2026-09-15",
    auditNotes: "Intermediary banking routing failure investigated. Funds re-routed and credited to client account with official confirmation."
  },
  {
    id: "LRP-8790",
    brokerName: "Halcyon Capital",
    claimant: "Elena V. (Greece)",
    category: "Margin Stop-out Verification",
    amountClaimed: 5400,
    amountRecovered: 5400,
    stage: 4,
    status: "Resolved & Paid",
    date: "2026-09-08",
    auditNotes: "Broker agreed to restore account balance to pre-slippage baseline following Ledger mediation audit."
  },
  {
    id: "LRP-9012",
    brokerName: "Copperline Trade",
    claimant: "Kwame A. (Ghana)",
    category: "Withheld Profit Withdrawal",
    amountClaimed: 3200,
    amountRecovered: 0,
    stage: 2,
    status: "In Mediation",
    date: "2026-09-20",
    auditNotes: "Formal legal inquiry dispatched to VFSC commissioner and broker management. Awaiting response."
  },
  {
    id: "LRP-8641",
    brokerName: "Reef Markets",
    claimant: "Thomas K. (Germany)",
    category: "Total Capital Lockout / Deposit Fraud",
    amountClaimed: 48000,
    amountRecovered: 0,
    stage: 3,
    status: "Broker Evading (Flagged)",
    date: "2026-08-28",
    auditNotes: "Broker account representatives deleted Telegram. Case escalated to national cybercrime units and domain registrar takedown."
  }
];

const initialRebates = [
  {
    id: "reb-1",
    brokerName: "Solaris Prime",
    rating: 9.4,
    regulator: "FCA, ASIC",
    accountType: "Raw ECN",
    rawSpread: "0.0 pips",
    rebatePerLot: 3.50,
    payoutFreq: "Daily Automated",
    depositBonus: "100% Margin Credit",
    tier: "Tier-1 Institutional",
    minDeposit: 100,
    verified: true
  },
  {
    id: "reb-2",
    brokerName: "Vantage Global",
    rating: 9.1,
    regulator: "ASIC, FCA",
    accountType: "Raw Spreads",
    rawSpread: "0.1 pips",
    rebatePerLot: 3.80,
    payoutFreq: "Instant Auto-Rebate",
    depositBonus: "$50 Welcome + 50%",
    tier: "Tier-1 Multi-Regulated",
    minDeposit: 50,
    verified: true
  },
  {
    id: "reb-3",
    brokerName: "Halcyon Capital",
    rating: 8.6,
    regulator: "CySEC",
    accountType: "Standard STP",
    rawSpread: "0.6 pips",
    rebatePerLot: 2.60,
    payoutFreq: "Weekly Settlement",
    depositBonus: "ICF Protection Fund",
    tier: "European Licensed",
    minDeposit: 200,
    verified: true
  },
  {
    id: "reb-4",
    brokerName: "Exness Pro (Institutional)",
    rating: 9.3,
    regulator: "FCA, CySEC",
    accountType: "Zero Account",
    rawSpread: "0.0 pips",
    rebatePerLot: 4.20,
    payoutFreq: "Real-time Per Trade",
    depositBonus: "Zero Swap Fees",
    tier: "Tier-1 Ultra-Volume",
    minDeposit: 500,
    verified: true
  },
  {
    id: "reb-5",
    brokerName: "IC Trading Global",
    rating: 9.0,
    regulator: "ASIC, SCB",
    accountType: "True ECN",
    rawSpread: "0.0 pips",
    rebatePerLot: 3.60,
    payoutFreq: "Daily Settlement",
    depositBonus: "cTrader / TradingView",
    tier: "Tier-1 ECN",
    minDeposit: 200,
    verified: true
  }
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
function Header({ view, setView, compareList, openCompare, isLight, toggleTheme, adminAuthed, onLoginClick, onLogout, brokers = [], setBrokerSearch, openDetail }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginHover, setLoginHover] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimerRef = React.useRef(null);

  // Direct Interactive Header Search state
  const [headerQuery, setHeaderQuery] = useState("");
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  const headerSearchInputRef = React.useRef(null);

  const headerSuggestions = useMemo(() => {
    if (!headerQuery.trim() || !brokers) return [];
    const q = headerQuery.toLowerCase();
    return brokers.filter(b => 
      b.name.toLowerCase().includes(q) || 
      (b.regulator || "").toLowerCase().includes(q) || 
      (b.country || "").toLowerCase().includes(q) ||
      (b.license || "").toLowerCase().includes(q)
    ).slice(0, 5);
  }, [headerQuery, brokers]);

  useEffect(() => {
    function handleHeaderKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        headerSearchInputRef.current?.focus();
        headerSearchInputRef.current?.select();
      }
    }
    window.addEventListener("keydown", handleHeaderKeyDown);
    return () => window.removeEventListener("keydown", handleHeaderKeyDown);
  }, []);

  const directItems = [
    { id: "home", label: "Registry" },
    { id: "brokers", label: "Brokers" },
    { id: "rankings", label: "Rankings" },
    { id: "market", label: "Markets" },
  ];

  const dropdownSections = [
    {
      id: "safety",
      label: "Safety Desk",
      kicker: "Risk & Fraud Verification",
      badge: "LIVE",
      items: [
        { id: "protection", label: "Rights Protection", meta: "1-on-1 dispute & fund recovery", icon: ShieldAlert, badge: "NEW" },
        { id: "network", label: "Relationship Radar", meta: "Clone networks & corporate graph", icon: Share2, badge: "AI" },
        { id: "scam-alerts", label: "Scam Alerts", meta: "Real-time clone & fraud alerts", icon: AlertOctagon, tone: "warn", badge: "Live" },
        { id: "exposure", label: "Exposure Desk", meta: "Public disputes & complaint triage", icon: ShieldCheck },
        { id: "field-survey", label: "Field Surveys", meta: "Physical 360° office inspections", icon: Globe },
        { id: "regulators", label: "Regulatory Hub", meta: "Global regulatory verification", icon: Scale },
      ]
    },
    {
      id: "community",
      label: "Community",
      kicker: "Trader Network & Insights",
      items: [
        { id: "forum", label: "Trader Forum", meta: "Debates, reviews & discussions", icon: MessageCircle },
        { id: "news", label: "Dispatches", meta: "Market analysis & intelligence", icon: Newspaper },
        { id: "media", label: "Live Broadcasts", meta: "Market streams & video briefings", icon: Activity },
      ]
    },
    {
      id: "tools",
      label: "Tools & Learn",
      kicker: "Analytics & Academy",
      items: [
        { id: "rebates", label: "Rebates & Cashback", meta: "Verified volume rebate optimizer", icon: Coins, badge: "HOT" },
        { id: "calculator", label: "Spread Calculator", meta: "Pip cost & fee audits", icon: DollarSign },
        { id: "tools", label: "EA / VPS Center", meta: "Low latency hosting & tools", icon: SlidersHorizontal },
        { id: "education", label: "Education Academy", meta: "Trading guides & risk education", icon: FileText },
      ]
    }
  ];

  const handleMouseEnter = (id) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 160);
  };

  const closeDropdowns = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.nav-dropdown-wrap')) {
        closeDropdowns();
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, []);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 60, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: `1px solid var(--c-line)`, transition: "background 0.3s ease" }}>

      <div className="ledger-header-inner" style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={() => { setView("home"); closeDropdowns(); }}>
          <div className="brand-logo-badge">
            <ShieldCheck size={18} />
          </div>
          <span className="brand-title">LEDGER<span className="brand-title-accent">.</span></span>
        </div>

        {/* Desktop Navigation */}
        <nav className="ledger-nav ledger-nav-desktop" aria-label="Main Navigation">
          {directItems.map((it) => (
            <button
              key={it.id}
              type="button"
              className={`nav-tab-btn ${view === it.id ? "is-active" : ""}`}
              onClick={() => { setView(it.id); closeDropdowns(); }}
            >
              {it.label}
            </button>
          ))}

          {dropdownSections.map((sec) => {
            const isDropdownActive = sec.items.some(it => it.id === view);
            const isOpen = activeDropdown === sec.id;
            return (
              <div
                key={sec.id}
                className="nav-dropdown-wrap"
                onMouseEnter={() => handleMouseEnter(sec.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`nav-tab-btn nav-dropdown-trigger ${isDropdownActive ? "is-active" : ""} ${isOpen ? "is-open" : ""}`}
                  onClick={() => setActiveDropdown(isOpen ? null : sec.id)}
                  aria-expanded={isOpen}
                >
                  <span>{sec.label}</span>
                  {sec.badge && <span className="nav-alert-beacon" title="Live scam alerts active" />}
                  <ChevronDown size={13} className={`nav-chevron ${isOpen ? "is-rotated" : ""}`} />
                </button>

                {isOpen && (
                  <div className="nav-dropdown-menu" role="menu">
                    <div className="nav-dropdown-header">
                      <span className="nav-dropdown-title">{sec.label}</span>
                      <span className="nav-dropdown-kicker">{sec.kicker}</span>
                    </div>
                    <div className="nav-dropdown-items">
                      {sec.items.map((it) => {
                        const Icon = it.icon;
                        const isItemActive = view === it.id;
                        return (
                          <button
                            key={it.id}
                            type="button"
                            className={`nav-dropdown-item ${isItemActive ? "is-active" : ""}`}
                            onClick={() => {
                              setView(it.id);
                              closeDropdowns();
                            }}
                            role="menuitem"
                          >
                            <div className={`nav-item-icon-box tone-${it.tone || "default"}`}>
                              <Icon size={16} />
                            </div>
                            <div className="nav-item-text">
                              <div className="nav-item-label-row">
                                <strong className="nav-item-label">{it.label}</strong>
                                {it.badge && <span className="nav-item-badge">{it.badge}</span>}
                              </div>
                              <span className="nav-item-meta">{it.meta}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Drawer Navigation */}
        <nav className={`ledger-nav ledger-nav-mobile ${menuOpen ? "is-open" : ""}`} aria-label="Mobile Navigation">
          <div className="mobile-nav-content">
            <div className="mobile-nav-group">
              <div className="mobile-nav-group-label">DIRECTORY</div>
              <div className="mobile-nav-links">
                {directItems.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    className={`mobile-nav-link ${view === it.id ? "is-active" : ""}`}
                    onClick={() => { setView(it.id); setMenuOpen(false); }}
                  >
                    {it.label}
                  </button>
                ))}
              </div>
            </div>

            {dropdownSections.map((sec) => (
              <div key={sec.id} className="mobile-nav-group">
                <div className="mobile-nav-group-label">{sec.label.toUpperCase()}</div>
                <div className="mobile-nav-links">
                  {sec.items.map((it) => {
                    const Icon = it.icon;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        className={`mobile-nav-link ${view === it.id ? "is-active" : ""}`}
                        onClick={() => { setView(it.id); setMenuOpen(false); }}
                      >
                        <div className={`mobile-nav-icon tone-${it.tone || "default"}`}>
                          <Icon size={14} />
                        </div>
                        <span style={{ flex: 1 }}>{it.label}</span>
                        {it.badge && <span className="nav-item-badge">{it.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {compareList.length > 0 && (
            <button
              type="button"
              className="ledger-nav-compare-btn"
              onClick={() => { openCompare(); setMenuOpen(false); }}
              style={{
                marginTop: 12, padding: "10px 14px", background: "var(--c-verified)",
                color: "#03030A", border: "none", borderRadius: 8, fontWeight: 700,
                fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                cursor: "pointer"
              }}
            >
              <Scale size={15} /> Compare Selected ({compareList.length})
            </button>
          )}

          {adminAuthed && (
            <div className="mobile-admin-menu-footer">
              <div className="mobile-admin-menu-header">
                <UserCircle2 size={16} color="var(--c-verified)" />
                <span>Logged in as <strong>Administrator</strong></span>
              </div>
              <div className="mobile-admin-menu-actions">
                <button
                  type="button"
                  className="mobile-admin-panel-btn"
                  onClick={() => { setView("admin"); setMenuOpen(false); }}
                >
                  <ShieldCheck size={14} /> Admin Panel
                </button>
                <button
                  type="button"
                  className="mobile-admin-logout-btn"
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </nav>
        <div className="ledger-header-right" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Functional Header Search Bar */}
          <div className="header-search-wrap">
            <div className={`header-search-box ${headerSearchFocused ? "is-focused" : ""}`}>
              <Search size={14} className="header-search-icon" />
              <input
                ref={headerSearchInputRef}
                type="text"
                className="header-search-input"
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                onFocus={() => setHeaderSearchFocused(true)}
                onBlur={() => setTimeout(() => setHeaderSearchFocused(false), 240)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && headerQuery.trim()) {
                    if (setBrokerSearch) setBrokerSearch(headerQuery.trim());
                    setView("brokers");
                    setHeaderSearchFocused(false);
                  } else if (e.key === "Escape") {
                    setHeaderSearchFocused(false);
                    headerSearchInputRef.current?.blur();
                  }
                }}
                placeholder="Search brokers..."
                aria-label="Search brokers in header"
              />
              {headerQuery ? (
                <button
                  type="button"
                  className="header-search-clear"
                  onClick={() => {
                    setHeaderQuery("");
                    headerSearchInputRef.current?.focus();
                  }}
                  aria-label="Clear header search"
                >
                  <X size={12} />
                </button>
              ) : (
                <kbd className="header-kbd">⌘K</kbd>
              )}
            </div>

            {/* Live Autocomplete Dropdown under Header */}
            {headerSearchFocused && headerSuggestions.length > 0 && (
              <div className="header-search-dropdown" role="listbox">
                <div className="header-search-dropdown-title">
                  MATCHING BROKERS ({headerSuggestions.length})
                </div>
                {headerSuggestions.map(b => (
                  <div
                    key={b.id}
                    className="header-search-result-item"
                    onMouseDown={() => {
                      if (openDetail) openDetail(b);
                      setHeaderQuery("");
                      setHeaderSearchFocused(false);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Stamp score={b.score} alert={b.flags?.length > 0} size={28} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-paper)" }}>{b.name}</div>
                        <div style={{ fontSize: 11, color: "var(--c-muted)" }}>{b.country} · {b.regulator}</div>
                      </div>
                    </div>
                    <Badge tone={b.flags?.length > 0 ? "warn" : "reg"}>{b.type || "ECN"}</Badge>
                  </div>
                ))}
                <div
                  className="header-search-view-all"
                  onMouseDown={() => {
                    if (setBrokerSearch) setBrokerSearch(headerQuery.trim());
                    setView("brokers");
                    setHeaderSearchFocused(false);
                  }}
                >
                  <span>View all results for "{headerQuery}"</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            )}
          </div>
          <div className="ledger-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {compareList.length > 0 && (
              <Button variant="primary" onClick={openCompare} style={{ padding: "6px 12px", fontSize: 12 }}>
                <Scale size={13} /> Compare ({compareList.length})
              </Button>
            )}
          </div>
          {compareList.length > 0 && (
            <button
              type="button"
              className="mobile-compare-pill"
              onClick={openCompare}
              title="View comparison"
              aria-label={`Compare ${compareList.length} brokers`}
            >
              <Scale size={13} /> {compareList.length}
            </button>
          )}
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"} title={isLight ? "Switch to dark mode" : "Switch to light mode"}>
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Premium Login / Admin button */}
          {adminAuthed ? (
            <button
              type="button"
              className="header-admin-pill"
              onClick={() => setView("admin")}
              title="Open Admin Panel"
              aria-label="Open Admin Panel"
            >
              <div className="header-admin-avatar">
                <UserCircle2 size={16} />
              </div>
              <span className="header-admin-label">Admin</span>
            </button>
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
      </div>
    </header>
  );
}

/* ---------------------------------------------------------
   HOME VIEW
--------------------------------------------------------- */
function Home({ brokers, exposures, setView, openDetail, toggleCompare, compareList, isLight, setBrokerSearch }) {
  const [q, setQ] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Real-time spread calculator state
  const [calcPair, setCalcPair] = useState("EUR/USD");
  const [calcLots, setCalcLots] = useState(2.0);

  const searchInputRef = React.useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const topThree = useMemo(() => [...brokers].sort((a, b) => b.score - a.score).slice(0, 3), [brokers]);
  const recentExposures = useMemo(() => [...exposures].filter(e => e.status === "published").slice(0, 3), [exposures]);
  const flaggedCount = brokers.filter(b => b.flags?.length > 0).length;
  const disputedTotal = exposures.reduce((total, exposure) => total + Number(exposure.amount || 0), 0);

  // Search autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    if (!q.trim()) return [];
    const query = q.toLowerCase();
    return brokers.filter(b => 
      b.name.toLowerCase().includes(query) || 
      (b.regulator || "").toLowerCase().includes(query) || 
      (b.country || "").toLowerCase().includes(query) ||
      (b.license || "").toLowerCase().includes(query)
    ).slice(0, 5);
  }, [q, brokers]);

  // Dynamic Screener Category Filter
  const screenerBrokers = useMemo(() => {
    let list = [...brokers];
    if (activeCategory === "tier1") {
      list = list.filter(b => (b.regulator || "").includes("FCA") || (b.regulator || "").includes("ASIC") || (b.regulator || "").includes("FSCA"));
    } else if (activeCategory === "ecn") {
      list = list.filter(b => (b.type || "").toUpperCase().includes("ECN"));
    } else if (activeCategory === "low_deposit") {
      list = list.filter(b => Number(b.min_deposit || 100) <= 50);
    } else if (activeCategory === "clean") {
      list = list.filter(b => !b.flags || b.flags.length === 0);
    }
    return list.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [brokers, activeCategory]);

  // Real-time Spread Fee Calculation
  const pairInfo = {
    "EUR/USD": { ecnSpread: 0.1, stdSpread: 1.4, pipVal: 10 },
    "GBP/USD": { ecnSpread: 0.2, stdSpread: 1.8, pipVal: 10 },
    "USD/JPY": { ecnSpread: 0.3, stdSpread: 1.6, pipVal: 9.24 },
    "XAU/USD": { ecnSpread: 1.5, stdSpread: 3.8, pipVal: 100 },
    "BTC/USD": { ecnSpread: 12.0, stdSpread: 35.0, pipVal: 1 }
  }[calcPair] || { ecnSpread: 0.1, stdSpread: 1.4, pipVal: 10 };

  const tradesCount = 10;
  const ecnCost = (calcLots * pairInfo.ecnSpread * pairInfo.pipVal * tradesCount);
  const stdCost = (calcLots * pairInfo.stdSpread * pairInfo.pipVal * tradesCount);
  const savings = Math.max(0, stdCost - ecnCost);


  return (
    <div className="fade-in-up">
      {/* ── High-Impact Hero Section ── */}
      <section className="home-hero tech-grid" style={{
        position: "relative", overflow: "hidden",
        padding: "105px 24px 80px",
        borderBottom: `1px solid var(--c-line)`,
        background: "var(--gradient-hero)",
        transition: "background 0.3s ease"
      }}>
        {/* Ambient glow orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div className="ambient-orb" style={{ width: 550, height: 550, background: "rgba(0,230,118,1)", top: -200, right: -100, animationDelay: "0s" }} />
          <div className="ambient-orb" style={{ width: 440, height: 440, background: "rgba(41,121,255,1)", bottom: -180, left: -80, animationDelay: "4s" }} />
          <div className="ambient-orb" style={{ width: 300, height: 300, background: "rgba(255,171,0,0.35)", top: "35%", right: "22%", animationDelay: "2s", opacity: 0.08 }} />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Institutional Status Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            color: "var(--c-verified)", fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
            border: `1px solid var(--c-line-accent)`,
            padding: "6px 14px", borderRadius: 24, marginBottom: 28,
            background: "var(--c-verified-dim)",
            letterSpacing: "0.04em",
            boxShadow: "0 0 16px rgba(0, 230, 118, 0.15)"
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--c-verified)", boxShadow: "0 0 8px var(--c-verified)" }} />
            LIVE · Supabase Global Registry · {brokers.length} Entities Audited
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
            fontSize: "clamp(32px, 5.8vw, 64px)", lineHeight: 1.05,
            maxWidth: 820, letterSpacing: "-0.025em",
            margin: "0 0 20px",
          }}>
            Audited financial transparency for{" "}
            <em style={{
              background: "var(--gradient-brand)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "italic",
              position: "relative"
            }}>
              forex & CFD brokers.
            </em>
          </h1>

          <p style={{
            color: "var(--c-paper-dim)", fontSize: 16.5,
            maxWidth: 620, lineHeight: 1.6, margin: "0 0 36px",
            fontWeight: 400,
          }}>
            Cross-referencing tier-1 statutory regulators, corporate filings, physical office audits,
            and validated victim exposure ledgers to safeguard retail capital.
          </p>

          {/* Search bar with Live Autocomplete */}
          <div style={{ position: "relative", maxWidth: 720 }}>
            <div className={`hero-search-bar ${searchFocused ? "is-focused" : ""}`} style={{
              display: "flex",
              alignItems: "center",
              background: "var(--card-bg)",
              border: `1px solid ${searchFocused ? "var(--c-verified)" : "var(--c-line-strong)"}`,
              borderRadius: 18, overflow: "hidden",
              boxShadow: searchFocused ? "0 20px 48px rgba(0,0,0,0.5), 0 0 0 2px rgba(0,230,118,0.25)" : "0 20px 48px rgba(0,0,0,0.35)",
              backdropFilter: "blur(16px)",
              transition: "border-color 0.2s, box-shadow 0.2s"
            }}>
              <div style={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
                <Search size={18} color={searchFocused ? "var(--c-verified)" : "var(--c-muted)"} />
              </div>
              <input
                ref={searchInputRef}
                id="hero-search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setBrokerSearch(q);
                    setView("brokers");
                    setSearchFocused(false);
                  }
                }}
                placeholder="Search broker by name, license number, regulator, or country..."
                style={{
                  flex: 1, background: "transparent", border: "none",
                  outline: "none", color: "var(--c-paper)",
                  padding: "18px 0", fontSize: 15, fontFamily: "'Inter', sans-serif",
                  minWidth: 0,
                }}
              />
              {!q && (
                <div className="hero-search-shortcut" title="Press Ctrl+K or ⌘K to search">
                  <kbd>⌘</kbd><kbd>K</kbd>
                </div>
              )}
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  style={{ background: "transparent", border: "none", color: "var(--c-muted)", cursor: "pointer", padding: "0 12px", display: "flex", alignItems: "center" }}
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                className="hero-inspect-btn"
                onClick={() => { setBrokerSearch(q); setView("brokers"); setSearchFocused(false); }}
                title="Inspect broker registry"
              >
                <span>Inspect</span>
                <ArrowRight size={15} strokeWidth={2.4} className="hero-inspect-icon" />
              </button>
            </div>

            {/* Instant Search Autocomplete Dropdown */}
            {searchFocused && searchSuggestions.length > 0 && (
              <div className="hero-autocomplete-dropdown">
                <div style={{ padding: "8px 16px", fontSize: 11, color: "var(--c-muted)", fontFamily: "'IBM Plex Mono', monospace", borderBottom: "1px solid var(--c-line)", letterSpacing: "0.06em" }}>
                  MATCHING VERIFIED DOSSIERS ({searchSuggestions.length})
                </div>
                {searchSuggestions.map(b => (
                  <div
                    key={b.id}
                    className="dropdown-item"
                    onMouseDown={() => { openDetail(b); setQ(""); }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Stamp score={b.score} alert={b.flags?.length > 0} size={36} />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--c-paper)", fontSize: 14 }}>{b.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--c-paper-dim)" }}>
                          {b.country} · {b.regulator} · {b.license}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Badge tone={b.flags?.length > 0 ? "warn" : "reg"}>{b.type || "ECN"}</Badge>
                      <ChevronRight size={16} color="var(--c-muted)" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Tag Chips */}
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--c-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>POPULAR:</span>
            {[
              { label: "⚡ Raw ECN Spreads", query: "ECN" },
              { label: "🛡️ Tier-1 FCA Only", query: "FCA" },
              { label: "💰 Low $50 Deposit", query: "50" },
              { label: "💎 Top 9.0+ Trust", query: "Solaris" },
              { label: "⚠️ Watchlist Alerts", query: "Offshore" }
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                className="quick-tag-chip"
                onClick={() => { setBrokerSearch(chip.query); setView("brokers"); }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Statutory Trust Badges */}
          <div style={{ display: "flex", gap: 20, marginTop: 34, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11.5, color: "var(--c-muted)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.05em" }}>STATUTORY MONITORS:</span>
            {[
              ["FCA", "United Kingdom"],
              ["ASIC", "Australia"],
              ["CySEC", "European Union"],
              ["FSCA", "South Africa"],
              ["CFTC / NFA", "United States"]
            ].map(([reg, region]) => (
              <div key={reg} style={{
                display: "flex", alignItems: "center", gap: 8,
                color: "var(--c-paper-dim)", fontSize: 12,
                fontFamily: "'IBM Plex Mono', monospace",
                background: "rgba(255,255,255,0.02)",
                padding: "4px 10px", borderRadius: 8,
                border: "1px solid var(--c-line)"
              }}>
                <Check size={12} color="var(--c-verified)" />
                <span style={{ color: "var(--c-verified)", fontWeight: 700 }}>{reg}</span>
                <span style={{ color: "var(--c-muted)" }}>{region}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Real-time Registry Telemetry Strip ── */}
      <section className="telemetry-strip" style={{ borderBottom: "1px solid var(--c-line)" }}>
        <div className="telemetry-grid">
          {[
            {
              Icon: ShieldCheck,
              label: "Audited universe",
              value: `${brokers.length} Entities`,
              note: "100% Cross-referenced",
              trend: "Live Verified",
              variant: "tc-verified"
            },
            {
              Icon: Activity,
              label: "Average trust index",
              value: `${(brokers.reduce((sum, b) => sum + Number(b.score || 0), 0) / Math.max(brokers.length, 1)).toFixed(1)} / 10`,
              note: "Composite across 4 pillars",
              trend: "Benchmark Norm",
              variant: "tc-score"
            },
            {
              Icon: AlertOctagon,
              label: "Flagged entities",
              value: `${flaggedCount} Under Review`,
              note: "Active risk advisories",
              trend: flaggedCount > 0 ? "Elevated Alert" : "Clean Signal",
              variant: "tc-alert"
            },
            {
              Icon: DollarSign,
              label: "Victim exposure claims",
              value: `$${disputedTotal.toLocaleString()}`,
              note: "Reported dispute volume",
              trend: "Dispute Triage",
              variant: "tc-money"
            },
          ].map(({ Icon, label, value, note, trend, variant }) => (
            <div className={`telemetry-cell ${variant}`} key={label}>
              <div className="tc-top-row">
                <div className="tc-icon">
                  <Icon size={18} />
                </div>
                <span className="tc-trend-badge">{trend}</span>
              </div>
              <div className="tc-label">{label}</div>
              <div className="tc-value">{value}</div>
              <div className="tc-note">
                <span className="tc-dot" />
                <span>{note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WikiFX-Inspired Advanced Intelligence Suite ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="section-kicker"><ShieldCheck size={11} /> Advanced Protection & Utility Suite</div>
            <h2 className="section-heading">Institutional Tools & Recovery Ecosystem</h2>
            <p style={{ color: "var(--c-paper-dim)", fontSize: 14, margin: 0 }}>
              Specialized infrastructure designed to protect retail capital, expose fraudulent networks, and reduce trading friction.
            </p>
          </div>
          <Badge tone="reg">WIKIFX-INSPIRED ARSENAL</Badge>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            {
              title: "Rights Protection & Recovery",
              badge: "1-ON-1 MEDIATION",
              kpi: "$1,482,900+ Restituted",
              desc: "Dispute resolution desk for delayed withdrawals, arbitrary balance deduction, and trade execution manipulation.",
              action: () => setView("protection"),
              btnLabel: "Open Recovery Desk",
              icon: ShieldAlert
            },
            {
              title: "Relationship Radar & Clones",
              badge: "CORPORATE GRAPH",
              kpi: "Ownership & Synergies",
              desc: "Trace holding entities, shared regulatory licenses, white-label liquidity pools, and detected copycat clone domains.",
              action: () => setView("network"),
              btnLabel: "Inspect Network Graph",
              icon: Share2
            },
            {
              title: "Rebate & Cashback Optimizer",
              badge: "COST REDUCTION",
              kpi: "Up to $4.20 / Lot",
              desc: "Automated cash rebates directly into your MT4/MT5 trading account with guaranteed zero spread markup.",
              action: () => setView("rebates"),
              btnLabel: "Calculate Cashback",
              icon: Coins
            },
            {
              title: "360° Field Survey Dossiers",
              badge: "PHYSICAL AUDITS",
              kpi: "30+ Financial Capitals",
              desc: "Independent on-site inspections verifying physical offices, active staff desks, commercial leases, and plaque matches.",
              action: () => setView("field-survey"),
              btnLabel: "View On-Site Audits",
              icon: Globe
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card-hover"
              style={{
                borderRadius: 16,
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16,
                cursor: "pointer"
              }}
              onClick={item.action}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--c-line)", display: "grid", placeItems: "center", color: "var(--c-verified)" }}>
                    <item.icon size={20} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "var(--c-surface-hi)", border: "1px solid var(--c-line)", fontFamily: "'IBM Plex Mono', monospace", color: "var(--c-paper-dim)" }}>
                    {item.badge}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, margin: "0 0 6px" }}>{item.title}</h3>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-verified)", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>{item.kpi}</div>
                <p style={{ color: "var(--c-paper-dim)", fontSize: 13, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--c-verified)", fontSize: 13, fontWeight: 700 }}>
                <span>{item.btnLabel}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive Screener & Benchmark Leaders ── */}
      <section className="benchmark-leaders-section" style={{ padding: "72px 20px 48px", maxWidth: 1240, margin: "0 auto" }}>
        <div className="section-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="section-kicker"><Award size={11} /> Benchmark Leaders</div>
            <h2 className="section-heading">Top Rated Financial Institutions</h2>
            <p style={{ color: "var(--c-paper-dim)", fontSize: 14, margin: 0 }}>
              Live ranking computed across regulatory standing, commercial stability, field survey, and software security.
            </p>
          </div>

          {/* Interactive Screener Tabs */}
          <div className="screener-tabs-bar">
            {[
              { id: "all", label: "Top Overall", icon: Sparkles },
              { id: "tier1", label: "Tier-1 Only", icon: ShieldCheck },
              { id: "ecn", label: "Raw ECN", icon: Zap },
              { id: "low_deposit", label: "≤$50 Deposit", icon: DollarSign },
              { id: "clean", label: "Zero Flags", icon: CheckCircle2 }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`screener-tab-btn ${activeCategory === tab.id ? "active" : ""}`}
                  onClick={() => setActiveCategory(tab.id)}
                >
                  <TabIcon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 24 }}>
          {screenerBrokers.map((b, index) => (
            <BrokerCard
              key={b.id}
              b={b}
              rank={index + 1}
              onClick={() => openDetail(b)}
              onCompare={() => toggleCompare(b)}
              isCompared={compareList.some(x => x.id === b.id)}
            />
          ))}
          {!screenerBrokers.length && (
            <div className="empty-state-panel" style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center" }}>
              No brokers match the selected category.
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                style={{ marginLeft: 12, background: "transparent", color: "var(--c-verified)", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <Button variant="secondary" onClick={() => setView("rankings")}>
            Explore Full Registry Directory ({brokers.length} Dossiers) →
          </Button>
        </div>
      </section>

      {/* ── Interactive Spread Fee & Savings Calculator ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 20px 64px" }}>
        <div className="spread-calc-hero-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
            <div>
              <div className="section-kicker"><Calculator size={11} /> Trading Cost Radar</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, margin: "6px 0 8px", fontFamily: "'Inter', sans-serif", color: "var(--c-paper)" }}>
                Calculate Spread Slippage & Broker Savings
              </h3>
              <p style={{ color: "var(--c-paper-dim)", fontSize: 14, margin: 0, maxWidth: 540 }}>
                High spreads silently erode your capital. See how much trading capital you keep with verified ECN brokers vs unverified market makers.
              </p>
            </div>
            
            {/* Pair Selector Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "BTC/USD"].map(pair => (
                <button
                  key={pair}
                  type="button"
                  onClick={() => setCalcPair(pair)}
                  className={`calc-pair-btn ${calcPair === pair ? "active" : ""}`}
                >
                  {pair}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Slider */}
          <div className="calc-slider-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--c-paper)", fontWeight: 600 }}>Trade Volume (Standard Lots per position):</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 700, color: "var(--c-verified)" }}>
                {calcLots.toFixed(1)} Lots
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={calcLots}
              onChange={(e) => setCalcLots(Number(e.target.value))}
              className="calc-range-slider"
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--c-muted)", marginTop: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
              <span>0.1 Lot (Micro)</span>
              <span>2.0 Lots (Standard)</span>
              <span>10.0 Lots (Institutional)</span>
            </div>
          </div>

          {/* Real-time Comparison Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div className="calc-metric-pill">
              <div style={{ fontSize: 11, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontWeight: 600 }}>
                Top Tier ECN Broker (0.1 pip)
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700, color: "var(--c-verified)" }}>
                ${ecnCost.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "var(--c-paper-dim)", marginTop: 4 }}>Cost across 10 trades</div>
            </div>

            <div className="calc-metric-pill">
              <div style={{ fontSize: 11, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontWeight: 600 }}>
                Average Market Maker (1.4+ pips)
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700, color: "var(--c-alert)" }}>
                ${stdCost.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "var(--c-paper-dim)", marginTop: 4 }}>Cost across 10 trades</div>
            </div>

            <div className="calc-metric-pill highlight">
              <div style={{ fontSize: 11, color: "var(--c-verified)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>
                Estimated Trader Capital Saved
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 800, color: "var(--c-verified)" }}>
                +${savings.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "var(--c-paper)", marginTop: 4 }}>Stay with audited ECN brokers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Multi-Layer Institutional Verification Methodology ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "16px 20px 72px" }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
          <div className="section-kicker" style={{ justifyContent: "center" }}><Layers size={11} /> Inspection Standard</div>
          <h2 className="section-heading" style={{ fontSize: 32, marginBottom: 12 }}>How Ledger Audits Every Broker</h2>
          <p style={{ color: "var(--c-paper-dim)", fontSize: 15, margin: 0 }}>
            We do not rely on self-reported marketing brochures. Every score is computed using our four-tier verification protocol before capital moves.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            {
              step: "01",
              icon: ShieldCheck,
              title: "Statutory License Auditing",
              desc: "Automated daily cross-referencing against primary registers including UK FCA, Australian ASIC, and European CySEC. Unlicensed clones are flagged within hours."
            },
            {
              step: "02",
              icon: FileText,
              title: "Physical On-Site Surveys",
              desc: "Field investigators physically visit and photograph registered headquarter addresses in London, Sydney, Cyprus, and offshore zones to eliminate virtual mailboxes."
            },
            {
              step: "03",
              icon: Zap,
              title: "Execution & Slippage Probing",
              desc: "Real-time tick data monitoring during high-volatility releases (NFP, CPI) to detect artificial stop-hunting, spread spiking, and delayed order fills."
            },
            {
              step: "04",
              icon: AlertOctagon,
              title: "Victim Dispute Ledger",
              desc: "Cryptographically verified complaints logging disputed balances. When withdrawal delays exceed 14 days, the broker's safety score automatically downgrades."
            }
          ].map(card => {
            const CardIcon = card.icon;
            return (
              <div key={card.step} className="methodology-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div className="methodology-icon-wrap">
                    <CardIcon size={20} />
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, color: "var(--c-muted)" }}>
                    {card.step}
                  </span>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: "var(--c-paper)", marginBottom: 8 }}>{card.title}</h4>
                <p style={{ fontSize: 13, color: "var(--c-paper-dim)", lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Unified AI Intelligence Command Deck ── */}
      <AIIntelligenceDeck
        brokers={brokers}
        exposures={exposures}
        setView={setView}
        openDetail={openDetail}
        toggleCompare={toggleCompare}
        compareList={compareList}
      />

      {/* ── Latest Exposure Reports ── */}
      <section className="exposure-band" style={{
        padding: "64px 20px",
        background: "var(--c-surface)",
        borderTop: `1px solid var(--c-line)`,
        borderBottom: `1px solid var(--c-line)`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="section-kicker kicker-alert"><AlertTriangle size={11} /> High-Risk Exposure</div>
              <h2 className="section-heading">Recent Victim Complaints & Claims</h2>
              <p style={{ color: "var(--c-paper-dim)", fontSize: 14, margin: "6px 0 0" }}>
                Active mediation claims under investigation by our dispute resolution team.
              </p>
            </div>
            <Button variant="ghost" onClick={() => setView("exposure")}>File a Claim →</Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 18 }}>
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

      {/* ── Live Market Overview Grid ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="section-kicker"><BarChart3 size={11} /> Market Overview</div>
            <h2 className="section-heading">Live Trading Finance Snapshot</h2>
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

      {/* ── Mediation Center Activity ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="section-kicker"><Scale size={11} /> Mediation Center</div>
            <h2 className="section-heading">Resolved Dispute Activity</h2>
          </div>
          <Badge tone="reg">$72,130,288 Recovered & Resolved</Badge>
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

      {/* ── About Ledger Mission ── */}
      <section className="about-ledger" style={{ marginTop: 64 }}>
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

/* ---------------------------------------------------------
   UNIFIED AI INTELLIGENCE COMMAND DECK
--------------------------------------------------------- */
function AIIntelligenceDeck({ brokers, exposures, setView, openDetail, toggleCompare, compareList = [] }) {
  const [selectedId, setSelectedId] = useState(brokers[0]?.id || "");
  const [filterMode, setFilterMode] = useState("all");

  const selectedBroker = brokers.find((b) => b.id === selectedId) || brokers[0];
  const flagged = useMemo(() => brokers.filter(b => (b.flags || []).length > 0 || Number(b.score) < 5), [brokers]);
  const highestRated = useMemo(() => [...brokers].sort((a, b) => Number(b.score) - Number(a.score))[0], [brokers]);

  const score = Number(selectedBroker?.score || 0);
  const flagCount = selectedBroker?.flags?.length || 0;
  const relatedCases = useMemo(() => {
    if (!selectedBroker) return [];
    return exposures.filter((e) => e.brokerName?.toLowerCase() === selectedBroker.name?.toLowerCase());
  }, [exposures, selectedBroker]);

  const disputedSum = relatedCases.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const isCritical = score < 5 || flagCount >= 2;
  const isElevated = !isCritical && (score < 7.5 || flagCount === 1 || /offshore|unregistered/i.test(selectedBroker?.regulator || ""));

  const signalTone = isCritical ? "critical" : isElevated ? "elevated" : "clear";
  const levelText = isCritical ? "Critical Risk Alert" : isElevated ? "Elevated Caution" : "Verified Institution";
  const dialColor = isCritical ? "var(--c-alert)" : isElevated ? "var(--c-amber)" : "var(--c-verified)";
  const scorePercent = Math.min(100, Math.max(10, Math.round(score * 10)));
  const confidence = brokers.length ? Math.min(99, Math.round(74 + (brokers.length * 3) + (selectedBroker ? 12 : 0))) : 0;

  function selectRisk() {
    setFilterMode("risk");
    if (flagged.length > 0) {
      setSelectedId(flagged[0].id);
    }
  }

  function selectTop() {
    setFilterMode("top");
    if (highestRated) {
      setSelectedId(highestRated.id);
    }
  }

  function handleSelect(id) {
    setFilterMode("custom");
    setSelectedId(id);
  }

  const isCompared = selectedBroker && compareList.some(x => x.id === selectedBroker.id);

  // Synthesized AI assessment
  let analysisText = "";
  let actionText = "";

  if (isCritical) {
    analysisText = `${selectedBroker?.name} holds severe risk indicators (${flagCount ? `${flagCount} risk flags on file` : "sub-standard trust index"})${relatedCases.length ? ` and ${relatedCases.length} public complaint cases totaling $${disputedSum.toLocaleString()}` : ""}. Unregulated or high-dispute operating profile.`;
    actionText = "Strong caution: Avoid depositing capital. Inspect open dispute cases and regulatory warnings prior to any engagement.";
  } else if (isElevated) {
    analysisText = `${selectedBroker?.name} maintains an operational history (${selectedBroker?.years}yr), but exhibits caution signals: ${selectedBroker?.regulator?.includes("Offshore") ? "Offshore jurisdiction with relaxed statutory oversight" : "moderate trust scoring requiring independent scrutiny"}.`;
    actionText = "Verify license registration directly with the official statutory body and audit withdrawal processing speeds.";
  } else {
    analysisText = `${selectedBroker?.name} demonstrates benchmark compliance with tier-1 regulatory oversight (${selectedBroker?.regulator}), ${selectedBroker?.years} years of active operations, and clean public exposure records.`;
    actionText = "Institutional-grade dossier verified. Proceed to account terms evaluation and segregated custody verification.";
  }

  return (
    <section className="ai-unified-deck">
      <div className="ai-deck-glow-orb" />

      {/* Header bar */}
      <div className="ai-deck-head">
        <div className="ai-deck-head-left">
          <div className="ai-deck-badge">
            <Sparkles size={13} />
            <span>LEDGER NEURAL RISK RADAR</span>
            <span className="ai-deck-live-dot" />
          </div>
          <h2 className="ai-deck-title">Autonomous Risk Briefing & Decision Terminal</h2>
          <p className="ai-deck-subtitle">
            Algorithmic synthesis cross-referencing Tier-1 regulatory registers, physical survey records, and verified dispute exposure files.
          </p>
        </div>

        <div className="ai-deck-head-right">
          <div className="ai-confidence-box">
            <div className="ai-confidence-label">
              <span>EVIDENCE CONFIDENCE</span>
              <strong>{confidence}%</strong>
            </div>
            <div className="ai-confidence-track">
              <div className="ai-confidence-fill" style={{ width: `${confidence}%` }} />
            </div>
            <div className="ai-confidence-meta">
              <span className="ai-confidence-ping" />
              <span>Active Multi-Vector Registry Heuristics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="ai-deck-toolbar">
        <div className="ai-selector-wrap">
          <span className="ai-selector-label">TARGET DOSSIER:</span>
          <div className="ai-custom-select-box">
            <select
              value={selectedBroker?.id || ""}
              onChange={(e) => handleSelect(e.target.value)}
              aria-label="Select target broker for risk analysis"
            >
              {brokers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} — Trust {b.score}/10 · {b.country}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="ai-select-arrow" />
          </div>
        </div>

        <div className="ai-filter-actions">
          <button
            type="button"
            className={`ai-filter-btn ${filterMode === "risk" ? "is-active" : ""}`}
            onClick={selectRisk}
            title="Inspect highest risk profile"
          >
            <AlertTriangle size={13} />
            <span>Risk Queue ({flagged.length})</span>
          </button>
          <button
            type="button"
            className={`ai-filter-btn ${filterMode === "top" ? "is-active" : ""}`}
            onClick={selectTop}
            title="Inspect top rated institution"
          >
            <ShieldCheck size={13} />
            <span>Top Rated</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="ai-deck-grid">
        {/* Left Column: Biometric Radar & Score Dial */}
        <div className="ai-radar-panel-card">
          <div className="ai-radar-dish">
            <div className="radar-sweep-effect" />
            <div className="ai-radar-orbit orbit-outer" />
            <div className="ai-radar-orbit orbit-mid" />
            <div className="ai-radar-crosshair-h" />
            <div className="ai-radar-crosshair-v" />

            {/* Core Score Ring */}
            <div
              className="ai-radar-gauge-ring"
              style={{
                background: `conic-gradient(${dialColor} ${scorePercent}%, rgba(255,255,255,0.06) 0)`
              }}
            >
              <div className="ai-radar-gauge-core">
                <span className="ai-core-score">{score.toFixed(1)}</span>
                <span className="ai-core-denom">TRUST INDEX</span>
              </div>
            </div>
          </div>

          <div className="ai-radar-verdict-block">
            <div className={`ai-signal-badge tone-${signalTone}`}>
              <span className="ai-signal-dot" />
              <span>{levelText}</span>
            </div>
            <h3 className="ai-verdict-name">{selectedBroker?.name}</h3>
            <div className="ai-verdict-meta">
              <span>{selectedBroker?.years}yr Track Record</span>
              <span>·</span>
              <span>{selectedBroker?.country}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Deep Audit Tiles & Heuristic Synthesis */}
        <div className="ai-intel-content-card">
          <div className="ai-telemetry-triad">
            {/* Tile 1: Regulatory Posture */}
            <div className="ai-triad-card">
              <div className="ai-triad-top">
                <div className="ai-triad-icon-box tone-reg">
                  <Scale size={15} />
                </div>
                <span className="ai-triad-tag">REGULATORY POSTURE</span>
              </div>
              <div className="ai-triad-primary">{selectedBroker?.regulator || "Unregistered"}</div>
              <div className="ai-triad-secondary">
                {selectedBroker?.licenseStatus || "Standard Regulation"} · {selectedBroker?.license || "No ID"}
              </div>
            </div>

            {/* Tile 2: Exposure History */}
            <div className="ai-triad-card">
              <div className="ai-triad-top">
                <div className={`ai-triad-icon-box ${relatedCases.length > 0 ? "tone-alert" : "tone-verified"}`}>
                  <ShieldCheck size={15} />
                </div>
                <span className="ai-triad-tag">EXPOSURE DESK</span>
              </div>
              <div className={`ai-triad-primary ${relatedCases.length > 0 ? "color-alert" : ""}`}>
                {relatedCases.length} {relatedCases.length === 1 ? "Dispute Case" : "Dispute Cases"}
              </div>
              <div className="ai-triad-secondary">
                {disputedSum > 0 ? `$${disputedSum.toLocaleString()} disputed capital` : "Zero unresolved public claims"}
              </div>
            </div>

            {/* Tile 3: Environment & Terms */}
            <div className="ai-triad-card">
              <div className="ai-triad-top">
                <div className="ai-triad-icon-box tone-amber">
                  <Activity size={15} />
                </div>
                <span className="ai-triad-tag">EXECUTION AUDIT</span>
              </div>
              <div className="ai-triad-primary">{selectedBroker?.type || "Standard ECN"} Model</div>
              <div className="ai-triad-secondary">
                Min: ${selectedBroker?.min_deposit || 50} · Max Lev: {selectedBroker?.max_leverage || "1:500"}
              </div>
            </div>
          </div>

          {/* Heuristic Synthesis & Action Footer */}
          <div className="ai-synthesis-card">
            <div className="ai-synthesis-body">
              <div className="ai-synthesis-kicker">
                <Sparkles size={12} />
                <span>ALGORITHMIC SYNTHESIS & NEXT ACTION</span>
              </div>
              <p className="ai-synthesis-reason">
                {analysisText}
              </p>
              <div className="ai-synthesis-recom">
                <ArrowRight size={13} className="ai-recom-arrow" />
                <span>{actionText}</span>
              </div>
            </div>

            <div className="ai-action-bar">
              {selectedBroker && (
                <Button variant="subtle" onClick={() => openDetail(selectedBroker)} style={{ padding: "9px 15px" }}>
                  <Eye size={14} /> Inspect Dossier
                </Button>
              )}
              {selectedBroker && (
                <Button
                  variant={isCompared ? "primary" : "ghost"}
                  onClick={() => toggleCompare(selectedBroker)}
                  style={{ padding: "9px 14px" }}
                  title={isCompared ? "Remove from comparison" : "Add to comparison"}
                >
                  <Scale size={14} /> {isCompared ? "In Comparison" : "Compare"}
                </Button>
              )}
              <Button onClick={() => setView("brokers")} style={{ padding: "9px 16px" }}>
                Browse Registry <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   BROKER CARD COMPONENT
--------------------------------------------------------- */
function BrokerCard({ b, onClick, onCompare, isCompared, rank }) {
  const isFlagged = b.flags && b.flags.length > 0;
  const score = Number(b.score || 0);
  const scoreColor = score >= 8 ? "var(--c-verified)" : score >= 5 ? "var(--c-amber)" : "var(--c-alert)";
  const ringPercent = Math.round(score * 10);

  return (
    <div className={`broker-card ${isFlagged ? "flagged" : ""} ${rank ? `rank-card rank-${rank}` : ""}`}>
      {/* Accent glow bar on hover */}
      <div className="broker-card-glow-bar" />

      <div>
        {/* Top Rank Badge if present */}
        {rank && (
          <div className="broker-rank-ribbon">
            <span className="rank-number">#{rank}</span>
            <span className="rank-label">BENCHMARK LEADER</span>
          </div>
        )}

        {/* Header: Name, Country/Years, Rating, and Score Ring */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 600,
              lineHeight: 1.2, margin: "0 0 5px", color: "var(--c-paper)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
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
                  padding: "1px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                }}>★ {b.userRating}</span>
              )}
            </div>
          </div>

          {/* High-tech radial score ring */}
          <div
            className="broker-score-dial"
            style={{
              background: `conic-gradient(${scoreColor} ${ringPercent}%, rgba(255,255,255,0.06) 0)`
            }}
          >
            <div className="broker-score-dial-inner">
              <span className="score-num" style={{ color: scoreColor }}>{score.toFixed(1)}</span>
              <span className="score-denom">/10</span>
            </div>
          </div>
        </div>

        {/* Tags & Badges */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", margin: "10px 0 14px" }}>
          {b.licenseStatus && (
            <Badge tone={b.licenseStatus === "Regulated" ? "reg" : b.licenseStatus === "Suspicious" || b.licenseStatus === "Unregulated Clone" ? "warn" : "pending"}>
              {b.licenseStatus}
            </Badge>
          )}
          <Badge tone="reg">{b.regulator}</Badge>
          <Badge>{b.type}</Badge>
          {b.flags.map((f, i) => <Badge key={i} tone="warn">{f}</Badge>)}
        </div>

        {/* 3-Column Financial Parameters */}
        <div className="broker-params-grid">
          <div className="param-item">
            <span className="param-label">Min Deposit</span>
            <strong className="param-value">${b.min_deposit || 50}</strong>
          </div>
          <div className="param-item">
            <span className="param-label">Max Leverage</span>
            <strong className="param-value">{b.max_leverage || '1:500'}</strong>
          </div>
          <div className="param-item">
            <span className="param-label">Execution</span>
            <strong className="param-value">{b.type || 'ECN/STP'}</strong>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="broker-card-actions">
        <Button variant="subtle" onClick={onClick} style={{ flex: 1, justifyContent: "center" }}>
          View Dossier <ArrowRight size={13} />
        </Button>
        <Button
          variant={isCompared ? "primary" : "ghost"}
          onClick={(e) => { e.stopPropagation(); onCompare(); }}
          style={{ padding: "8px 12px" }}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
          aria-label={`Compare ${b.name}`}
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
    <div className="compare-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(5, 10, 18, 0.85)", backdropFilter: "blur(6px)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div className="compare-modal-card" style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 12, maxWidth: 960, width: "100%", padding: "24px 20px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${C.line}`, paddingBottom: 14 }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(18px, 4vw, 24px)" }}>Broker Side-by-Side Audit</h2>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Evaluating safety metrics, regulation tiers, and execution parameters.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.paperDim, cursor: "pointer", padding: 4 }} aria-label="Close comparison"><X size={20} /></button>
        </div>
        <div className="compare-table-scroll" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${items.length}, minmax(180px, 1fr))`, gap: 12, minWidth: "max-content" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, color: C.muted, fontSize: 12, fontWeight: 600, paddingTop: 52 }}>
              <div>Trust Rating</div>
              <div>Jurisdiction</div>
              <div>Regulation Tier</div>
              <div>Execution Model</div>
              <div>Min Deposit</div>
              <div>Max Leverage</div>
              <div>Risk Flags</div>
            </div>
            {items.map((b) => (
              <div key={b.id} style={{ background: C.ink, border: `1px solid ${C.lineStrong}`, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 18, minWidth: 180 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{b.name}</div>
                  <button onClick={() => onRemove(b.id)} style={{ background: "none", border: "none", color: C.alert, cursor: "pointer", padding: 2 }} title="Remove broker"><Trash2 size={14} /></button>
                </div>
                <Stamp score={b.score} alert={b.flags.length > 0} size={42} />
                <div style={{ fontSize: 13 }}>{b.country}</div>
                <div><Badge tone="reg">{b.regulator}</Badge></div>
                <div style={{ fontSize: 13 }}>{b.type}</div>
                <div style={{ fontSize: 13 }}>${b.min_deposit || 50}</div>
                <div style={{ fontSize: 13 }}>{b.max_leverage || "1:500"}</div>
                <div>
                  {b.flags.length ? b.flags.map((f, i) => <Badge key={i} tone="warn">{f}</Badge>) : <span style={{ color: C.verified, fontSize: 12 }}>None on file</span>}
                </div>
              </div>
            ))}
          </div>
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
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
      <div className="section-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600 }}>Broker Case Directory</h1>
          <p style={{ color: C.paperDim, fontSize: 14, marginTop: 4 }}>Full regulatory dossier and inspection database.</p>
        </div>
        <div className="broker-filter-bar" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.lineStrong}`, padding: "8px 14px", borderRadius: 8, flex: 1, minWidth: 160 }}>
            <Search size={15} color={C.muted} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter directory..." style={{ background: "transparent", border: "none", outline: "none", color: C.paper, fontSize: 13, width: "100%" }} />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "8px 12px", borderRadius: 8 }}>
            <option value="score">Sort: Trust Score</option>
            <option value="years">Sort: Longevity</option>
            <option value="name">Sort: Alphabetical</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 20 }}>
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
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 600, marginTop: 6 }}>Trading pair pulse and spread comparison</h1>
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

      <div className="market-layout" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 10, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22 }}>Spread comparison</h3>
            <Badge tone="reg">EURUSD</Badge>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", minWidth: 320, borderCollapse: "collapse" }}>
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
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 10, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22 }}>Top movers</h3>
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
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
      <div className="section-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="section-kicker">Ranking Dashboard</div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(24px, 5vw, 32px)", marginTop: 4, marginBottom: 0, letterSpacing: "-0.01em" }}>Broker leaderboard</h1>
        </div>
        <Badge tone="reg">Live scoring snapshot</Badge>
      </div>

      <div className="tab-scroll-wrap" style={{ display: "flex", gap: 12, marginBottom: 28, borderBottom: `1px solid var(--c-line-strong)`, paddingBottom: 12, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <button onClick={() => setActiveTab("forex")} style={{ background: "none", border: "none", color: activeTab === "forex" ? "var(--c-paper)" : "var(--c-muted)", fontWeight: activeTab === "forex" ? 700 : 400, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif", borderBottom: activeTab === "forex" ? `2px solid var(--c-verified)` : "2px solid transparent", paddingBottom: 8, whiteSpace: "nowrap" }}>Top 10 Forex</button>
        <button onClick={() => setActiveTab("crypto")} style={{ background: "none", border: "none", color: activeTab === "crypto" ? "var(--c-paper)" : "var(--c-muted)", fontWeight: activeTab === "crypto" ? 700 : 400, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif", borderBottom: activeTab === "crypto" ? `2px solid var(--c-verified)` : "2px solid transparent", paddingBottom: 8, whiteSpace: "nowrap" }}>Top Crypto</button>
        <button onClick={() => setActiveTab("blacklist")} style={{ background: "none", border: "none", color: activeTab === "blacklist" ? "var(--c-alert)" : "var(--c-muted)", fontWeight: activeTab === "blacklist" ? 700 : 400, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif", borderBottom: activeTab === "blacklist" ? `2px solid var(--c-alert)` : "2px solid transparent", paddingBottom: 8, whiteSpace: "nowrap" }}>Global Blacklist</button>
      </div>

      {activeTab === "forex" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 14, marginBottom: 28 }}>
          {leaderboardMetrics.map((metric) => (
            <div key={metric.label} style={{
              background: "var(--gradient-card)",
              border: `1px solid var(--c-line)`,
              borderRadius: 14, padding: 18,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--c-line-accent)"; e.currentTarget.style.boxShadow = "var(--shadow-sm), var(--shadow-glow)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-line)"; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ color: "var(--c-muted)", fontSize: 10.5, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.07em" }}>{metric.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, margin: "8px 0 4px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "-0.02em" }}>{metric.value}</div>
              <div style={{ color: "var(--c-paper-dim)", fontSize: 12 }}>Leader: {metric.leader}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ranked.map((broker, index) => (
          <div key={broker.id} className="leaderboard-row">
            <div className="lb-rank" style={{ fontFamily: "'IBM Plex Mono', monospace", color: index < 3 ? "var(--c-verified)" : "var(--c-muted)", fontWeight: index < 3 ? 700 : 400, fontSize: index < 3 ? 16 : 14 }}>#{index + 1}</div>
            <div className="lb-main">
              <div style={{ fontWeight: 700, fontSize: 14 }}>{broker.name}</div>
              <div style={{ color: "var(--c-paper-dim)", fontSize: 12, marginTop: 2 }}>{broker.country}</div>
            </div>
            <div className="lb-badge"><Badge tone={Number(broker.score) >= 8 ? "reg" : Number(broker.score) >= 5 ? "pending" : "warn"}>{broker.score}/10</Badge></div>
            <div className="lb-reg" style={{ color: "var(--c-paper-dim)", fontSize: 13 }}>{broker.regulator}</div>
            <div className="lb-type" style={{ color: "var(--c-paper-dim)", fontSize: 13 }}>{broker.type}</div>
            <div className="lb-deposit" style={{ textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{broker.min_deposit ? `$${broker.min_deposit}` : "-"}</div>
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
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
      <div className="exposure-layout" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(22px, 4vw, 28px)", marginBottom: 8 }}>Active Public Complaints</h2>
          <p style={{ color: C.paperDim, fontSize: 14, marginBottom: 24 }}>Verified investor withdrawal and trade disruption records.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {published.map((e) => (
              <div key={e.id} style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, padding: 20, borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
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
          <div className="exposure-form-card" style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, marginBottom: 6 }}>Submit an Exposure Dossier</h3>
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
    <div className="detail-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(6,11,19,0.8)", backdropFilter: "blur(8px)", zIndex: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
      <div className="detail-modal-card" style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 12, maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "28px 24px", position: "relative", boxSizing: "border-box" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: C.paperDim, cursor: "pointer", padding: 4 }} aria-label="Close modal"><X size={20} /></button>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, flexWrap: "wrap", paddingRight: 32 }}>
          <Stamp score={broker.score} alert={broker.flags.length > 0} size={54} />
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(20px, 4vw, 24px)" }}>{broker.name}</h2>
            <div style={{ color: C.muted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, marginTop: 2 }}>Operating {broker.years} Years · Jurisdiction: {broker.country}</div>
          </div>
        </div>

        <div className="detail-modal-scores" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 10, marginBottom: 20 }}>
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
            <div key={k} style={{ background: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "8px 10px", gridColumn: (k === "Field Survey" || k === "Infringement Flags") ? "1 / -1" : undefined }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, wordBreak: "break-word" }}>{v}</div>
            </div>
          ))}
        </div>

        <div className="detail-modal-bottom-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 20 }}>
          <div>
            <h4 style={{ fontSize: 12, textTransform: "uppercase", color: C.muted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 10 }}>Case History ({related.length})</h4>
            {related.length === 0 ? (
              <div style={{ color: C.muted, fontSize: 13 }}>No recorded dispute dossiers for this broker.</div>
            ) : related.map(r => (
              <div key={r.id} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 8, marginTop: 8, fontSize: 13 }}>
                <div style={{ fontWeight: 600 }}>{r.title}</div>
                <div style={{ color: C.paperDim, marginTop: 2, fontSize: 12 }}>{r.text}</div>
              </div>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 12, textTransform: "uppercase", color: C.muted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 10 }}>Community Reviews</h4>
            {(!broker.reviews || broker.reviews.length === 0) ? (
              <div style={{ color: C.muted, fontSize: 13 }}>No community reviews available yet.</div>
            ) : broker.reviews.map((r, i) => (
              <div key={i} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 8, marginTop: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <div style={{ fontWeight: 600 }}>{r.user}</div>
                  <div style={{ color: C.amber, fontSize: 12 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                </div>
                <div style={{ color: C.paperDim, fontSize: 12 }}>{r.text}</div>
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
  const [tab, setTab] = useState(() => {
    return localStorage.getItem("ledger_admin_tab") || "overview";
  });

  useEffect(() => {
    localStorage.setItem("ledger_admin_tab", tab);
  }, [tab]);
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
      const errMsg = saved?.error || (saved === null ? "Cannot reach backend server. Ensure 'npm run server' is running on port 5000." : "Check backend / Supabase RLS policies.");
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

  const cardStyle = { background: "var(--admin-card-bg)", border: `1px solid ${C.lineStrong}`, padding: "18px 20px", borderRadius: 12 };
  const rowHover = { transition: "background 0.2s" };

  return (
    <div className="admin-shell" style={{ maxWidth: 1440, margin: "0 auto", padding: "36px 28px 70px" }}>
      {/* Header */}
      <div className="admin-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, borderBottom: `1px solid ${C.line}`, paddingBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: C.verified, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>🛡 Ledger Intelligence</div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(22px, 5vw, 28px)", marginBottom: 4 }}>Admin Control Centre</h1>
          <div style={{ fontSize: 13, color: C.muted }}>Full platform management · Logged in as Administrator</div>
        </div>
        <div className="admin-header-actions">
          <div className="admin-header-tools">
            <Button variant="ghost" onClick={handleHighlightRisk}><AlertTriangle size={14} /> Flag Risk</Button>
            <Button variant="subtle" onClick={handleBulkReview}><CheckCircle2 size={14} /> Bulk Review</Button>
          </div>
          <div className="admin-header-separator" />
          <Button variant="danger" onClick={onLogout} className="admin-header-logout" title="Sign out of Administrator session">
            <LogOut size={14} /> Sign Out
          </Button>
        </div>
      </div>

      {/* Notification */}
      {adminMessage && (
        <div role="status" style={{ marginBottom: 20, padding: "12px 16px", border: `1px solid ${msgType === "success" ? C.verifiedDim : C.amberDim}`, background: msgType === "success" ? C.verifiedDim : C.amberDim, color: msgType === "success" ? C.verified : C.amber, borderRadius: 10, fontSize: 13, fontWeight: 500 }}>
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
          <div className="admin-sidebar-status">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <i /> Database connected<strong>PostgreSQL</strong>
            </div>
            <button
              type="button"
              className="admin-sidebar-logout-btn"
              onClick={onLogout}
              title="Sign out of Administrator session"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </aside>

        <main className="admin-content">

          {/* ─── OVERVIEW DASHBOARD ─── */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", minWidth: 0 }}>
              {/* KPI row */}
              <div className="admin-overview-kpi-grid">
                {[
                  { label: "Broker Records", value: brokers.length, color: C.verified, icon: "🏦" },
                  { label: "Pending Review", value: exposures.filter(e => e.status === "pending").length, color: C.amber, icon: "⏳" },
                  { label: "Published Alerts", value: exposures.filter(e => e.status === "published").length, color: C.blue, icon: "📣" },
                  { label: "Scam Alerts", value: alerts.length, color: C.alert, icon: "🚨" },
                  { label: "Field Surveys", value: surveys.length, color: C.amber, icon: "🔍" },
                  { label: "News Dispatches", value: news.length, color: C.verified, icon: "📰" },
                ].map(({ label, value, color, icon }) => (
                  <div key={label} className="admin-overview-kpi-card" style={{ ...cardStyle, textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                    <div className="admin-overview-kpi-val" style={{ fontSize: 30, fontWeight: 800, color, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.1 }}>{value}</div>
                    <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Activity + Risk Watch */}
              <div className="admin-overview-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                <GlassCard style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20 }}>Recent Exposures</h3>
                    <Badge tone="reg">Live Feed</Badge>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[...exposures].slice(0, 5).map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: `1px solid ${C.line}`, paddingBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ minWidth: "min(100%, 180px)", flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, wordBreak: "break-word" }}>{item.brokerName}</div>
                          <div style={{ color: C.paperDim, fontSize: 12, marginTop: 2, wordBreak: "break-word" }}>{item.title}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                          {item.amount && <Badge tone="warn">${Number(item.amount).toLocaleString()}</Badge>}
                          <Badge tone={item.status === "pending" ? "pending" : item.status === "rejected" ? "warn" : "reg"}>{item.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20 }}>Risk Watch</h3>
                    <AlertTriangle size={17} color={C.alert} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {riskWatch.map((b) => (
                      <div key={b.id} style={{ background: "rgba(255,61,0,0.06)", border: `1px solid ${C.alertDim}`, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <strong style={{ fontSize: 14, wordBreak: "break-word" }}>{b.name}</strong>
                          <Badge tone="warn">{Number(b.score).toFixed(1)}/10</Badge>
                        </div>
                        <div style={{ color: C.paperDim, fontSize: 12, marginTop: 5, wordBreak: "break-word" }}>{(b.flags || []).join(" · ") || "Due for review"}</div>
                      </div>
                    ))}
                    {!riskWatch.length && <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "24px 0" }}>No critical risk signals detected</div>}
                  </div>
                </GlassCard>
              </div>

              {/* Score distribution bar */}
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, marginBottom: 16 }}>Registry Score Distribution</h3>
                <div className="admin-distrib-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 14 }}>
                  {[
                    { label: "High Trust (8–10)", count: brokers.filter(b => Number(b.score) >= 8).length, color: C.verified, bg: C.verifiedDim },
                    { label: "Medium (5–7.9)", count: brokers.filter(b => Number(b.score) >= 5 && Number(b.score) < 8).length, color: C.amber, bg: C.amberDim },
                    { label: "High Risk (<5)", count: brokers.filter(b => Number(b.score) < 5).length, color: C.alert, bg: C.alertDim },
                  ].map(({ label, count, color, bg }) => {
                    const pct = brokers.length ? Math.round((count / brokers.length) * 100) : 0;
                    return (
                      <div key={label} style={{ background: bg, border: `1px solid ${color}33`, borderRadius: 12, padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <div style={{ fontSize: 28, fontWeight: 800, color }}>{count}</div>
                          <div style={{ fontSize: 11, color, fontFamily: "'IBM Plex Mono', monospace" }}>{pct}% of registry</div>
                        </div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{label}</div>
                        <div style={{ marginTop: 10, background: "var(--c-line-strong)", borderRadius: 4, height: 4 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 1s ease" }} />
                        </div>
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
            <div className="admin-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add New Broker</h3>
                <form onSubmit={handleAddBroker}>
                  <Field label="Broker Name"><input required style={inputStyle} value={newBroker.name} onChange={e => setNewBroker({ ...newBroker, name: e.target.value })} placeholder="e.g. Global FX Ltd" /></Field>
                  <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
                  <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Min Deposit ($)"><input type="number" style={inputStyle} value={newBroker.min_deposit} onChange={e => setNewBroker({ ...newBroker, min_deposit: e.target.value })} /></Field>
                    <Field label="Max Leverage"><input style={inputStyle} value={newBroker.max_leverage} onChange={e => setNewBroker({ ...newBroker, max_leverage: e.target.value })} placeholder="1:500" /></Field>
                  </div>
                  <Field label="Infringement Flags (comma-separated)"><input style={inputStyle} value={newBroker.flags} onChange={e => setNewBroker({ ...newBroker, flags: e.target.value })} placeholder="Offshore, Withdrawal delays" /></Field>
                  <Button type="submit" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}><Plus size={14} /> Add Broker to Registry</Button>
                </form>
              </GlassCard>

              <GlassCard style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Registry Roster <span style={{ color: C.muted, fontSize: 14 }}>({filteredBrokers.length})</span></h3>
                  <div className="admin-roster-search" style={{ display: "flex", alignItems: "center", gap: 8, background: C.ink, border: `1px solid ${C.lineStrong}`, borderRadius: 10, minWidth: 220, padding: "8px 12px" }}>
                    <Search size={14} color={C.muted} />
                    <input value={brokerSearch} onChange={(e) => setBrokerSearch(e.target.value)} placeholder="Search broker..." style={{ background: "transparent", border: "none", outline: "none", color: C.paper, flex: 1, fontSize: 13 }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 600, overflowY: "auto" }}>
                  {filteredBrokers.map((b) => (
                    <div key={b.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "min(100%, 200px)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{b.name}</span>
                          <Badge tone={b.licenseStatus === "Regulated" ? "reg" : b.licenseStatus === "Suspicious" || b.licenseStatus === "Unregulated Clone" ? "warn" : "pending"}>{b.licenseStatus || b.regulator}</Badge>
                        </div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{b.country} · {b.type} · Score: <span style={{ color: Number(b.score) >= 8 ? C.verified : Number(b.score) >= 5 ? C.amber : C.alert, fontWeight: 700 }}>{b.score}/10</span></div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
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
                  <h3 style={{ fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Exposure Triage Queue</h3>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{exposures.filter(e => e.status === "pending").length} items awaiting review</div>
                </div>
                <div className="admin-actions-wrap" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch", maxWidth: "100%", paddingBottom: 2 }}>
                    {["all", "pending", "published", "rejected"].map(f => (
                      <button key={f} onClick={() => setExposureFilter(f)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${exposureFilter === f ? C.verified : C.lineStrong}`, background: exposureFilter === f ? C.verifiedDim : "transparent", color: exposureFilter === f ? C.verified : C.paperDim, cursor: "pointer", fontSize: 13, fontWeight: exposureFilter === f ? 700 : 400, textTransform: "capitalize", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                        {f}
                      </button>
                    ))}
                  </div>
                  <Button variant="primary" onClick={handleBulkReview} style={{ padding: "7px 16px", fontSize: 13 }}><CheckCircle2 size={13} /> Publish All Pending</Button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filteredExposures.map((e) => (
                  <div key={e.id} style={{ ...cardStyle, border: `1px solid ${e.status === "pending" ? C.amberDim : e.status === "rejected" ? C.alertDim : C.lineStrong}`, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "min(100%, 240px)" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                        <Badge tone={e.status === "pending" ? "pending" : e.status === "rejected" ? "warn" : "reg"}>{e.status.toUpperCase()}</Badge>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{e.brokerName}</span>
                        {e.amount && <Badge tone="warn">Disputed: ${Number(e.amount).toLocaleString()}</Badge>}
                      </div>
                      <h4 style={{ fontSize: 15, margin: "0 0 6px", lineHeight: 1.3, wordBreak: "break-word" }}>{e.title}</h4>
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
                <h3 style={{ fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>Publish Intelligence Dispatch</h3>
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
                <h3 style={{ fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>Published Dispatches ({news.length})</h3>
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
            <div className="admin-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>Issue Scam Alert</h3>
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
                <h3 style={{ fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>Active Alerts ({alerts.length})</h3>
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
            <div className="admin-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
              <GlassCard style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>Submit Field Survey</h3>
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
                <h3 style={{ fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>Survey Reports ({surveys.length})</h3>
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
                  <h3 style={{ fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Forum Moderation</h3>
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
                      <button onClick={() => setForumMod(forumMod.map(p => p.id === post.id ? { ...p, hidden: !p.hidden } : p))} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.lineStrong}`, background: post.hidden ? C.verifiedDim : C.amberDim, color: post.hidden ? C.verified : C.amber, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
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
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(26px, 4vw, 36px)", marginBottom: 12 }}>Trader Education Hub</h1>
      <p style={{ color: C.paperDim, fontSize: 15, marginBottom: 32 }}>Learn how to identify legitimate brokers and protect your capital from sophisticated scams.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
        {[
          { title: "Beginner's Guide to Forex Regulations", desc: "Understanding the difference between Tier-1 (FCA, ASIC) and offshore licenses.", time: "10 min read" },
          { title: "How to Spot a Clone Broker", desc: "Clones use real license numbers but fake websites. Learn the tell-tale signs.", time: "8 min read" },
          { title: "The Reality of 'Guaranteed Returns'", desc: "Why promises of fixed monthly profits are mathematically impossible in live markets.", time: "12 min read" },
          { title: "Understanding Slippage vs Manipulation", desc: "How to tell if your broker is intentionally widening spreads to hunt your stop losses.", time: "15 min read" },
        ].map((course, i) => (
          <GlassCard key={i} style={{ padding: 24, borderRadius: 12, border: `1px solid ${C.lineStrong}`, display: "flex", flexDirection: "column", gap: 12 }}>
            <Badge tone="reg">Course</Badge>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20 }}>{course.title}</h3>
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
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(26px, 4vw, 36px)", marginBottom: 12 }}>EA & VPS Trading Tools</h1>
      <p style={{ color: C.paperDim, fontSize: 15, marginBottom: 32 }}>Enhance your trading environment with verified low-latency servers and trusted Expert Advisors.</p>
      
      <div className="tools-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, marginBottom: 16 }}>Low Latency VPS</h2>
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
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, marginBottom: 16 }}>Verified EAs</h2>
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
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(26px, 4vw, 36px)", marginBottom: 12 }}>Live Streams & Media</h1>
      <p style={{ color: C.paperDim, fontSize: 15, marginBottom: 32 }}>Watch live market analysis and webinar recordings from industry experts.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 24 }}>
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
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, marginTop: 12 }}>{vid.title}</h3>
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
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(26px, 4vw, 36px)", marginBottom: 12 }}>Regulatory Centers</h1>
      <p style={{ color: C.paperDim, fontSize: 15, marginBottom: 32 }}>Filter and verify brokers by their official regulatory jurisdiction.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: 16, marginBottom: 40 }}>
        {regulators.map(reg => (
          <button key={reg} onClick={() => setSelectedReg(reg)} style={{ background: selectedReg === reg ? "var(--c-surface-hov)" : "var(--c-surface)", border: `1px solid ${selectedReg === reg ? C.verified : C.lineStrong}`, padding: 24, borderRadius: 8, cursor: "pointer", color: "var(--c-paper)", textAlign: "center", transition: "all 0.2s" }}>
            <h3 style={{ fontSize: 24, fontWeight: 700 }}>{reg}</h3>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>View regulated brokers</div>
          </button>
        ))}
      </div>

      {selectedReg && (
        <div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, marginBottom: 16 }}>Brokers Regulated by {selectedReg}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 24 }}>
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
        <div className="footer-promo-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60, padding: "40px", background: "var(--gradient-hero)", border: `1px solid var(--c-line-strong)`, borderRadius: 16, alignItems: "center" }}>
          <div>
            <Badge tone="reg">📱 Mobile App</Badge>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(24px, 4vw, 32px)", marginTop: 12, marginBottom: 12 }}>Check Any Broker in Seconds</h2>
            <p style={{ color: "var(--c-paper-dim)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Scan brokers, receive live scam alerts, and file exposures from anywhere. Download the Ledger Intelligence mobile app.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="primary">⬇ App Store</Button>
              <Button variant="ghost">⬇ Google Play</Button>
            </div>
          </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>
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
    <div className="page-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Badge tone="warn">⚠ Live Alert Feed</Badge>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 5vw, 40px)", marginTop: 10, marginBottom: 10 }}>Scam Alert Board</h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 600 }}>Real-time warnings about fraudulent brokers, clone operations, and withdrawal theft cases verified by our intelligence network.</p>
      </div>

      {/* Stats bar */}
      <div className="stats-four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
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
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
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
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
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
   FIELD SURVEY PAGE (ENHANCED 360° OFFICE INSPECTIONS)
--------------------------------------------------------- */
function FieldSurveyPage({ surveys: propSurveys }) {
  const surveys = propSurveys || fieldSurveys;
  const statusColor = { Verified: C.verified, Suspicious: C.amber, Fraudulent: C.alert };
  const statusBg = { Verified: "rgba(0,230,118,0.1)", Suspicious: "rgba(255,196,0,0.1)", Fraudulent: "rgba(255,61,0,0.1)" };
  const [activePhotoTab, setActivePhotoTab] = useState({});

  return (
    <div className="page-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Badge tone="reg">🔍 Multi-Angle Physical Inspections</Badge>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 5vw, 40px)", marginTop: 10, marginBottom: 10 }}>Field Survey Reports & 360° Verification</h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 700 }}>
          Independent Ledger investigative teams conduct on-site physical audits across 30+ financial capitals to verify registered offices, staff occupancy, regulatory plaque authenticity, and detect ghost shell companies.
        </p>
      </div>

      <div className="survey-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 540px), 1fr))", gap: 28 }}>
        {surveys.map(fs => {
          const currentTab = activePhotoTab[fs.id] || "Exterior";
          const currentPhoto = fs.photos?.find(p => p.tab === currentTab) || fs.photos?.[0] || { label: "Office Overview", desc: fs.findings };

          return (
            <div key={fs.id} style={{ background: C.surface, border: `1px solid ${statusColor[fs.status]}33`, borderRadius: 18, padding: "26px 28px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Status ribbon */}
              <div style={{ position: "absolute", top: 20, right: 20, background: statusColor[fs.status], color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{fs.status}</div>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: statusBg[fs.status], border: `1px solid ${statusColor[fs.status]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {fs.status === "Verified" ? "✅" : fs.status === "Suspicious" ? "⚠️" : "🚨"}
                </div>
                <div style={{ minWidth: 0, paddingRight: 90 }}>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, marginBottom: 4, wordBreak: "break-word" }}>{fs.broker}</h3>
                  <div style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", wordBreak: "break-word" }}>📍 {fs.address}</div>
                </div>
              </div>

              {/* Inspector & GPS coordinates */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", fontSize: 12, color: C.paperDim, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: `1px solid var(--c-line)` }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: C.verified }}>
                  <ShieldCheck size={14} /> {fs.inspector || "Verified Auditor"}
                </span>
                <span style={{ color: C.muted }}>•</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.paperDim }}>
                  🌐 GPS: {fs.coords || "Verified"}
                </span>
                <span style={{ color: C.muted }}>•</span>
                <span style={{ color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>📅 {fs.date}</span>
              </div>

              {/* Photo Angle Tabs */}
              {fs.photos && fs.photos.length > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center", gap: 5 }}>
                      <Camera size={13} /> On-Site Photographic Evidence
                    </div>
                    <span style={{ fontSize: 11, color: C.verified, fontFamily: "'IBM Plex Mono', monospace" }}>{currentPhoto.tab}</span>
                  </div>

                  <div className="survey-photo-nav">
                    {fs.photos.map(p => (
                      <button
                        key={p.tab}
                        type="button"
                        className={`survey-photo-tab ${currentTab === p.tab ? "active" : ""}`}
                        onClick={() => setActivePhotoTab({ ...activePhotoTab, [fs.id]: p.tab })}
                      >
                        {p.tab}
                      </button>
                    ))}
                  </div>

                  <div className="survey-photo-stage" style={{ background: "linear-gradient(135deg, #090e17 0%, #151d2a 100%)", minHeight: 140, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid var(--c-line-strong)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{currentPhoto.label}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(0,0,0,0.6)", color: C.verified, border: "1px solid rgba(0,230,118,0.3)", fontFamily: "'IBM Plex Mono', monospace" }}>TIMESTAMP VERIFIED</span>
                    </div>
                    <p style={{ color: "#d1d5db", fontSize: 13, margin: "10px 0 0", lineHeight: 1.5 }}>{currentPhoto.desc}</p>
                  </div>
                </div>
              )}

              {/* Physical Checkpoints Matrix */}
              {fs.checkpoints && (
                <div>
                  <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>Investigation Checkpoints</div>
                  <div className="survey-checklist">
                    <div className="survey-check-item">
                      {fs.checkpoints.staffOnSite ? <CheckCircle2 size={14} color={C.verified} /> : <XCircle size={14} color={C.alert} />}
                      <span>Physical Staff Present</span>
                    </div>
                    <div className="survey-check-item">
                      {fs.checkpoints.directoryListed ? <CheckCircle2 size={14} color={C.verified} /> : <XCircle size={14} color={C.alert} />}
                      <span>Building Directory Listed</span>
                    </div>
                    <div className="survey-check-item">
                      {fs.checkpoints.physicalLease ? <CheckCircle2 size={14} color={C.verified} /> : <XCircle size={14} color={C.alert} />}
                      <span>Commercial Lease Verified</span>
                    </div>
                    <div className="survey-check-item">
                      {fs.checkpoints.phoneActive ? <CheckCircle2 size={14} color={C.verified} /> : <XCircle size={14} color={C.alert} />}
                      <span>Phone / Desk Active</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ borderTop: `1px solid var(--c-line)`, paddingTop: 14 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>Field Verdict</div>
                <p style={{ color: C.paperDim, fontSize: 13.5, lineHeight: 1.6 }}>{fs.findings}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   RELATIONSHIP NETWORK & CLONE RADAR (WIKIFX-INSPIRED)
--------------------------------------------------------- */
function RelationshipNetworkPage({ networks: propNetworks, brokers, openDetail }) {
  const networks = propNetworks || initialNetworks;
  const [selectedNetId, setSelectedNetId] = useState(networks[0]?.id || "net-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [reportCloneModal, setReportCloneModal] = useState(false);
  const [reportedDomain, setReportedDomain] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  const filteredNetworks = useMemo(() => {
    return networks.filter(net => {
      const matchesSearch = net.brokerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        net.parentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        net.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (categoryFilter === "tier1") return net.contagionScore >= 8.5;
      if (categoryFilter === "clones") return net.cloneAlerts.length > 0;
      if (categoryFilter === "offshore") return net.contagionScore < 7;
      return true;
    });
  }, [networks, searchQuery, categoryFilter]);

  const activeNetwork = networks.find(n => n.id === selectedNetId) || filteredNetworks[0] || networks[0];
  const matchingBroker = brokers?.find(b => b.name.toLowerCase() === activeNetwork?.brokerName.toLowerCase());

  const handleReportClone = (e) => {
    e.preventDefault();
    if (!reportedDomain.trim()) return;
    setReportSuccess(true);
    setTimeout(() => {
      setReportCloneModal(false);
      setReportedDomain("");
      setReportSuccess(false);
    }, 2200);
  };

  return (
    <div className="page-container network-container" style={{ maxWidth: 1320, margin: "0 auto", padding: "50px 24px" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Badge tone="reg">🧬 Corporate Transparency & Clone Radar</Badge>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 5vw, 40px)", marginTop: 10, marginBottom: 8 }}>
              Broker Relationship Network
            </h1>
            <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 740, lineHeight: 1.6 }}>
              Map out corporate holding structures, white-label operations, shared regulatory umbrellas, segregated custodian banks, and detected fraudulent copycat clones in real-time.
            </p>
          </div>
          <Button onClick={() => setReportCloneModal(true)} style={{ background: "var(--c-alert-dim)", color: "var(--c-alert)", borderColor: "rgba(255,65,54,0.3)" }}>
            <AlertTriangle size={15} /> Report Clone Domain
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 24, alignItems: "center" }}>
          <div style={{ position: "relative", minWidth: 260, flex: "1 1 auto", maxWidth: 440 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
            <input
              type="text"
              placeholder="Search broker, parent holding, or jurisdiction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 16px 11px 40px",
                borderRadius: 10,
                border: "1px solid var(--c-line-strong)",
                background: "var(--input-bg)",
                color: "var(--c-paper)",
                fontSize: 14,
                outline: "none"
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { id: "all", label: "All Networks" },
              { id: "tier1", label: "Tier-1 Licensed" },
              { id: "clones", label: "Active Clone Alerts" },
              { id: "offshore", label: "Offshore Umbrellas" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: categoryFilter === tab.id ? "var(--c-verified)" : "var(--c-line)",
                  background: categoryFilter === tab.id ? "var(--c-verified-dim)" : "var(--c-surface-hi)",
                  color: categoryFilter === tab.id ? "var(--c-verified)" : "var(--c-paper-dim)",
                  transition: "all 0.2s ease"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Network Selector Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {filteredNetworks.map(net => {
          const isSelected = net.id === activeNetwork?.id;
          const isHighRisk = net.contagionScore < 5;
          return (
            <div
              key={net.id}
              onClick={() => setSelectedNetId(net.id)}
              style={{
                background: isSelected ? "var(--c-surface-hov)" : "var(--c-surface)",
                border: `1.5px solid ${isSelected ? "var(--c-verified)" : isHighRisk ? "rgba(255,65,54,0.3)" : "var(--c-line)"}`,
                borderRadius: 12,
                padding: "14px 16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isSelected ? "var(--shadow-glow)" : "none"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: isSelected ? "var(--c-verified)" : "var(--c-paper)" }}>{net.brokerName}</span>
                <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: isHighRisk ? C.alert : C.verified }}>{net.contagionScore}/10</span>
              </div>
              <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{net.parentCompany}</div>
              {net.cloneAlerts.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <span className="clone-radar-pill">⚠️ {net.cloneAlerts.length} Clone Warning</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Interactive Diagram & Dossier */}
      {activeNetwork && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.9fr", gap: 28, alignItems: "start" }}>
          {/* Visual Graph Layout */}
          <div className="network-graph-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "1px solid var(--c-line)", paddingBottom: 14 }}>
              <div>
                <span style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase" }}>Visual Hierarchy Graph</span>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, margin: "2px 0 0" }}>{activeNetwork.brokerName} Group Architecture</h3>
              </div>
              <span style={{ fontSize: 12, color: C.paperDim, padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", fontFamily: "'IBM Plex Mono', monospace" }}>
                {activeNetwork.regNo}
              </span>
            </div>

            <div className="network-tree-layout">
              {/* Level 1: Parent Group */}
              <div className="network-node-card is-parent">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(41,121,255,0.12)", color: C.blue, display: "grid", placeItems: "center" }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: C.blue, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>ULTIMATE PARENT HOLDING</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--c-paper)" }}>{activeNetwork.parentCompany}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Jurisdiction: {activeNetwork.jurisdiction}</div>
                </div>
              </div>

              {/* Connecting line */}
              <div style={{ width: 2, height: 24, background: "var(--c-line-strong)" }} />

              {/* Level 2: Regulated Operating Entities */}
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", marginBottom: 10, textAlign: "center" }}>
                  Licensed Group Entities ({activeNetwork.sharedLicenses.length})
                </div>
                <div className="network-branch-row">
                  {activeNetwork.sharedLicenses.map((lic, i) => (
                    <div key={i} className="network-node-card">
                      <ShieldCheck size={18} color={C.verified} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-paper)", wordBreak: "break-word" }}>{lic.name}</div>
                        <div style={{ fontSize: 11, color: C.verified, fontFamily: "'IBM Plex Mono', monospace" }}>{lic.reg} • {lic.status}</div>
                      </div>
                    </div>
                  ))}
                  {activeNetwork.sharedLicenses.length === 0 && (
                    <div style={{ padding: 14, textAlign: "center", color: C.alert, fontSize: 13, background: "rgba(255,65,54,0.08)", borderRadius: 10, border: "1px dashed rgba(255,65,54,0.3)" }}>
                      ❌ No verifiable licensed operating entities discovered under this group.
                    </div>
                  )}
                </div>
              </div>

              {/* Connecting line */}
              <div style={{ width: 2, height: 24, background: "var(--c-line-strong)" }} />

              {/* Level 3: White Label & Affiliates */}
              <div style={{ width: "100%" }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", marginBottom: 10, textAlign: "center" }}>
                  White-Label Subsidiaries & Operating Brands ({activeNetwork.whiteLabels.length})
                </div>
                <div className="network-branch-row">
                  {activeNetwork.whiteLabels.map((wl, i) => (
                    <div key={i} className="network-node-card">
                      <Layers size={18} color={wl.status === "Pirated" ? C.alert : C.amber} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-paper)" }}>{wl.name}</div>
                        <div style={{ fontSize: 11, color: C.paperDim }}>{wl.platform} • {wl.jurisdiction}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custodian Segregation Bank */}
              <div style={{ width: "100%", marginTop: 8 }}>
                <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(0, 230, 118, 0.05)", border: "1px solid rgba(0, 230, 118, 0.2)", display: "flex", alignItems: "center", gap: 12 }}>
                  <ShieldCheck size={20} color={C.verified} />
                  <div>
                    <span style={{ fontSize: 10, color: C.verified, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>Segregated Custodian Tier-1 Bank</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-paper)" }}>{activeNetwork.custodianBank}</div>
                  </div>
                </div>
              </div>

              {/* Level 4: Clone & Impersonator Detection Zone */}
              {activeNetwork.cloneAlerts.length > 0 && (
                <div style={{ width: "100%", marginTop: 14 }}>
                  <div style={{ padding: "16px 20px", borderRadius: 14, background: "linear-gradient(135deg, rgba(255,65,54,0.12) 0%, rgba(10,10,24,0.9) 100%)", border: "1px solid rgba(255,65,54,0.4)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.alert, marginBottom: 12 }}>
                      <AlertOctagon size={18} />
                      <strong style={{ fontSize: 14 }}>Detected Clone Syndicate Domains ({activeNetwork.cloneAlerts.length})</strong>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {activeNetwork.cloneAlerts.map((cl, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,65,54,0.2)" }}>
                          <div>
                            <div style={{ fontSize: 13, color: "#ff8a80", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>🚫 {cl.domain}</div>
                            <div style={{ fontSize: 11, color: C.muted }}>Detected: {cl.detected}</div>
                          </div>
                          <span style={{ fontSize: 11, color: C.alert, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(255,65,54,0.15)" }}>
                            {cl.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contagion Assessment & Audit Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Contagion Score Card */}
            <div style={{ background: "var(--gradient-card)", border: "1px solid var(--c-line)", borderRadius: 18, padding: 26, boxShadow: "var(--shadow-md)" }}>
              <span style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Systemic Risk Assessment</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "10px 0 6px" }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 44, fontWeight: 800, color: activeNetwork.contagionScore >= 8 ? C.verified : activeNetwork.contagionScore >= 5 ? C.amber : C.alert }}>
                  {activeNetwork.contagionScore}
                </div>
                <span style={{ fontSize: 16, color: C.muted }}>/ 10</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: activeNetwork.contagionScore >= 8 ? C.verified : activeNetwork.contagionScore >= 5 ? C.amber : C.alert, marginBottom: 12 }}>
                {activeNetwork.contagionRisk}
              </div>
              <p style={{ fontSize: 13, color: C.paperDim, lineHeight: 1.6 }}>
                {activeNetwork.contagionScore >= 8
                  ? "Corporate structure shows clear segregation of client funds across tier-1 credit institutions. Independent regulatory checks confirm active licenses in all operational regions."
                  : activeNetwork.contagionScore >= 5
                  ? "Elevated contagion risk due to offshore license routing and shared white-label liquidity pools. Trader dispute arbitration could face cross-border delays."
                  : "Critical systemic alert: Corporate entity exhibits hallmarks of an unregulated shell network. Evidence suggests cloned domains and lack of fund segregation."}
              </p>

              {matchingBroker && (
                <Button onClick={() => openDetail(matchingBroker)} style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
                  <ShieldCheck size={15} /> Inspect Full Broker Dossier
                </Button>
              )}
            </div>

            {/* Quick Audit Snapshot */}
            <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)", borderRadius: 16, padding: 22 }}>
              <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, marginBottom: 14 }}>Ownership Verification Ledger</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--c-line)", paddingBottom: 8 }}>
                  <span style={{ color: C.muted }}>Parent Entity:</span>
                  <strong style={{ color: "var(--c-paper)" }}>{activeNetwork.parentCompany}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--c-line)", paddingBottom: 8 }}>
                  <span style={{ color: C.muted }}>Primary Jurisdiction:</span>
                  <span>{activeNetwork.jurisdiction}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--c-line)", paddingBottom: 8 }}>
                  <span style={{ color: C.muted }}>Corporate Registration:</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{activeNetwork.regNo}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.muted }}>Clone Threat Level:</span>
                  <span style={{ color: activeNetwork.cloneAlerts.length > 0 ? C.alert : C.verified, fontWeight: 700 }}>
                    {activeNetwork.cloneAlerts.length > 0 ? "High Exposure" : "Zero Detected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Clone Modal */}
      {reportCloneModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 20 }}>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-line-strong)", borderRadius: 18, padding: 32, maxWidth: 480, width: "100%", boxShadow: "var(--shadow-lg)", position: "relative" }}>
            <button
              type="button"
              onClick={() => setReportCloneModal(false)}
              style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}
            >
              ×
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.alert, marginBottom: 12 }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, margin: 0 }}>Report Impersonator / Clone URL</h3>
            </div>
            <p style={{ color: C.paperDim, fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
              Submit suspected clone domains mimicking licensed brokers. Ledger cyber-investigators verify DNS records, registrar WHOIS, and dispatch automated warnings to global regulators.
            </p>

            {reportSuccess ? (
              <div style={{ padding: 18, background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.3)", borderRadius: 10, color: C.verified, textAlign: "center", fontSize: 14, fontWeight: 600 }}>
                ✅ Clone report received. Case assigned to Ledger Threat Radar.
              </div>
            ) : (
              <form onSubmit={handleReportClone}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
                    Suspected Clone URL / Domain
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. fake-broker-trade.net"
                    value={reportedDomain}
                    onChange={(e) => setReportedDomain(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 14 }}
                  />
                </div>
                <Button type="submit" style={{ width: "100%", justifyContent: "center", padding: 12 }}>
                  Submit Domain for Investigation
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   TRADER RIGHTS PROTECTION & FUND RECOVERY CENTER
--------------------------------------------------------- */
function RightsProtectionPage({ cases: propCases, brokers, onFileClaim }) {
  const [cases, setCases] = useState(propCases || initialProtectionCases);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState("");

  // Form State
  const [formBroker, setFormBroker] = useState(brokers?.[0]?.name || "Solaris Prime");
  const [formClaimant, setFormClaimant] = useState("");
  const [formCategory, setFormCategory] = useState("Delayed Principal Withdrawal");
  const [formAmount, setFormAmount] = useState("");
  const [formAccountNo, setFormAccountNo] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formEmail, setFormEmail] = useState("");

  const filteredCases = useMemo(() => {
    if (filter === "resolved") return cases.filter(c => c.stage === 4);
    if (filter === "mediation") return cases.filter(c => c.stage < 4 && c.status.toLowerCase().includes("mediation"));
    if (filter === "evading") return cases.filter(c => c.status.toLowerCase().includes("evading") || c.status.toLowerCase().includes("flagged"));
    return cases;
  }, [cases, filter]);

  const totalClaimed = useMemo(() => cases.reduce((sum, c) => sum + (c.amountClaimed || 0), 0), [cases]);
  const totalRecovered = useMemo(() => cases.reduce((sum, c) => sum + (c.amountRecovered || 0), 0), [cases]);

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (!formAmount) return;

    const newClaim = {
      brokerName: formBroker,
      claimant: formClaimant ? `${formClaimant.split(" ")[0]} ${formClaimant.split(" ")[1]?.[0] || ""}.` : "Anonymous Trader",
      category: formCategory,
      amountClaimed: Number(formAmount),
      auditNotes: `Account #${formAccountNo || "Unspecified"}: ${formNotes || "Claim submitted with supporting trading logs."}`
    };

    if (onFileClaim) {
      onFileClaim(newClaim);
    }

    const assignedId = `LRP-${Math.floor(2000 + Math.random() * 8000)}`;
    const createdCase = {
      id: assignedId,
      brokerName: formBroker,
      claimant: newClaim.claimant,
      category: formCategory,
      amountClaimed: Number(formAmount),
      amountRecovered: 0,
      stage: 1,
      status: "In Evidentiary Review",
      date: new Date().toISOString().slice(0, 10),
      auditNotes: newClaim.auditNotes
    };

    setCases([createdCase, ...cases]);
    setClaimSuccessMsg(`Claim successfully filed under Case Reference #${assignedId}.`);

    setTimeout(() => {
      setModalOpen(false);
      setClaimSuccessMsg("");
      setFormAmount("");
      setFormNotes("");
      setFormAccountNo("");
    }, 2500);
  };

  return (
    <div className="page-container" style={{ maxWidth: 1260, margin: "0 auto", padding: "50px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: 36 }}>
        <div>
          <Badge tone="reg">🛡️ 1-on-1 Dispute Mediation Desk</Badge>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 5vw, 42px)", marginTop: 10, marginBottom: 10 }}>
            Trader Rights Protection & Recovery
          </h1>
          <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 740, lineHeight: 1.6 }}>
            Ledger provides professional mediation for retail and institutional traders experiencing blocked withdrawals, artificial slippage, or arbitrary balance cancellation.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} style={{ padding: "14px 24px", fontSize: 15, fontWeight: 700 }}>
          <ShieldAlert size={18} /> File Rights Protection Claim
        </Button>
      </div>

      {/* KPI Stats Banner */}
      <div className="protection-kpi-banner">
        <div className="protection-kpi-card">
          <span style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Total Capital Recovered</span>
          <div className="protection-kpi-val" style={{ color: C.verified }}>$1,482,900+</div>
          <span style={{ fontSize: 12, color: C.verified, display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingUp size={14} /> 100% Direct to Trader
          </span>
        </div>
        <div className="protection-kpi-card">
          <span style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Successfully Settled</span>
          <div className="protection-kpi-val" style={{ color: "var(--c-paper)" }}>184 Cases</div>
          <span style={{ fontSize: 12, color: C.muted }}>91.4% Resolution Success</span>
        </div>
        <div className="protection-kpi-card">
          <span style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Active in Mediation</span>
          <div className="protection-kpi-val" style={{ color: C.amber }}>32 Claims</div>
          <span style={{ fontSize: 12, color: C.amber }}>In Formal Legal Dialogue</span>
        </div>
        <div className="protection-kpi-card">
          <span style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Avg Resolution Window</span>
          <div className="protection-kpi-val" style={{ color: C.blue }}>14 Days</div>
          <span style={{ fontSize: 12, color: C.muted }}>From Evidentiary Intake</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 24, borderBottom: "1px solid var(--c-line)", paddingBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "all", label: `All Claims (${cases.length})` },
            { id: "resolved", label: "Resolved & Restituted" },
            { id: "mediation", label: "In Active Mediation" },
            { id: "evading", label: "Evading / Flagged" }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid",
                borderColor: filter === t.id ? "var(--c-verified)" : "var(--c-line)",
                background: filter === t.id ? "var(--c-verified-dim)" : "var(--c-surface-hi)",
                color: filter === t.id ? "var(--c-verified)" : "var(--c-paper-dim)",
                transition: "all 0.2s ease"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>
          AUDIT ID: LEDGER-RESTITUTION-DESK-2026
        </span>
      </div>

      {/* Case Pipeline Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {filteredCases.map(c => {
          const isResolved = c.stage === 4;
          const isAlert = c.status.toLowerCase().includes("evading");

          return (
            <div key={c.id} className="case-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "var(--c-paper)", fontFamily: "'IBM Plex Mono', monospace" }}>
                      {c.id}
                    </span>
                    <Badge tone={isResolved ? "reg" : isAlert ? "warn" : "pending"}>{c.status}</Badge>
                    <span style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{c.date}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, margin: "4px 0" }}>
                    {c.brokerName} — <span style={{ color: "var(--c-paper-dim)", fontWeight: 500 }}>{c.category}</span>
                  </h3>
                  <div style={{ fontSize: 13, color: C.muted }}>Claimant: <strong style={{ color: "var(--c-paper)" }}>{c.claimant}</strong></div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Disputed Amount</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "var(--c-paper)" }}>
                    ${c.amountClaimed.toLocaleString()} USD
                  </div>
                  {c.amountRecovered > 0 && (
                    <div style={{ fontSize: 12, color: C.verified, fontWeight: 700 }}>
                      ✓ Recovered: ${c.amountRecovered.toLocaleString()} USD
                    </div>
                  )}
                </div>
              </div>

              {/* 4-Stage Progress Stepper */}
              <div className="stage-step-bar">
                {[
                  { step: 1, label: "Evidence Audit" },
                  { step: 2, label: "Tick-Data Verification" },
                  { step: 3, label: "Broker Formal Notice" },
                  { step: 4, label: "Restitution Settlement" }
                ].map(st => {
                  const isDone = c.stage >= st.step;
                  const isCurrent = c.stage === st.step;
                  return (
                    <div key={st.step} style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                      <div className={`stage-step-dot ${isAlert ? "alert" : isDone ? "active" : ""}`} />
                      <span style={{ fontSize: 11, color: isCurrent ? "var(--c-paper)" : isDone ? C.verified : C.muted, fontWeight: isCurrent ? 700 : 500 }}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: 13, color: C.paperDim, lineHeight: 1.5, background: "rgba(255,255,255,0.02)", padding: "10px 14px", borderRadius: 8, borderLeft: `3px solid ${isResolved ? C.verified : isAlert ? C.alert : C.amber}` }}>
                <strong style={{ color: "var(--c-paper)" }}>Mediation Log: </strong>{c.auditNotes}
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Submission Wizard Modal */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 20 }}>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-line-strong)", borderRadius: 20, padding: 32, maxWidth: 560, width: "100%", boxShadow: "var(--shadow-lg)", position: "relative" }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 22 }}
            >
              ×
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.verified, marginBottom: 8 }}>
              <ShieldCheck size={26} />
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, margin: 0 }}>Initiate 1-on-1 Rights Protection</h3>
            </div>
            <p style={{ color: C.paperDim, fontSize: 13.5, lineHeight: 1.5, marginBottom: 20 }}>
              Submit your dispute details and trade logs. The Ledger mediation team formally reviews broker liquidity providers and regulatory terms to secure restitution.
            </p>

            {claimSuccessMsg ? (
              <div style={{ padding: 24, background: "rgba(0,230,118,0.12)", border: "1px solid rgba(0,230,118,0.4)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.verified, marginBottom: 6 }}>Claim Intake Confirmed</div>
                <p style={{ fontSize: 13, color: C.paperDim }}>{claimSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitClaim} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Target Broker</label>
                    <select
                      value={formBroker}
                      onChange={(e) => setFormBroker(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 13.5 }}
                    >
                      {brokers?.map(b => (
                        <option key={b.id || b.name} value={b.name} style={{ background: "#0a0a18" }}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Claimant Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. David Miller"
                      value={formClaimant}
                      onChange={(e) => setFormClaimant(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Incident Type</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 13.5 }}
                    >
                      <option value="Delayed Principal Withdrawal" style={{ background: "#0a0a18" }}>Delayed Principal Withdrawal</option>
                      <option value="Execution Slippage Manipulation" style={{ background: "#0a0a18" }}>Execution Slippage Manipulation</option>
                      <option value="Arbitrary Balance Deduction" style={{ background: "#0a0a18" }}>Arbitrary Balance Deduction</option>
                      <option value="Account Lockout / Unresponsive" style={{ background: "#0a0a18" }}>Account Lockout / Unresponsive</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Disputed USD ($)</label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 5000"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>MT4/MT5 Account ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 8810294"
                      value={formAccountNo}
                      onChange={(e) => setFormAccountNo(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 13.5 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Confidential Email</label>
                    <input
                      required
                      type="email"
                      placeholder="trader@domain.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Evidentiary Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Describe dates, order tickets, withdrawal requests, and broker communication logs..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 13.5, resize: "vertical" }}
                  />
                </div>

                <Button type="submit" style={{ width: "100%", justifyContent: "center", padding: "13px 16px", marginTop: 6 }}>
                  Submit Claim to Mediation Desk
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   FOREX REBATE & VOLUME CASHBACK OPTIMIZER (WIKIFX-INSPIRED)
--------------------------------------------------------- */
function RebatePage({ rebates: propRebates }) {
  const rebates = propRebates || initialRebates;
  const [selectedRebateId, setSelectedRebateId] = useState(rebates[0]?.id || "reb-1");
  const [lotsPerMonth, setLotsPerMonth] = useState(50);
  const [selectedPair, setSelectedPair] = useState("EUR/USD");
  const [claimModal, setClaimModal] = useState(null);
  const [claimedSuccess, setClaimedSuccess] = useState(false);

  const activeRebate = rebates.find(r => r.id === selectedRebateId) || rebates[0];

  // Pair pip values & estimated baseline spread
  const pairMeta = {
    "EUR/USD": { spreadPips: 0.8, pipValue: 10 },
    "GBP/USD": { spreadPips: 1.1, pipValue: 10 },
    "USD/JPY": { spreadPips: 1.0, pipValue: 9.2 },
    "XAU/USD (Gold)": { spreadPips: 2.2, pipValue: 100 },
    "BTC/USD": { spreadPips: 15.0, pipValue: 1 }
  };

  const currentPairMeta = pairMeta[selectedPair] || pairMeta["EUR/USD"];

  // Calculations
  const monthlyRebateCash = lotsPerMonth * activeRebate.rebatePerLot;
  const annualRebateCash = monthlyRebateCash * 12;
  const standardSpreadCost = lotsPerMonth * currentPairMeta.pipValue * currentPairMeta.spreadPips;
  const netEffectiveSpreadPips = Math.max(0.1, currentPairMeta.spreadPips - (activeRebate.rebatePerLot / currentPairMeta.pipValue)).toFixed(2);
  const costReductionPercent = ((monthlyRebateCash / standardSpreadCost) * 100).toFixed(0);

  const handleActivateRebate = (e) => {
    e.preventDefault();
    setClaimedSuccess(true);
    setTimeout(() => {
      setClaimModal(null);
      setClaimedSuccess(false);
    }, 2400);
  };

  return (
    <div className="page-container" style={{ maxWidth: 1260, margin: "0 auto", padding: "50px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <Badge tone="reg">💰 Volume Trading Cost Optimizer</Badge>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 5vw, 42px)", marginTop: 10, marginBottom: 10 }}>
          Forex Rebate & Volume Cashback
        </h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 740, lineHeight: 1.6 }}>
          Automatically receive cash rebates on every lot traded, directly into your MT4/MT5 account or bank balance. Zero spread markups, institutional volume deals verified by Ledger.
        </p>
      </div>

      {/* Interactive Rebate Calculator Hero */}
      <div className="rebate-calc-hero">
        <div>
          <span style={{ fontSize: 11, color: C.verified, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>
            Interactive Cashback Simulator
          </span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, margin: "6px 0 20px" }}>
            Calculate Your Trading Rebates
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
                Select Broker
              </label>
              <select
                value={selectedRebateId}
                onChange={(e) => setSelectedRebateId(e.target.value)}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 14 }}
              >
                {rebates.map(r => (
                  <option key={r.id} value={r.id} style={{ background: "#0a0a18" }}>
                    {r.brokerName} (${r.rebatePerLot.toFixed(2)}/lot)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
                Trading Instrument
              </label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 14 }}
              >
                {Object.keys(pairMeta).map(pair => (
                  <option key={pair} value={pair} style={{ background: "#0a0a18" }}>{pair}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Slider */}
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "18px 20px", borderRadius: 12, border: "1px solid var(--c-line)", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--c-paper)", fontWeight: 600 }}>Monthly Volume Traded:</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.verified, fontFamily: "'IBM Plex Mono', monospace" }}>
                {lotsPerMonth} Round Lots
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="500"
              value={lotsPerMonth}
              onChange={(e) => setLotsPerMonth(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--c-verified)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
              <span>1 Lot (Retail)</span>
              <span>100 Lots (Active)</span>
              <span>500 Lots (Pro / VIP)</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--c-surface-hi)", border: "1px solid var(--c-line)" }}>
              <span style={{ fontSize: 11, color: C.muted }}>Net Effective Spread</span>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--c-paper)", marginTop: 2 }}>
                {netEffectiveSpreadPips} pips
              </div>
              <span style={{ fontSize: 11, color: C.verified }}>reduced from {currentPairMeta.spreadPips} pips</span>
            </div>
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--c-surface-hi)", border: "1px solid var(--c-line)" }}>
              <span style={{ fontSize: 11, color: C.muted }}>Trading Cost Saved</span>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.verified, marginTop: 2 }}>
                {costReductionPercent}% Rebated
              </div>
              <span style={{ fontSize: 11, color: C.muted }}>credited automatically</span>
            </div>
          </div>
        </div>

        {/* Output Hero Counter Box */}
        <div className="rebate-summary-box">
          <span style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
            Estimated Monthly Cashback
          </span>
          <div className="rebate-summary-amount">
            ${monthlyRebateCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: 13, color: C.paperDim }}>
            Annual Projected Return: <strong style={{ color: C.verified }}>${annualRebateCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </span>

          <div style={{ marginTop: 24 }}>
            <Button
              onClick={() => setClaimModal(activeRebate)}
              style={{ width: "100%", justifyContent: "center", padding: "14px 20px", fontSize: 15, fontWeight: 700 }}
            >
              <Coins size={16} /> Activate {activeRebate.brokerName} Rebate
            </Button>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
            Payout: {activeRebate.payoutFreq} • {activeRebate.depositBonus}
          </div>
        </div>
      </div>

      {/* Verified Broker Rebate Directory */}
      <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-line-strong)", borderRadius: 18, padding: "26px 28px", boxShadow: "var(--shadow-md)", marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, margin: 0 }}>
              Verified Institutional Broker Rebate Rates
            </h3>
            <p style={{ color: C.paperDim, fontSize: 13.5, margin: "4px 0 0" }}>
              All programs verified with direct broker liquidity agreements. Payouts processed automatically.
            </p>
          </div>
          <Badge tone="reg">100% Zero Markup Guaranteed</Badge>
        </div>

        <div style={{ overflowX: "auto" }}>
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.2fr", padding: "12px 18px", borderBottom: "1px solid var(--c-line-strong)", color: C.muted, fontSize: 11, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
            <span>Broker & Tier</span>
            <span>Raw Spread</span>
            <span>Rebate / Lot</span>
            <span>Payout Frequency</span>
            <span style={{ textAlign: "right" }}>Action</span>
          </div>

          {/* Rows */}
          {rebates.map(r => (
            <div key={r.id} className="rebate-table-row">
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--c-paper)" }}>{r.brokerName}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{r.regulator} • {r.accountType}</div>
              </div>
              <div>
                <span style={{ fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", color: "var(--c-paper)" }}>{r.rawSpread}</span>
              </div>
              <div>
                <span style={{ fontSize: 15, fontWeight: 800, color: C.verified, fontFamily: "'IBM Plex Mono', monospace" }}>
                  ${r.rebatePerLot.toFixed(2)}
                </span>
                <span style={{ fontSize: 11, color: C.muted }}> / lot</span>
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.paperDim }}>{r.payoutFreq}</span>
                <div style={{ fontSize: 10, color: C.verified }}>{r.depositBonus}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Button onClick={() => setClaimModal(r)} style={{ padding: "8px 14px", fontSize: 12 }}>
                  Activate Rebate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How Forex Rebates Work */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {[
          {
            icon: "🤝",
            title: "Institutional Volume Sharing",
            desc: "Brokers pay high-volume partner commissions. Ledger returns up to 90% directly to you as a trader rebate, lowering your effective trading costs."
          },
          {
            icon: "🔒",
            title: "Zero Spread Markup Guarantee",
            desc: "Your trading accounts, raw spreads, commissions, and execution speeds remain 100% identical to registering directly with the broker."
          },
          {
            icon: "⚡",
            title: "Automated Daily Cash Payouts",
            desc: "Rebates automatically deposit back into your MT4/MT5 trading account, USDT crypto wallet, or bank account on daily/weekly schedules."
          }
        ].map((feat, i) => (
          <div key={i} style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{feat.icon}</div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, marginBottom: 8 }}>{feat.title}</h4>
            <p style={{ color: C.paperDim, fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Activate Rebate Modal */}
      {claimModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 20 }}>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-line-strong)", borderRadius: 20, padding: 32, maxWidth: 480, width: "100%", boxShadow: "var(--shadow-lg)", position: "relative" }}>
            <button
              type="button"
              onClick={() => setClaimModal(null)}
              style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 22 }}
            >
              ×
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.verified, marginBottom: 8 }}>
              <Coins size={24} />
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, margin: 0 }}>Activate {claimModal.brokerName} Rebate</h3>
            </div>
            <p style={{ color: C.paperDim, fontSize: 13.5, lineHeight: 1.5, marginBottom: 20 }}>
              Receive <strong style={{ color: C.verified }}>${claimModal.rebatePerLot.toFixed(2)}/lot</strong> cash rebate automatically on every round turn trade.
            </p>

            {claimedSuccess ? (
              <div style={{ padding: 22, background: "rgba(0,230,118,0.12)", border: "1px solid rgba(0,230,118,0.4)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.verified, marginBottom: 6 }}>Rebate Link Configured</div>
                <p style={{ fontSize: 13, color: C.paperDim }}>Your trading account is now enrolled in the ${claimModal.rebatePerLot.toFixed(2)}/lot cashback program.</p>
              </div>
            ) : (
              <form onSubmit={handleActivateRebate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Existing or New MT4/MT5 Account Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 9920148 (or 'New Account')"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Notification Email</label>
                  <input
                    required
                    type="email"
                    placeholder="trader@domain.com"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: C.muted, textTransform: "uppercase", marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>Rebate Payout Method</label>
                  <select style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid var(--c-line)", background: "var(--input-bg)", color: "var(--c-paper)", fontSize: 14 }}>
                    <option style={{ background: "#0a0a18" }}>Credit Directly to MT4/MT5 Balance (Daily)</option>
                    <option style={{ background: "#0a0a18" }}>USDT TRC20 / ERC20 Crypto Wallet</option>
                    <option style={{ background: "#0a0a18" }}>Bank Wire Transfer (Monthly)</option>
                  </select>
                </div>
                <Button type="submit" style={{ width: "100%", justifyContent: "center", padding: "13px 16px", marginTop: 6 }}>
                  Confirm & Bind Rebate Account
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
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
    <div className="page-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Badge tone="reg">💬 Trader Community</Badge>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 5vw, 40px)", marginTop: 10, marginBottom: 10 }}>Community Forum</h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 600 }}>Discuss brokers, share experiences, report suspicious activity, and learn from the community.</p>
      </div>

      {/* Stats */}
      <div className="stats-four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
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
          <div key={post.id} className="forum-post-card" style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 14, padding: "24px 28px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start", transition: "all 0.2s", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.verified + "44"; e.currentTarget.style.transform = "translateX(4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.lineStrong; e.currentTarget.style.transform = "translateX(0)"; }}>

            {/* Upvote */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <button onClick={() => setVotes(v => ({ ...v, [post.id]: v[post.id] + 1 }))} style={{ background: "rgba(0,230,118,0.1)", border: `1px solid ${C.verified}33`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: C.verified, fontSize: 16, transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,230,118,0.2)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(0,230,118,0.1)"}>▲</button>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{votes[post.id]}</span>
            </div>

            {/* Content */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 4, background: `${categoryColor[post.category] || C.verified}18`, color: categoryColor[post.category] || C.verified, fontWeight: 600 }}>{post.category}</span>
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, marginBottom: 8, lineHeight: 1.3, wordBreak: "break-word" }}>{post.title}</h3>
              <p style={{ color: C.paperDim, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{post.body.slice(0, 120)}...</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: C.muted, flexWrap: "wrap" }}>
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
    <div className="page-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Badge tone="reg">🧮 Trading Tools</Badge>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(28px, 5vw, 40px)", marginTop: 10, marginBottom: 10 }}>Spread Cost Calculator</h1>
        <p style={{ color: C.paperDim, fontSize: 15, maxWidth: 600 }}>Calculate the true cost of trading spreads before you open a position. Compare costs across different brokers and instruments.</p>
      </div>

      <div className="calc-layout" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
        {/* Controls */}
        <div style={{ background: C.surface, border: `1px solid ${C.lineStrong}`, borderRadius: 16, padding: 28, position: "sticky", top: 90, height: "fit-content" }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, marginBottom: 20 }}>Configure Trade</h3>
          
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

        {/* Results Table with Horizontal Touch Scroll */}
        <div className="tab-scroll-wrap" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ minWidth: 480, display: "flex", flexDirection: "column", gap: 2 }}>
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
  const VALID_VIEWS = [
    "home", "brokers", "market", "rankings", "exposure", "news",
    "education", "tools", "media", "regulators", "scam-alerts",
    "field-survey", "forum", "calculator", "admin",
    "network", "protection", "rebates"
  ];

  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
    if (VALID_VIEWS.includes(hash)) {
      return hash;
    }
    const saved = localStorage.getItem("ledger_current_view");
    if (saved && VALID_VIEWS.includes(saved)) {
      return saved;
    }
    return "home";
  });
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
  const [networks, setNetworks] = useState(initialNetworks);
  const [protectionCases, setProtectionCases] = useState(initialProtectionCases);
  const [rebates, setRebates] = useState(initialRebates);
  const [selected, setSelected] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(() => {
    return localStorage.getItem("ledger_admin_authed") === "true";
  });
  const [adminUser, setAdminUser] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState("");

  useEffect(() => {
    localStorage.setItem("ledger_current_view", view);
    const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
    if (hash !== view) {
      window.location.hash = view;
    }
  }, [view]);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
      if (VALID_VIEWS.includes(hash)) {
        setView(hash);
      }
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (adminAuthed) {
      localStorage.setItem("ledger_admin_authed", "true");
    } else {
      localStorage.removeItem("ledger_admin_authed");
    }
  }, [adminAuthed]);

  function handleLogout() {
    setAdminAuthed(false);
    setAdminPasscode("");
    setAdminLoginError("");
    localStorage.removeItem("ledger_admin_authed");
    localStorage.setItem("ledger_current_view", "admin");
    window.location.hash = "admin";
    setView("admin");
  }

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

  function handleAddProtectionClaim(claim) {
    const assignedId = `LRP-${Math.floor(2000 + Math.random() * 8000)}`;
    const newCase = {
      id: assignedId,
      brokerName: claim.brokerName,
      claimant: claim.claimant || "Verified Trader",
      category: claim.category,
      amountClaimed: Number(claim.amountClaimed) || 0,
      amountRecovered: 0,
      stage: 1,
      status: "In Evidentiary Review",
      date: new Date().toISOString().slice(0, 10),
      auditNotes: claim.auditNotes || "Claim filed by trader. Ledger triage team initiated formal evidence audit."
    };
    setProtectionCases(prev => [newCase, ...prev]);
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
      localStorage.setItem("ledger_admin_authed", "true");
      setAdminLoginError("");
      return;
    }
    setAdminLoginError("Access denied. Check your administrator ID and password.");
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "var(--font-sans, 'Inter', -apple-system, sans-serif)", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        h1, h2, h3, h4, h5, h6 { font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif); letter-spacing: -0.025em; }
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
        onLogout={handleLogout}
        brokers={brokers}
        setBrokerSearch={setBrokerSearch}
        openDetail={setSelected}
      />

      {view !== "admin" && <TickerTape pairs={marketPairs} />}

      {view === "home" && <div className="view-transition-wrap"><Home brokers={brokers} exposures={exposures} setView={setView} openDetail={setSelected} toggleCompare={toggleCompare} compareList={compareList} isLight={isLight} setBrokerSearch={setBrokerSearch} /></div>}
      {view === "brokers" && <div className="view-transition-wrap"><BrokersPage brokers={brokers} openDetail={setSelected} toggleCompare={toggleCompare} compareList={compareList} initialQuery={brokerSearch} /></div>}
      {view === "market" && <div className="view-transition-wrap"><MarketPage /></div>}
      {view === "rankings" && <div className="view-transition-wrap"><LeaderboardPage brokers={brokers} /></div>}
      {view === "exposure" && <div className="view-transition-wrap"><ExposurePage exposures={exposures} brokers={brokers} onSubmitReport={handleAddExposure} /></div>}
      {view === "news" && (
        <div className="view-transition-wrap" style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, marginBottom: 24 }}>Dispatches & Intelligence</h1>
          {news.map(n => (
            <div key={n.id} style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 24, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <Badge tone="reg">{n.category}</Badge>
                <span style={{ fontSize: 12, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{n.date}</span>
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, marginBottom: 6 }}>{n.title}</h3>
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
      {view === "network" && <div className="view-transition-wrap"><RelationshipNetworkPage networks={networks} brokers={brokers} openDetail={setSelected} /></div>}
      {view === "protection" && <div className="view-transition-wrap"><RightsProtectionPage cases={protectionCases} brokers={brokers} onFileClaim={handleAddProtectionClaim} /></div>}
      {view === "rebates" && <div className="view-transition-wrap"><RebatePage rebates={rebates} /></div>}
      {view === "admin" && (
        adminAuthed ? (
          <div className="view-transition-wrap"><AdminPanel brokers={brokers} setBrokers={setBrokers} exposures={exposures} setExposures={setExposures} news={news} setNews={setNews} alerts={alerts} setAlerts={setAlerts} surveys={surveys} setSurveys={setSurveys} onLogout={handleLogout} /></div>
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
