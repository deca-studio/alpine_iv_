import { useState, useMemo, useEffect, createContext, useContext } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart, ReferenceLine,
} from "recharts";

const MONTH_LABELS = ["Jan/25","Fev/25","Mar/25","Abr/25","Mai/25","Jun/25","Jul/25","Ago/25","Set/25","Out/25","Nov/25","Dez/25","Jan/26","Fev/26"];

const rawData = [
  { month: "Jan/2025", idx: 0, saldoAnterior: 30342.28, receitas: 12165.47, despesas: 8689.71, saldoFinal: 33818.04,
    taxaCond: 10085, juros: 6.01, multas: 36, tarifaBanc: 2.70, rendInvest: 290.62, acordo: 1745.14, taxaMudanca: 0, honorCob: 0,
    salario: 1827.88, ferias: 0, decTerceiro: 0, inssFolha: 733.33, fgtsFolha: 0,
    energia: 827.04, agua: 2258.12, gas: 0, telefone: 38.63, internet: 130.17,
    manutencao: 754.53, administrativas: 2000.01, terceirizacao: 0, investimentos: 0, controleAcesso: 0,
    pessoal: 2681.21, tarifasPublicas: 3253.96 },
  { month: "Fev/2025", idx: 1, saldoAnterior: 33818.04, receitas: 11155.77, despesas: 10951.91, saldoFinal: 34021.90,
    taxaCond: 9523.23, juros: 8.55, multas: 19.21, tarifaBanc: 0.22, rendInvest: 297.92, acordo: 1052.31, taxaMudanca: 180, honorCob: 74.33,
    salario: 1827.88, ferias: 0, decTerceiro: 0, inssFolha: 0, fgtsFolha: 0,
    energia: 767.67, agua: 2258.12, gas: 2125.16, telefone: 38.63, internet: 130.17,
    manutencao: 823.10, administrativas: 2981.18, terceirizacao: 0, investimentos: 0, controleAcesso: 0,
    pessoal: 1827.88, tarifasPublicas: 5319.75 },
  { month: "Mar/2025", idx: 2, saldoAnterior: 34021.90, receitas: 10993.55, despesas: 9922.76, saldoFinal: 35092.69,
    taxaCond: 9900, juros: 36.85, multas: 63.11, tarifaBanc: -139.80, rendInvest: 274.12, acordo: 716.98, taxaMudanca: 0, honorCob: 138.37,
    salario: 1829.47, ferias: 2066.34, decTerceiro: 0, inssFolha: 1146.01, fgtsFolha: 134.74,
    energia: 759.66, agua: 2258.12, gas: 0, telefone: 38.63, internet: 130.17,
    manutencao: 421.80, administrativas: 1137.82, terceirizacao: 0, investimentos: 0, controleAcesso: 0,
    pessoal: 5176.56, tarifasPublicas: 3186.58 },
  { month: "Abr/2025", idx: 3, saldoAnterior: 35092.69, receitas: 11542.32, despesas: 14215.43, saldoFinal: 32419.58,
    taxaCond: 9540, juros: 36.49, multas: 51.89, tarifaBanc: -144.80, rendInvest: 330.08, acordo: 1333.14, taxaMudanca: 180, honorCob: 215.52,
    salario: 680.95, ferias: 0, decTerceiro: 0, inssFolha: 0, fgtsFolha: 0,
    energia: 663.75, agua: 3032.26, gas: 0, telefone: 0, internet: 167.72,
    manutencao: 2660.84, administrativas: 3629.91, terceirizacao: 3380, investimentos: 0, controleAcesso: 0,
    pessoal: 680.95, tarifasPublicas: 3863.73 },
  { month: "Mai/2025", idx: 4, saldoAnterior: 32419.58, receitas: 11025.23, despesas: 19571.54, saldoFinal: 23873.27,
    taxaCond: 10080, juros: 9.72, multas: 33.23, tarifaBanc: -123.08, rendInvest: 342.79, acordo: 358, taxaMudanca: 180, honorCob: 144.57,
    salario: 1800.94, ferias: 0, decTerceiro: 0, inssFolha: 764.86, fgtsFolha: 182.64,
    energia: 673.76, agua: 2258.12, gas: 5153.35, telefone: 0, internet: 168.80,
    manutencao: 2653.15, administrativas: 4570.92, terceirizacao: 0, investimentos: 1345, controleAcesso: 0,
    pessoal: 2748.44, tarifasPublicas: 8254.03 },
  { month: "Jun/2025", idx: 5, saldoAnterior: 23873.27, receitas: 14635.01, despesas: 14906.53, saldoFinal: 23601.75,
    taxaCond: 13556, juros: 8.96, multas: 43.09, tarifaBanc: -142.60, rendInvest: 247.82, acordo: 276.63, taxaMudanca: 540, honorCob: 105.11,
    salario: 1960.91, ferias: 0, decTerceiro: 0, inssFolha: 0, fgtsFolha: 0,
    energia: 782.35, agua: 2258.12, gas: 0, telefone: 0, internet: 168.80,
    manutencao: 5909.40, administrativas: 2351.95, terceirizacao: 0, investimentos: 1345, controleAcesso: 0,
    pessoal: 2090.91, tarifasPublicas: 3209.27 },
  { month: "Jul/2025", idx: 6, saldoAnterior: 23601.75, receitas: 14176.64, despesas: 17258.31, saldoFinal: 20520.08,
    taxaCond: 11788, juros: 12.32, multas: 64.99, tarifaBanc: -144, rendInvest: 303.93, acordo: 1183.32, taxaMudanca: 180, honorCob: 653.08,
    salario: 1960.91, ferias: 0, decTerceiro: 0, inssFolha: 601.85, fgtsFolha: 0,
    energia: 875.50, agua: 2258.12, gas: 2519.64, telefone: 0, internet: 168.92,
    manutencao: 4798.58, administrativas: 2729.79, terceirizacao: 0, investimentos: 1345, controleAcesso: 0,
    pessoal: 2562.76, tarifasPublicas: 5822.18 },
  { month: "Ago/2025", idx: 7, saldoAnterior: 20520.08, receitas: 13448.47, despesas: 15733.09, saldoFinal: 18235.46,
    taxaCond: 12084, juros: 27.50, multas: 65.11, tarifaBanc: -150.90, rendInvest: 235.42, acordo: 575.90, taxaMudanca: 360, honorCob: 115.56,
    salario: 1960.91, ferias: 0, decTerceiro: 0, inssFolha: 1511.81, fgtsFolha: 582.56,
    energia: 959.54, agua: 2258.12, gas: 0, telefone: 0, internet: 163.50,
    manutencao: 3031.01, administrativas: 2639.24, terceirizacao: 0, investimentos: 1345, controleAcesso: 502,
    pessoal: 4834.68, tarifasPublicas: 3381.16 },
  { month: "Set/2025", idx: 8, saldoAnterior: 18235.46, receitas: 12444.77, despesas: 15792.26, saldoFinal: 14887.97,
    taxaCond: 11692, juros: 24.94, multas: 68.78, tarifaBanc: -150, rendInvest: 150, acordo: 477.93, taxaMudanca: 180, honorCob: 0,
    salario: 1960.91, ferias: 0, decTerceiro: 0, inssFolha: 601.85, fgtsFolha: 628.61,
    energia: 1006.17, agua: 2258.12, gas: 2723.85, telefone: 0, internet: 163.50,
    manutencao: 2842.06, administrativas: 2701.19, terceirizacao: 0, investimentos: 0, controleAcesso: 502,
    pessoal: 3595.37, tarifasPublicas: 6151.64 },
  { month: "Out/2025", idx: 9, saldoAnterior: 14887.97, receitas: 12338.49, despesas: 11236.12, saldoFinal: 15990.34,
    taxaCond: 12084, juros: 18.17, multas: 43.37, tarifaBanc: -137.90, rendInvest: 100, acordo: 229.73, taxaMudanca: 0, honorCob: 0,
    salario: 1960.91, ferias: 0, decTerceiro: 0, inssFolha: 601.85, fgtsFolha: 144.84,
    energia: 1092.43, agua: 2258.12, gas: 0, telefone: 0, internet: 163.50,
    manutencao: 2426.33, administrativas: 1956.14, terceirizacao: 0, investimentos: 0, controleAcesso: 502,
    pessoal: 2837.60, tarifasPublicas: 3514.05 },
  { month: "Nov/2025", idx: 10, saldoAnterior: 15990.34, receitas: 12916.57, despesas: 15381.87, saldoFinal: 13525.04,
    taxaCond: 11448, juros: 40.32, multas: 56.89, tarifaBanc: -145.80, rendInvest: 181.82, acordo: 473.94, taxaMudanca: 360, honorCob: 492.41,
    salario: 1960.91, ferias: 0, decTerceiro: 905.29, inssFolha: 601.85, fgtsFolha: 144.84,
    energia: 1020.86, agua: 2774.21, gas: 3238.67, telefone: 0, internet: 164.62,
    manutencao: 1237.51, administrativas: 2058.56, terceirizacao: 0, investimentos: 0, controleAcesso: 502,
    pessoal: 4385.44, tarifasPublicas: 7198.36 },
  { month: "Dez/2025", idx: 11, saldoAnterior: 13525.04, receitas: 16319.05, despesas: 15201.04, saldoFinal: 14643.05,
    taxaCond: 12084, juros: 52.51, multas: 60.33, tarifaBanc: -155.20, rendInvest: 169.29, acordo: 2938.01, taxaMudanca: 180, honorCob: 981.27,
    salario: 1960.91, ferias: 0, decTerceiro: 765.10, inssFolha: 1203.70, fgtsFolha: 217.26,
    energia: 1005.08, agua: 2516.17, gas: 0, telefone: 0, internet: 164.62,
    manutencao: 4752.99, administrativas: 1983.21, terceirizacao: 0, investimentos: 0, controleAcesso: 502,
    pessoal: 4276.97, tarifasPublicas: 3685.87 },
  { month: "Jan/2026", idx: 12, saldoAnterior: 14643.05, receitas: 12250.11, despesas: 13878.13, saldoFinal: 13015.03,
    taxaCond: 11236, juros: 31.20, multas: 32.30, tarifaBanc: -139.90, rendInvest: 143.94, acordo: 610.77, taxaMudanca: 180, honorCob: 106.52,
    salario: 1960.91, ferias: 0, decTerceiro: 0, inssFolha: 601.85, fgtsFolha: 217.26,
    energia: 1162.62, agua: 2391.64, gas: 2424.32, telefone: 39.75, internet: 124.87,
    manutencao: 2672.57, administrativas: 2152.34, terceirizacao: 0, investimentos: 0, controleAcesso: 0,
    pessoal: 2910.02, tarifasPublicas: 6143.20 },
  { month: "Fev/2026", idx: 13, saldoAnterior: 13015.03, receitas: 13210.30, despesas: 10988.19, saldoFinal: 15237.14,
    taxaCond: 11660, juros: 43.83, multas: 79.61, tarifaBanc: -145.50, rendInvest: 108.14, acordo: 901.59, taxaMudanca: 0, honorCob: 558.35,
    salario: 1960.91, ferias: 0, decTerceiro: 0, inssFolha: 600.30, fgtsFolha: 144.84,
    energia: 1360.83, agua: 2391.64, gas: 0, telefone: 0, internet: 164.62,
    manutencao: 2168.38, administrativas: 2066.67, terceirizacao: 0, investimentos: 0, controleAcesso: 0,
    pessoal: 2836.05, tarifasPublicas: 3917.09 },
];

const TOTALS = {
  receitas: 178621.75, despesas: 193726.89, movLiquido: -15105.14,
  taxaCond: 156760.23, pessoal: 43444.84, tarifasPublicas: 66900.87,
  manutencao: 37152.25, administrativas: 34958.93, terceirizacao: 3380,
  investimentos: 5380, controleAcesso: 2510,
};

const fmt  = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtK = (v) => `R$${(v / 1000).toFixed(1)}k`;

// ─── Design System ──────────────────────────────────────────────────────────

const LIGHT = {
  bg:          "#f3f5f9",
  bgStrong:    "#e8edf7",
  surface:     "rgba(255,255,255,0.88)",
  surfaceSolid:"#ffffff",
  text:        "#0f172a",
  textSoft:    "#334155",
  textMuted:   "#64748b",
  textDim:     "#94a3b8",
  line:        "rgba(148,163,184,0.24)",
  lineStrong:  "rgba(148,163,184,0.40)",
  shadowSm:    "0 1px 2px rgba(15,23,42,.04), 0 4px 10px rgba(15,23,42,.04)",
  shadowMd:    "0 12px 28px rgba(15,23,42,.08)",
  shadowLg:    "0 28px 70px rgba(15,23,42,.14)",
  primary:     "#0f1f3d",
  primarySoft: "rgba(15,31,61,.08)",
  primaryGlow: "rgba(30,58,107,.22)",
  gold:        "#c9a24a",
  goldSoft:    "rgba(201,162,74,.12)",
  goldBorder:  "rgba(201,162,74,.28)",
  success:     "#16a34a",
  successSoft: "rgba(22,163,74,.10)",
  danger:      "#dc2626",
  dangerSoft:  "rgba(220,38,38,.10)",
  info:        "#2563eb",
  infoSoft:    "rgba(37,99,235,.10)",
  violet:      "#7c3aed",
  violetSoft:  "rgba(124,58,237,.10)",
  amber:       "#d97706",
  amberSoft:   "rgba(217,119,6,.10)",
  teal:        "#0d9488",
  rose:        "#e11d48",
  indigo:      "#4338ca",
};

const DARK = {
  bg:          "#0A0F1A",
  bgStrong:    "#131B2F",
  surface:     "rgba(15,23,42,0.88)",
  surfaceSolid:"#0f172a",
  text:        "#f8fafc",
  textSoft:    "#cbd5e1",
  textMuted:   "#94a3b8",
  textDim:     "#64748b",
  line:        "rgba(255,255,255,0.12)",
  lineStrong:  "rgba(255,255,255,0.24)",
  shadowSm:    "0 1px 2px rgba(0,0,0,.4), 0 4px 10px rgba(0,0,0,.4)",
  shadowMd:    "0 12px 28px rgba(0,0,0,.5)",
  shadowLg:    "0 28px 70px rgba(0,0,0,.6)",
  primary:     "#93c5fd",
  primarySoft: "rgba(147,197,253,.15)",
  primaryGlow: "rgba(147,197,253,.3)",
  gold:        "#fcd34d",
  goldSoft:    "rgba(252,211,77,.15)",
  goldBorder:  "rgba(252,211,77,.3)",
  success:     "#4ade80",
  successSoft: "rgba(74,222,128,.15)",
  danger:      "#f87171",
  dangerSoft:  "rgba(248,113,113,.15)",
  info:        "#60a5fa",
  infoSoft:    "rgba(96,165,250,.15)",
  violet:      "#a78bfa",
  violetSoft:  "rgba(167,139,250,.15)",
  amber:       "#fbbf24",
  amberSoft:   "rgba(251,191,36,.15)",
  teal:        "#2dd4bf",
  rose:        "#fb7185",
  indigo:      "#818cf8",
};

const ThemeContext = createContext({ C: LIGHT, isDark: false, setIsDark: () => {} });
const useTheme = () => useContext(ThemeContext);

const getChartTheme = (C) => ({
  PIE_DESP: [C.info, C.amber, C.violet, C.danger, C.teal, C.indigo, C.rose],
  PIE_REC: [C.success, C.info, C.amber, C.violet, C.rose, C.teal],
  GRID: { stroke: C.lineStrong, strokeDasharray: "3 3" },
  AXIS: { fill: C.textMuted, fontSize: 10, fontFamily: "'Montserrat'", fontWeight: 600 },
  AXIS_LINE: { stroke: C.lineStrong },
  CHART_TOOLTIP: {
    contentStyle: { background: C.surfaceSolid, border: `1px solid ${C.line}`, borderRadius: 10, fontFamily: "'Montserrat'", fontSize: 12, color: C.text },
    itemStyle: { color: C.textSoft },
  },
  LEGEND_STYLE: { fontSize: 10, fontFamily: "'Montserrat'", fontWeight: 600, color: C.textMuted }
});


// ─── SVG Icon System ────────────────────────────────────────────────────────
const ICONS = {
  warning:       "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  trending_down: "M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181",
  bar_chart:     "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  alert_circle:  "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
  flame:         "M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z",
  siren:         "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0",
  scale:         "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z",
  lightbulb:     "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
};

const Ico = ({ name, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, display: "block" }}>
    <path d={ICONS[name]} />
  </svg>
);

const Dot = ({ color }) => (
  <svg width={8} height={8} viewBox="0 0 8 8"
    style={{ display: "inline-block", marginLeft: 5, verticalAlign: "middle", flexShrink: 0 }}>
    <circle cx={4} cy={4} r={3.5} fill={color} />
  </svg>
);

const WarnSm = ({ color }) => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", marginLeft: 4, verticalAlign: "middle", flexShrink: 0 }}>
    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

// ─── Components ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  const { C } = useTheme();
  if (!active || !payload) return null;
  return (
    <div style={{
      background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)",
      border: `1px solid ${C.line}`, borderRadius: 12,
      padding: "14px 18px", boxShadow: C.shadowLg,
    }}>
      <p style={{ color: C.primary, fontFamily: "'Bebas Neue'", fontSize: 16, margin: "0 0 8px", letterSpacing: 1 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
          <span style={{ color: C.textMuted, fontSize: 12, fontFamily: "'Montserrat'" }}>{p.name}:</span>
          <span style={{ color: C.text, fontSize: 12, fontWeight: 700, fontFamily: "'Montserrat'", marginLeft: "auto", paddingLeft: 12 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const KPI = ({ label, value, sub, color, alert, compact }) => {
  const { C } = useTheme();
  color = color || C.primary;
  return (
  <div style={{
    background: alert
      ? `linear-gradient(135deg, rgba(255,255,255,.95) 55%, ${color}09 100%)`
      : C.surface,
    backdropFilter: "blur(18px)",
    border: `1px solid ${alert ? color + "44" : C.line}`,
    borderLeft: `4px solid ${color}`,
    borderRadius: 18,
    padding: compact ? "16px 16px" : "22px 24px",
    flex: compact ? "1 1 min(100%, 150px)" : "1 1 200px",
    minWidth: compact ? 0 : 180,
    overflow: "hidden",
    boxShadow: alert ? `${C.shadowSm}, 0 0 0 1px ${color}11` : C.shadowSm,
  }}>
    <p style={{
      color: C.textMuted,
      fontSize: compact ? 9 : 10,
      textTransform: "uppercase",
      letterSpacing: compact ? "1.2px" : "1.5px",
      lineHeight: 1.25,
      margin: 0,
      fontFamily: "'Montserrat'",
      fontWeight: 800,
      overflowWrap: "anywhere",
    }}>{label}</p>
    <p style={{
      color: alert ? color : C.text,
      fontSize: compact ? "clamp(22px, 7vw, 28px)" : 34,
      fontWeight: 400,
      margin: compact ? "6px 0 4px" : "10px 0 6px",
      fontFamily: "'Bebas Neue'",
      letterSpacing: compact ? "1px" : "2px",
      lineHeight: 1.02,
      whiteSpace: "nowrap",
      maxWidth: "100%",
    }}>{value}</p>
    {sub && <p style={{
      color: C.textDim,
      fontSize: compact ? 10 : 11,
      lineHeight: 1.25,
      margin: 0,
      fontFamily: "'Montserrat'",
      fontWeight: 500,
      overflowWrap: "anywhere",
    }}>{sub}</p>}
  </div>
  );
};

const Badge = ({ children, color }) => {
  const { C } = useTheme();
  color = color || C.gold;
  return (
  <span style={{
    background: color + "18",
    color, border: `1px solid ${color}44`,
    borderRadius: 8, padding: "3px 10px", fontSize: 10,
    fontWeight: 800, fontFamily: "'Montserrat'", letterSpacing: "0.8px",
    textTransform: "uppercase", display: "inline-block",
  }}>{children}</span>
  );
};

const SectionTitle = ({ children, badge }) => {
  const { C } = useTheme();
  return (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
    <h2 style={{ color: C.primary, fontFamily: "'Bebas Neue'", fontSize: 17, margin: 0, letterSpacing: "2px" }}>{children}</h2>
    {badge}
  </div>
  );
};

const Card = ({ children, style }) => {
  const { C } = useTheme();
  return (
  <div style={{
    background: C.surface,
    backdropFilter: "blur(18px)",
    border: `1px solid ${C.line}`,
    borderRadius: 20, padding: 20,
    boxShadow: C.shadowMd,
    ...style,
  }}>{children}</div>
  );
};

const TabButton = ({ active, onClick, children }) => {
  const { C } = useTheme();
  return (
  <button onClick={onClick} style={{
    background: active ? C.primary : C.surface,
    color: active ? "#fff" : C.textSoft,
    border: `1px solid ${active ? "transparent" : C.goldBorder}`,
    borderRadius: 16,
    padding: "10px 16px", cursor: "pointer",
    fontSize: 11, fontWeight: 700, fontFamily: "'Montserrat'",
    letterSpacing: "0.6px", textTransform: "uppercase", transition: "all .2s",
    whiteSpace: "nowrap",
  }}>{children}</button>
  );
};

const Insight = ({ icon, text, color }) => {
  const { C } = useTheme();
  color = color || C.gold;
  return (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: 12,
    background: color === C.danger ? C.dangerSoft : color === C.success ? C.successSoft : color === C.info ? C.infoSoft : color === C.amber ? C.amberSoft : C.goldSoft,
    border: `1px solid ${color}33`,
    borderRadius: 14, padding: "14px 16px", marginBottom: 12,
  }}>
    <div style={{ marginTop: 1 }}>
      <Ico name={icon} size={17} color={color} />
    </div>
    <p style={{ color: C.textSoft, fontSize: 12, margin: 0, fontFamily: "'Montserrat'", lineHeight: 1.65, fontWeight: 500 }}>{text}</p>
  </div>
  );
};



// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [isDark, setIsDark] = useState(true);
  const C = isDark ? DARK : LIGHT;
  const chartTheme = useMemo(() => getChartTheme(C), [C]);
  const { PIE_DESP, PIE_REC, GRID, AXIS, AXIS_LINE, CHART_TOOLTIP, LEGEND_STYLE } = chartTheme;

  useEffect(() => {
    document.body.style.background = C.bg;
  }, [C.bg]);


  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const [tab, setTab] = useState("visaoGeral");
  const [viewportWidth, setViewportWidth] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1440);
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const handler = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const r = (desk, mob) => isMobile ? mob : desk;

  const despesasPie = useMemo(() => [
    { name: "Tarifas Públicas", value: TOTALS.tarifasPublicas },
    { name: "Pessoal",          value: TOTALS.pessoal },
    { name: "Manutenção",       value: TOTALS.manutencao },
    { name: "Administrativas",  value: TOTALS.administrativas },
    { name: "Investimentos",    value: TOTALS.investimentos },
    { name: "Terceirização",    value: TOTALS.terceirizacao },
    { name: "Controle Acesso",  value: TOTALS.controleAcesso },
  ], []);

  const receitasPie = useMemo(() => [
    { name: "Taxa Condominial", value: 156760.23 },
    { name: "Acordos",          value: 12873.39 },
    { name: "Rendimentos",      value: 3175.89 },
    { name: "Hon. Cobrança",    value: 3585.09 },
    { name: "Taxa Mudança",     value: 2520 },
    { name: "Multas/Juros",     value: 1075.28 },
  ], []);

  const recDespData   = rawData.map(d => ({ month: MONTH_LABELS[d.idx], receitas: d.receitas, despesas: d.despesas }));
  const saldoData     = rawData.map(d => ({ month: MONTH_LABELS[d.idx], saldo: d.saldoFinal, movLiquido: d.receitas - d.despesas }));
  const despCategData = rawData.map(d => ({ month: MONTH_LABELS[d.idx], pessoal: d.pessoal, tarifas: d.tarifasPublicas, manutencao: d.manutencao, admin: d.administrativas }));
  const energiaData   = rawData.map(d => ({ month: MONTH_LABELS[d.idx], energia: d.energia, agua: d.agua, gas: d.gas }));
  const taxaCondData  = rawData.map(d => ({ month: MONTH_LABELS[d.idx], taxa: d.taxaCond, highlight: d.taxaCond >= 12000 }));
  const avgReceita    = TOTALS.receitas / 14;

  const px  = r("48px", "14px");
  const pad = r("32px 48px 56px", "16px 14px 48px");

  return (
    <ThemeContext.Provider value={{ C, isDark, setIsDark }}>
      <div style={{ fontFamily: "'Montserrat', system-ui, sans-serif", background: C.bg, color: C.text, minHeight: "100vh", width: "100%" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header style={{ background: `linear-gradient(${C.primary}FA 0%, rgba(30,58,107,0.94) 100%)`, padding: r("36px 48px 24px", "20px 16px 18px") }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <p style={{ color: "rgba(201,162,74,.85)", fontSize: r(10, 9), letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 4px", fontFamily: "'Montserrat'", fontWeight: 800 }}>
              Prestação de Contas · Assembleia Geral Extraordinária
            </p>
            <h1 style={{ color: "#fff", fontSize: r(44, 22), fontWeight: 400, margin: 0, fontFamily: "'Bebas Neue'", letterSpacing: "2px", lineHeight: 1 }}>
              RESIDENCIAL ALPINE IV
            </h1>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: r(13, 11), margin: "6px 0 0", fontWeight: 500, fontFamily: "'Montserrat'" }}>
              Demonstrativo de Receitas e Despesas —{" "}
              <span style={{ color: C.gold, fontWeight: 700 }}>Jan/2025 a Fev/2026</span>
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setIsDark(!isDark)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 12px", color: "#fff", cursor: "pointer", fontSize: 10, fontFamily: "'Montserrat'", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, transition: "all 0.2s" }}>
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
              <button onClick={toggleFullscreen} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 12px", color: "#fff", cursor: "pointer", fontSize: 10, fontFamily: "'Montserrat'", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, transition: "all 0.2s" }}>
                {isFullscreen ? "Sair Tela Cheia" : "Tela Cheia"}
              </button>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(201,162,74,.7)", fontSize: 9, margin: 0, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 800, fontFamily: "'Montserrat'" }}>Emitido</p>
              <p style={{ color: "#fff", fontSize: r(24, 18), fontFamily: "'Bebas Neue'", margin: "3px 0 2px", letterSpacing: "1.5px" }}>11/05/2026</p>
              <p style={{ color: "rgba(255,255,255,.45)", fontSize: 9, margin: 0, fontWeight: 600, letterSpacing: "0.8px", fontFamily: "'Montserrat'" }}>W015A · Código 107</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── NAV TABS ───────────────────────────────────────────────────────── */}
      <nav style={{ background: C.bg, padding: r("16px 48px", "12px 14px"), borderBottom: `1px solid ${C.line}`, overflowX: "auto" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", gap: 8, flexWrap: r("wrap", "nowrap"), width: r("auto", "max-content") }}>
          {[
            { id: "visaoGeral",    label: "Visão Geral" },
            { id: "receitas",      label: "Receitas" },
            { id: "despesas",      label: "Despesas" },
            { id: "saldo",         label: "Saldo & Evolução" },
            { id: "inadimplencia", label: "Inadimplência" },
            { id: "tabela",        label: "Tabela" },
          ].map(t => (
            <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</TabButton>
          ))}
        </div>
      </nav>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main style={{ padding: pad, maxWidth: 1440, margin: "0 auto" }}>

        {/* ══ VISÃO GERAL ══════════════════════════════════════════════════ */}
        {tab === "visaoGeral" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <KPI label="Receita Total · 14 Meses"  value={fmt(TOTALS.receitas)}   sub="Jan/2025 a Fev/2026" color={C.success} compact={isMobile} />
              <KPI label="Despesa Total · 14 Meses"  value={fmt(TOTALS.despesas)}   sub="Jan/2025 a Fev/2026" color={C.danger}  compact={isMobile} />
              <KPI label="Resultado Líquido"         value={fmt(TOTALS.movLiquido)} sub="Déficit acumulado no período" color={C.danger} alert compact={isMobile} />
              <KPI label="Saldo Final Fev/26"        value={fmt(15237.14)}           sub={`Saldo Inicial Jan/25: ${fmt(30342.28)}`} color={C.amber} alert compact={isMobile} />
            </div>

            {/* Inadimplência destaque */}
            <div style={{
              background: `linear-gradient(135deg, rgba(255,255,255,.92) 50%, ${C.dangerSoft} 100%)`,
              backdropFilter: "blur(18px)",
              border: `1px solid ${C.danger}33`,
              borderLeft: `4px solid ${C.danger}`,
              borderRadius: 20, padding: r("20px 28px", "16px"),
              marginBottom: 16,
              display: "flex", alignItems: r("center", "flex-start"), gap: r(40, 16), flexWrap: "wrap",
              boxShadow: C.shadowSm,
            }}>
              <div>
                <p style={{ color: C.textMuted, fontSize: 9, textTransform: "uppercase", letterSpacing: "1.8px", margin: "0 0 4px", fontFamily: "'Montserrat'", fontWeight: 800 }}>Inadimplência Atual</p>
                <p style={{ color: C.danger, fontSize: r(52, 40), fontFamily: "'Bebas Neue'", margin: 0, letterSpacing: "2px" }}>44%</p>
                <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600, margin: "2px 0 0" }}>28 unidades inadimplentes</p>
              </div>
              {!isMobile && <div style={{ width: 1, height: 56, background: C.line }} />}
              <div>
                <p style={{ color: C.textMuted, fontSize: 9, textTransform: "uppercase", letterSpacing: "1.8px", margin: "0 0 4px", fontFamily: "'Montserrat'", fontWeight: 800 }}>Total em Aberto</p>
                <p style={{ color: C.danger, fontSize: r(34, 26), fontFamily: "'Bebas Neue'", margin: 0, letterSpacing: "1.5px" }}>R$ 21.438,25</p>
                <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600, margin: "2px 0 0" }}>Referência: Assembleia 11/05/2026</p>
              </div>
              {!isMobile && <div style={{ width: 1, height: 56, background: C.line }} />}
              <div style={{ flex: 1, minWidth: 180 }}>
                <p style={{ color: C.textMuted, fontSize: 9, textTransform: "uppercase", letterSpacing: "1.8px", margin: "0 0 10px", fontFamily: "'Montserrat'", fontWeight: 800 }}>Proporção de Inadimplentes</p>
                <div style={{ background: C.bgStrong, borderRadius: 8, height: 10, overflow: "hidden" }}>
                  <div style={{ width: "44%", height: "100%", background: `linear-gradient(90deg, ${C.danger}, ${C.rose})`, borderRadius: 8 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ color: C.danger, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 700 }}>28 inadimp. (44%)</span>
                  <span style={{ color: C.success, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 700 }}>36 adimpl. (56%)</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: r("1fr 1fr", "1fr"), gap: 12, marginBottom: 16 }}>
              <Insight icon="warning" text={`O condomínio acumulou déficit de ${fmt(15105.14)} em 14 meses. As despesas superaram as receitas em 8 dos 14 meses do período.`} color={C.danger} />
              <Insight icon="trending_down" text={`Saldo caiu de ${fmt(30342.28)} (Jan/25) para ${fmt(15237.14)} (Fev/26), queda de 49,8%. Menor saldo registrado: ${fmt(13015.03)} em Jan/2026.`} color={C.amber} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: r("3fr 2fr", "1fr"), gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle badge={<Badge color={C.danger}>8 Meses Deficitários</Badge>}>Receitas vs Despesas</SectionTitle>
                <ResponsiveContainer width="100%" height={r(290, 220)}>
                  <ComposedChart data={recDespData} barGap={4} margin={{ right: 8 }}>
                    <defs>
                      <linearGradient id="recG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.success} stopOpacity={0.9}/><stop offset="100%" stopColor={C.success} stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="despG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.danger} stopOpacity={0.85}/><stop offset="100%" stopColor={C.danger} stopOpacity={0.35}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={AXIS_LINE} tickLine={false} />
                    <YAxis tickFormatter={fmtK} tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={avgReceita} stroke={C.success} strokeDasharray="6 4" strokeOpacity={0.5}
                      label={{ value: `Média ${fmtK(avgReceita)}`, fill: C.success, fontSize: 10, fontFamily: "'Montserrat'" }} />
                    <Bar dataKey="receitas" fill="url(#recG)" name="Receitas" radius={[4,4,0,0]} maxBarSize={24} />
                    <Bar dataKey="despesas" fill="url(#despG)" name="Despesas" radius={[4,4,0,0]} maxBarSize={24} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <SectionTitle>Composição das Despesas</SectionTitle>
                <ResponsiveContainer width="100%" height={r(290, 260)}>
                  <PieChart>
                    <Pie data={despesasPie} cx="50%" cy="42%" outerRadius={r(82, 78)} innerRadius={r(44, 40)} paddingAngle={3}
                      dataKey="value" strokeWidth={0} label={false}>
                      {despesasPie.map((_, i) => <Cell key={i} fill={PIE_DESP[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} {...CHART_TOOLTIP} />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={LEGEND_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <SectionTitle badge={<Badge color={C.amber}>-49,8% no Período</Badge>}>Evolução do Saldo</SectionTitle>
              <ResponsiveContainer width="100%" height={r(260, 200)}>
                <AreaChart data={saldoData} margin={{ right: 16 }}>
                  <defs>
                    <linearGradient id="saldoG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.info} stopOpacity={0.18}/><stop offset="100%" stopColor={C.info} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...GRID} />
                  <XAxis dataKey="month" tick={AXIS} axisLine={AXIS_LINE} tickLine={false} />
                  <YAxis tickFormatter={fmtK} tick={AXIS} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={20000} stroke={C.amber} strokeDasharray="6 4" strokeOpacity={0.6}
                    label={{ value: "Reserva mín. sugerida", fill: C.amber, fontSize: 10, fontFamily: "'Montserrat'" }} />
                  <Area type="monotone" dataKey="saldo" stroke={C.info} fill="url(#saldoG)" strokeWidth={2.5} name="Saldo Final"
                    dot={({ cx, cy, payload }) => {
                      const low = payload.saldo < 15000;
                      return <circle cx={cx} cy={cy} r={low ? 6 : 3} fill={low ? C.danger : C.info} stroke="#fff" strokeWidth={2} />;
                    }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ══ RECEITAS ════════════════════════════════════════════════════ */}
        {tab === "receitas" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <KPI label="Taxa Condominial"          value={fmt(156760.23)} sub="87,8% das receitas" color={C.success} compact={isMobile} />
              <KPI label="Acordos"                   value={fmt(12873.39)}  sub="7,2% das receitas"  color={C.info}    compact={isMobile} />
              <KPI label="Rendimentos Investimentos" value={fmt(3175.89)}   sub="1,8% das receitas"  color={C.amber}   compact={isMobile} />
              <KPI label="Receita Média Mensal"      value={fmt(avgReceita)} sub="Média 14 meses"    color={C.violet}  compact={isMobile} />
            </div>

            <Insight icon="bar_chart" text={`A taxa condominial representa 87,8% de toda a arrecadação. Dezembro/2025 teve a maior receita do período (${fmt(16319.05)}), impulsionado por acordos (${fmt(2938.01)}) e honorários de cobrança (${fmt(981.27)}).`} color={C.success} />
            <Insight icon="alert_circle" text={`Inadimplência em 44% (28 unidades) representa ${fmt(21438.25)} em taxas não arrecadadas — equivale a 1,7 meses de receita média.`} color={C.danger} />

            <div style={{ display: "grid", gridTemplateColumns: r("3fr 2fr", "1fr"), gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle>Taxa de Condomínio por Mês</SectionTitle>
                <ResponsiveContainer width="100%" height={r(290, 220)}>
                  <BarChart data={taxaCondData} margin={{ right: 8 }}>
                    <defs>
                      <linearGradient id="taxaH" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.success} stopOpacity={0.9}/><stop offset="100%" stopColor={C.success} stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="taxaN" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.info} stopOpacity={0.75}/><stop offset="100%" stopColor={C.info} stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={AXIS_LINE} tickLine={false} />
                    <YAxis tickFormatter={fmtK} tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={156760.23/14} stroke={C.gold} strokeDasharray="6 4" strokeOpacity={0.7}
                      label={{ value: `Média ${fmtK(156760.23/14)}`, fill: C.gold, fontSize: 10, fontFamily: "'Montserrat'" }} />
                    <Bar dataKey="taxa" name="Taxa Condominial" radius={[4,4,0,0]} maxBarSize={32}>
                      {taxaCondData.map((d, i) => <Cell key={i} fill={d.highlight ? "url(#taxaH)" : "url(#taxaN)"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <SectionTitle>Composição das Receitas</SectionTitle>
                <ResponsiveContainer width="100%" height={r(290, 260)}>
                  <PieChart>
                    <Pie data={receitasPie} cx="50%" cy="42%" outerRadius={r(82, 78)} innerRadius={r(44, 40)} paddingAngle={3}
                      dataKey="value" strokeWidth={0} label={false}>
                      {receitasPie.map((_, i) => <Cell key={i} fill={PIE_REC[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} {...CHART_TOOLTIP} />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={LEGEND_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <SectionTitle>Receita Total Mensal</SectionTitle>
              <ResponsiveContainer width="100%" height={r(240, 200)}>
                <AreaChart data={rawData.map(d => ({ month: MONTH_LABELS[d.idx], total: d.receitas }))} margin={{ right: 16 }}>
                  <defs>
                    <linearGradient id="rTG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.success} stopOpacity={0.2}/><stop offset="100%" stopColor={C.success} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...GRID} />
                  <XAxis dataKey="month" tick={AXIS} axisLine={AXIS_LINE} tickLine={false} />
                  <YAxis tickFormatter={fmtK} tick={AXIS} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke={C.success} fill="url(#rTG)" strokeWidth={2.5} name="Total Receitas"
                    dot={{ r: 3, fill: C.success, strokeWidth: 0 }} activeDot={{ r: 6, stroke: C.success, strokeWidth: 2, fill: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ══ DESPESAS ════════════════════════════════════════════════════ */}
        {tab === "despesas" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <KPI label="Tarifas Públicas"  value={fmt(TOTALS.tarifasPublicas)} sub={`34,5% — ${fmt(TOTALS.tarifasPublicas/14)}/mês`} color={C.info}   alert compact={isMobile} />
              <KPI label="Pessoal"           value={fmt(TOTALS.pessoal)}         sub={`22,4% — ${fmt(TOTALS.pessoal/14)}/mês`}         color={C.amber} compact={isMobile} />
              <KPI label="Manutenção"        value={fmt(TOTALS.manutencao)}      sub={`19,2% — ${fmt(TOTALS.manutencao/14)}/mês`}      color={C.violet} compact={isMobile} />
              <KPI label="Administrativas"   value={fmt(TOTALS.administrativas)} sub={`18,0% — ${fmt(TOTALS.administrativas/14)}/mês`} color={C.danger} compact={isMobile} />
            </div>

            <Insight icon="flame" text={`Tarifas públicas (Água, Gás e Energia) são a maior despesa: ${fmt(TOTALS.tarifasPublicas)} (34,5%). Água/Esgoto acumulou ${fmt(33428.00)} e Gás ${fmt(18184.99)} nos 14 meses. Em Jan/2026 o Gás voltou a pesar: ${fmt(2424.32)}.`} color={C.info} />

            <div style={{ display: "grid", gridTemplateColumns: r("1fr 1fr", "1fr"), gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle badge={<Badge color={C.info}>Maior Custo</Badge>}>Despesas por Categoria</SectionTitle>
                <ResponsiveContainer width="100%" height={r(310, 230)}>
                  <BarChart data={despCategData} margin={{ right: 8 }}>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={AXIS_LINE} tickLine={false} />
                    <YAxis tickFormatter={fmtK} tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={8} wrapperStyle={LEGEND_STYLE} />
                    <Bar dataKey="tarifas"    stackId="a" fill={C.info}   name="Tarifas Públicas" />
                    <Bar dataKey="pessoal"    stackId="a" fill={C.amber}  name="Pessoal" />
                    <Bar dataKey="manutencao" stackId="a" fill={C.violet} name="Manutenção" />
                    <Bar dataKey="admin"      stackId="a" fill={C.danger} name="Administrativas" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <SectionTitle badge={<Badge color={C.danger}>Pico em Mai/25</Badge>}>Tarifas Públicas Detalhadas</SectionTitle>
                <ResponsiveContainer width="100%" height={r(310, 230)}>
                  <BarChart data={energiaData} margin={{ right: 8 }}>
                    <defs>
                      <linearGradient id="eG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.amber} stopOpacity={.9}/><stop offset="100%" stopColor={C.amber} stopOpacity={.4}/></linearGradient>
                      <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.info}  stopOpacity={.9}/><stop offset="100%" stopColor={C.info}  stopOpacity={.4}/></linearGradient>
                      <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.teal}  stopOpacity={.9}/><stop offset="100%" stopColor={C.teal}  stopOpacity={.4}/></linearGradient>
                    </defs>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="month" tick={AXIS} axisLine={AXIS_LINE} tickLine={false} />
                    <YAxis tickFormatter={fmtK} tick={AXIS} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={8} wrapperStyle={LEGEND_STYLE} />
                    <Bar dataKey="energia" fill="url(#eG)" name="Energia"     radius={[4,4,0,0]} maxBarSize={22} />
                    <Bar dataKey="agua"    fill="url(#aG)" name="Água/Esgoto" radius={[4,4,0,0]} maxBarSize={22} />
                    <Bar dataKey="gas"     fill="url(#gG)" name="Gás"         radius={[4,4,0,0]} maxBarSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <SectionTitle>Top 10 — Manutenção Acumulada (14 Meses)</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: r("1fr 1fr", "1fr"), gap: 8, marginTop: 8 }}>
                {[
                  { name: "Equip. Eletrônico (Inst./Manut.)", val: 4461.27 },
                  { name: "Desentupimento",                   val: 3975.00 },
                  { name: "Material p/ reforma",              val: 3915.91 },
                  { name: "Manutenção Portão",                val: 3870.30 },
                  { name: "Jardinagem",                       val: 2450.00 },
                  { name: "Ar Condicionado",                  val: 2400.00 },
                  { name: "Material de Limpeza",              val: 2248.82 },
                  { name: "Material Eletrônico",              val: 2219.50 },
                  { name: "Dedetização/Desratização",         val: 2175.00 },
                  { name: "Material Elétrico",                val: 1410.89 },
                ].map((item, i) => {
                  const maxVal = 4461.27;
                  const pct = (item.val / maxVal) * 100;
                  return (
                    <div key={i} style={{
                      background: C.surfaceSolid, borderRadius: 12,
                      padding: "12px 16px", border: `1px solid ${C.line}`,
                      position: "relative", overflow: "hidden",
                      boxShadow: C.shadowSm,
                    }}>
                      <div style={{
                        position: "absolute", top: 0, left: 0, bottom: 0,
                        width: `${pct}%`, background: `${C.violet}0D`,
                        borderRight: `2px solid ${C.violet}22`,
                      }} />
                      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: i < 3 ? C.gold : C.textDim, fontFamily: "'Bebas Neue'", fontSize: 16, width: 24, flexShrink: 0 }}>#{i+1}</span>
                          <span style={{ color: C.textSoft, fontSize: 11, fontWeight: 600, fontFamily: "'Montserrat'" }}>{item.name}</span>
                        </div>
                        <span style={{ color: i < 3 ? C.primary : C.textSoft, fontWeight: 800, fontSize: 12, fontFamily: "'Bebas Neue'", letterSpacing: 1, flexShrink: 0, marginLeft: 8 }}>{fmt(item.val)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ══ SALDO & EVOLUÇÃO ════════════════════════════════════════════ */}
        {tab === "saldo" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <KPI label="Saldo Inicial (Jan/25)" value={fmt(30342.28)} color={C.info}   compact={isMobile} />
              <KPI label="Saldo Final (Fev/26)"   value={fmt(15237.14)} color={C.amber}  alert compact={isMobile} />
              <KPI label="Redução no Período"      value={fmt(30342.28 - 15237.14)} sub="-49,8% em 14 meses" color={C.danger} alert compact={isMobile} />
              <KPI label="Menor Saldo"             value={fmt(13015.03)} sub="Janeiro/2026" color={C.danger} alert compact={isMobile} />
            </div>

            <Insight icon="siren" text={`O saldo ficou abaixo de R$ 15.000 em 4 meses (Set/25, Nov/25, Dez/25 e Jan/26), atingindo o ponto mais baixo em Janeiro/2026: ${fmt(13015.03)}. Em Fevereiro/2026 o saldo se recuperou para ${fmt(15237.14)}.`} color={C.danger} />

            <Card style={{ marginBottom: 16 }}>
              <SectionTitle badge={<Badge color={C.danger}>Saldo em Queda</Badge>}>Saldo + Movimento Líquido</SectionTitle>
              <ResponsiveContainer width="100%" height={r(310, 230)}>
                <ComposedChart data={saldoData} margin={{ right: 16 }}>
                  <defs>
                    <linearGradient id="sG2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.info} stopOpacity={0.18}/><stop offset="100%" stopColor={C.info} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...GRID} />
                  <XAxis dataKey="month" tick={AXIS} axisLine={AXIS_LINE} tickLine={false} />
                  <YAxis tickFormatter={fmtK} tick={AXIS} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={8} wrapperStyle={LEGEND_STYLE} />
                  <ReferenceLine y={0}     stroke={C.lineStrong} />
                  <ReferenceLine y={15000} stroke={C.danger} strokeDasharray="6 4" strokeOpacity={0.5}
                    label={{ value: "Zona crítica", fill: C.danger, fontSize: 10, fontFamily: "'Montserrat'", fontWeight: 700 }} />
                  <Area type="monotone" dataKey="saldo" stroke={C.info} fill="url(#sG2)" strokeWidth={2.5} name="Saldo Final"
                    dot={({ cx, cy, payload }) => {
                      const crit = payload.saldo < 15000;
                      return <circle cx={cx} cy={cy} r={crit ? 7 : 4} fill={crit ? C.danger : C.info} stroke="#fff" strokeWidth={2} />;
                    }} />
                  <Bar dataKey="movLiquido" name="Mov. Líquido" radius={[4,4,0,0]} maxBarSize={18}>
                    {saldoData.map((e, i) => <Cell key={i} fill={e.movLiquido >= 0 ? C.success : C.danger} opacity={0.7} />)}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionTitle badge={<Badge color={C.info}>14 Meses</Badge>}>Resultado Mensal</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: r("repeat(7, 1fr)", "repeat(4, 1fr)"), gap: r(8, 6), marginTop: 8 }}>
                {rawData.map((d, i) => {
                  const mov = d.receitas - d.despesas;
                  const pos = mov >= 0;
                  const isCritical = !pos && Math.abs(mov) > 3000;
                  const is2026 = d.idx >= 12;
                  return (
                    <div key={i} style={{
                      textAlign: "center", padding: r("14px 4px", "10px 4px"), borderRadius: 12,
                      background: pos ? C.successSoft : isCritical ? C.dangerSoft : "rgba(220,38,38,.05)",
                      border: `1px solid ${pos ? C.success + "44" : isCritical ? C.danger + "55" : C.danger + "22"}`,
                      borderTop: is2026 ? `2px solid ${C.gold}88` : undefined,
                      boxShadow: C.shadowSm,
                    }}>
                      <p style={{ color: is2026 ? C.gold : C.textSoft, fontSize: r(11, 10), margin: 0, fontFamily: "'Bebas Neue'", letterSpacing: 1 }}>{MONTH_LABELS[i]}</p>
                      <p style={{ color: pos ? C.success : C.danger, fontSize: r(13, 12), fontWeight: 400, margin: "5px 0 0", fontFamily: "'Bebas Neue'", letterSpacing: 1 }}>
                        {pos ? "+" : ""}{(mov/1000).toFixed(1)}k
                      </p>
                    </div>
                  );
                })}
              </div>
              <p style={{ color: C.textDim, fontSize: 10, margin: "12px 0 0", fontFamily: "'Montserrat'", fontWeight: 600, letterSpacing: 1 }}>
                * Borda dourada = meses de 2026
              </p>
            </Card>
          </div>
        )}

        {/* ══ INADIMPLÊNCIA ════════════════════════════════════════════════ */}
        {tab === "inadimplencia" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <KPI label="Unidades Inadimplentes" value="28"              sub="Referência: Assembleia 11/05/2026"  color={C.danger} alert compact={isMobile} />
              <KPI label="Taxa de Inadimplência"  value="44%"             sub="Do total de unidades do condomínio" color={C.danger} alert compact={isMobile} />
              <KPI label="Valor Total em Aberto"  value={fmt(21438.25)}    sub="Soma das dívidas em aberto"         color={C.rose}   alert compact={isMobile} />
              <KPI label="Dívida Média/Unidade"   value={fmt(21438.25/28)} sub="Média entre os 28 inadimplentes"   color={C.amber}  compact={isMobile} />
            </div>

            <Insight icon="siren"   text={`Com 44% de inadimplência, o condomínio perde em média ${fmt(21438.25/14)} por mês em receita não arrecadada — ${((21438.25/178621.75)*100).toFixed(1)}% de toda a receita do período.`} color={C.danger} />
            <Insight icon="scale"   text={`O valor em aberto (${fmt(21438.25)}) é ${((21438.25/15105.14)*100).toFixed(0)}% maior que o déficit acumulado (${fmt(15105.14)}). A regularização das unidades inadimplentes teria eliminado o déficit do período.`} color={C.amber} />

            <div style={{ display: "grid", gridTemplateColumns: r("1fr 1fr", "1fr"), gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle>Proporção de Adimplência</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0" }}>
                  <ResponsiveContainer width="100%" height={r(240, 220)}>
                    <PieChart>
                      <Pie
                        data={[{ name: "Inadimplentes (28)", value: 28 }, { name: "Adimplentes (36)", value: 36 }]}
                        cx="50%" cy="42%" outerRadius={r(80, 74)} innerRadius={r(46, 42)}
                        paddingAngle={4} dataKey="value" strokeWidth={2} stroke="#fff" label={false}>
                        <Cell fill={C.danger} />
                        <Cell fill={C.success} />
                      </Pie>
                      <Tooltip formatter={(v) => `${v} unidades`} {...CHART_TOOLTIP} />
                      <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 12, fontFamily: "'Montserrat'", fontWeight: 700, color: C.textMuted }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <p style={{ color: C.textDim, fontSize: 11, fontFamily: "'Montserrat'", margin: "4px 0 0", fontWeight: 600 }}>Total: 64 unidades no condomínio</p>
                </div>
              </Card>

              <Card>
                <SectionTitle>Impacto Financeiro</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                  {[
                    { label: "Valor total em aberto",               display: fmt(21438.25),                                          color: C.danger, pct: 100 },
                    { label: "Equivale a meses de receita média",   display: `${(21438.25/avgReceita).toFixed(1)} meses`,            color: C.amber,  pct: (21438.25/avgReceita/14)*100 },
                    { label: "Vs. déficit acumulado do período",    display: `${((21438.25/15105.14)*100).toFixed(0)}% maior`,       color: C.rose,   pct: Math.min(100,(21438.25/15105.14)*50) },
                    { label: "% da receita total (14 meses)",       display: `${((21438.25/178621.75)*100).toFixed(1)}% de ${fmt(178621.75)}`, color: C.violet, pct: (21438.25/178621.75)*100 },
                  ].map((item, i) => (
                    <div key={i} style={{ background: C.bg, borderRadius: 14, padding: "14px 16px", border: `1px solid ${C.line}`, boxShadow: C.shadowSm }}>
                      <p style={{ color: C.textMuted, fontSize: 9, margin: "0 0 6px", fontFamily: "'Montserrat'", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</p>
                      <p style={{ color: item.color, fontSize: 20, fontFamily: "'Bebas Neue'", margin: "0 0 10px", letterSpacing: "1.5px" }}>{item.display}</p>
                      <div style={{ background: C.bgStrong, borderRadius: 6, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(100, item.pct)}%`, height: "100%", background: item.color, borderRadius: 6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <SectionTitle>Receita Arrecadada vs Potencial Máximo (100% adimplência)</SectionTitle>
              <Insight icon="lightbulb" text="Linha tracejada estima o potencial se todas as 64 unidades fossem adimplentes, com base na taxa condominial média arrecadada." color={C.info} />
              <ResponsiveContainer width="100%" height={r(260, 210)}>
                <AreaChart data={rawData.map(d => ({ month: MONTH_LABELS[d.idx], arrecadado: d.taxaCond, potencial: d.taxaCond/0.56 }))} margin={{ right: 16 }}>
                  <defs>
                    <linearGradient id="arrG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.success} stopOpacity={.25}/><stop offset="100%" stopColor={C.success} stopOpacity={0}/></linearGradient>
                    <linearGradient id="potG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.info} stopOpacity={.12}/><stop offset="100%" stopColor={C.info} stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid {...GRID} />
                  <XAxis dataKey="month" tick={AXIS} axisLine={AXIS_LINE} tickLine={false} />
                  <YAxis tickFormatter={fmtK} tick={AXIS} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={8} wrapperStyle={LEGEND_STYLE} />
                  <Area type="monotone" dataKey="potencial"  stroke={C.info}    fill="url(#potG)" strokeWidth={2} strokeDasharray="6 3" name="Potencial (100% adimpl.)" />
                  <Area type="monotone" dataKey="arrecadado" stroke={C.success} fill="url(#arrG)" strokeWidth={2.5}                    name="Arrecadado" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ══ TABELA DETALHADA ════════════════════════════════════════════ */}
        {tab === "tabela" && (
          <Card>
            <SectionTitle badge={<Badge color={C.info}>14 Meses</Badge>}>Resumo Mensal Completo</SectionTitle>
            <div style={{ overflowX: "auto", marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 640 }}>
                <thead>
                  <tr>
                    {["Mês","Saldo Anterior","Receitas","Despesas","Mov. Líquido","Saldo Final"].map((h, i) => (
                      <th key={h} style={{
                        padding: "12px 10px", textAlign: i === 0 ? "left" : "right",
                        color: C.primary, fontWeight: 800, fontSize: 9,
                        textTransform: "uppercase", letterSpacing: "1.5px",
                        fontFamily: "'Montserrat'",
                        borderBottom: `2px solid ${C.primary}22`,
                        background: "rgba(248,250,252,.98)",
                        position: "sticky", top: 0,
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} style={{ padding: "6px 10px", background: C.primarySoft, borderBottom: `1px solid ${C.line}` }}>
                      <span style={{ color: C.primary, fontFamily: "'Bebas Neue'", fontSize: 12, letterSpacing: "2px" }}>2025 — JAN A DEZ · 12 MESES</span>
                    </td>
                  </tr>
                  {rawData.filter(d => d.idx < 12).map((d, i) => {
                    const mov = d.receitas - d.despesas;
                    const isCritical = mov < -3000;
                    return (
                      <tr key={i} style={{ background: isCritical ? C.dangerSoft : i % 2 === 0 ? "transparent" : "rgba(15,23,42,.015)" }}>
                        <td style={{ padding: "10px 10px", fontFamily: "'Bebas Neue'", fontSize: 14, letterSpacing: "1.5px", color: C.primary, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>{d.month}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 500, color: C.textMuted, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>{fmt(d.saldoAnterior)}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 700, color: C.success, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>{fmt(d.receitas)}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 700, color: C.danger,  borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>{fmt(d.despesas)}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 800, color: mov >= 0 ? C.success : C.danger, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>
                          {mov >= 0 ? "+" : ""}{fmt(mov)}{isCritical && <WarnSm color={C.danger} />}
                        </td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 700, color: d.saldoFinal < 15000 ? C.amber : C.text, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>
                          {fmt(d.saldoFinal)}{d.saldoFinal < 15000 && <Dot color={C.amber} />}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: C.primarySoft }}>
                    <td style={{ padding: "11px 10px", fontFamily: "'Bebas Neue'", fontSize: 13, letterSpacing: "2px", color: C.primary, borderTop: `1px solid ${C.primary}22`, borderBottom: `2px solid ${C.line}`, whiteSpace: "nowrap" }}>SUBTOTAL 2025</td>
                    <td style={{ padding: "11px 10px", textAlign: "right", color: C.textMuted, borderTop: `1px solid ${C.primary}22`, borderBottom: `2px solid ${C.line}`, fontFamily: "'Montserrat'" }}>—</td>
                    <td style={{ padding: "11px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 800, color: C.success, borderTop: `1px solid ${C.primary}22`, borderBottom: `2px solid ${C.line}`, whiteSpace: "nowrap" }}>{fmt(153161.34)}</td>
                    <td style={{ padding: "11px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 800, color: C.danger,  borderTop: `1px solid ${C.primary}22`, borderBottom: `2px solid ${C.line}`, whiteSpace: "nowrap" }}>{fmt(168860.57)}</td>
                    <td style={{ padding: "11px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 900, color: C.danger,  borderTop: `1px solid ${C.primary}22`, borderBottom: `2px solid ${C.line}`, whiteSpace: "nowrap" }}>{fmt(-15699.23)}</td>
                    <td style={{ padding: "11px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 900, color: C.amber,   borderTop: `1px solid ${C.primary}22`, borderBottom: `2px solid ${C.line}`, whiteSpace: "nowrap" }}>{fmt(14643.05)}</td>
                  </tr>
                  <tr>
                    <td colSpan={6} style={{ padding: "6px 10px", background: C.goldSoft, borderBottom: `1px solid ${C.goldBorder}` }}>
                      <span style={{ color: C.gold, fontFamily: "'Bebas Neue'", fontSize: 12, letterSpacing: "2px" }}>2026 — JAN A FEV · 2 MESES</span>
                    </td>
                  </tr>
                  {rawData.filter(d => d.idx >= 12).map((d, i) => {
                    const mov = d.receitas - d.despesas;
                    const isCritical = mov < -3000;
                    return (
                      <tr key={i} style={{ background: isCritical ? C.dangerSoft : C.goldSoft }}>
                        <td style={{ padding: "10px 10px", fontFamily: "'Bebas Neue'", fontSize: 14, letterSpacing: "1.5px", color: C.gold, borderBottom: `1px solid ${C.goldBorder}`, whiteSpace: "nowrap" }}>{d.month}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 500, color: C.textMuted, borderBottom: `1px solid ${C.goldBorder}`, whiteSpace: "nowrap" }}>{fmt(d.saldoAnterior)}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 700, color: C.success, borderBottom: `1px solid ${C.goldBorder}`, whiteSpace: "nowrap" }}>{fmt(d.receitas)}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 700, color: C.danger,  borderBottom: `1px solid ${C.goldBorder}`, whiteSpace: "nowrap" }}>{fmt(d.despesas)}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 800, color: mov >= 0 ? C.success : C.danger, borderBottom: `1px solid ${C.goldBorder}`, whiteSpace: "nowrap" }}>
                          {mov >= 0 ? "+" : ""}{fmt(mov)}{isCritical && <WarnSm color={C.danger} />}
                        </td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 700, color: d.saldoFinal < 15000 ? C.amber : C.text, borderBottom: `1px solid ${C.goldBorder}`, whiteSpace: "nowrap" }}>
                          {fmt(d.saldoFinal)}{d.saldoFinal < 15000 && <Dot color={C.amber} />}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: C.primarySoft }}>
                    <td style={{ padding: "14px 10px", fontFamily: "'Bebas Neue'", fontSize: 14, letterSpacing: "2px", color: C.primary, borderTop: `2px solid ${C.primary}33`, whiteSpace: "nowrap" }}>TOTAL 14 MESES</td>
                    <td style={{ padding: "14px 10px", textAlign: "right", color: C.textMuted, borderTop: `2px solid ${C.primary}33`, fontFamily: "'Montserrat'" }}>—</td>
                    <td style={{ padding: "14px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 800, color: C.success, borderTop: `2px solid ${C.primary}33`, fontSize: 13, whiteSpace: "nowrap" }}>{fmt(TOTALS.receitas)}</td>
                    <td style={{ padding: "14px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 800, color: C.danger,  borderTop: `2px solid ${C.primary}33`, fontSize: 13, whiteSpace: "nowrap" }}>{fmt(TOTALS.despesas)}</td>
                    <td style={{ padding: "14px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 900, color: C.danger,  borderTop: `2px solid ${C.primary}33`, fontSize: 13, whiteSpace: "nowrap" }}>{fmt(TOTALS.movLiquido)}</td>
                    <td style={{ padding: "14px 10px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 900, color: C.amber,   borderTop: `2px solid ${C.primary}33`, fontSize: 13, whiteSpace: "nowrap" }}>{fmt(15237.14)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <footer style={{ textAlign: "center", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${C.line}` }}>
          <p style={{ color: C.textDim, fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Montserrat'", margin: 0 }}>
            Residencial Alpine IV — W015A · Código 107 — Uberlândia, MG
          </p>
        </footer>
      </main>
    </div>
    </ThemeContext.Provider>
  );
}
