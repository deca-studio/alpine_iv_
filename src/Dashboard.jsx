import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart, ReferenceLine,
} from "recharts";

const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

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
];

const TOTALS = {
  receitas: 153161.34, despesas: 168860.57, movLiquido: -15699.23,
  taxaCond: 133864.23, pessoal: 37698.77, tarifasPublicas: 56840.58,
  manutencao: 32311.30, administrativas: 30739.92, terceirizacao: 3380,
  investimentos: 5380, controleAcesso: 2510,
};

const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtK = (v) => `R$${(v / 1000).toFixed(1)}k`;

const C = {
  bg: "#0A0F1A",
  surface: "#101828",
  card: "#151F32",
  border: "#1E2D4A",
  borderLight: "#2A3D5E",
  emerald: "#10B981",
  emeraldGlow: "rgba(16,185,129,0.12)",
  coral: "#F43F5E",
  coralGlow: "rgba(244,63,94,0.12)",
  amber: "#F59E0B",
  amberGlow: "rgba(245,158,11,0.10)",
  sky: "#38BDF8",
  skyGlow: "rgba(56,189,248,0.10)",
  violet: "#A78BFA",
  rose: "#FB7185",
  teal: "#2DD4BF",
  indigo: "#818CF8",
  fuchsia: "#E879F9",
  cyan: "#22D3EE",
  text: "#E2E8F0",
  textBright: "#F8FAFC",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  highlight: "#FBBF24",
};

const PIE_DESP = [C.sky, C.amber, C.violet, C.coral, C.teal, C.indigo, C.fuchsia];
const PIE_REC = [C.emerald, C.sky, C.amber, C.violet, C.rose, C.teal];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: "rgba(16,24,40,0.96)", backdropFilter: "blur(12px)",
      border: `1px solid ${C.borderLight}`, borderRadius: 10,
      padding: "14px 18px", boxShadow: "0 12px 40px rgba(0,0,0,.5)",
    }}>
      <p style={{ color: C.highlight, fontFamily: "'Bebas Neue'", fontSize: 16, margin: "0 0 8px", letterSpacing: 1 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
          <span style={{ color: C.textMuted, fontSize: 12, fontFamily: "'Montserrat'" }}>{p.name}:</span>
          <span style={{ color: C.textBright, fontSize: 12, fontWeight: 700, fontFamily: "'Montserrat'", marginLeft: "auto" }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const KPI = ({ label, value, sub, color, alert }) => (
  <div style={{
    background: alert ? `linear-gradient(135deg, ${C.card} 60%, ${color === C.coral ? C.coralGlow : C.amberGlow} 100%)` : C.card,
    border: `1px solid ${alert ? color + "44" : C.border}`,
    borderLeft: `4px solid ${color}`,
    borderRadius: 10, padding: "22px 24px",
    flex: "1 1 220px", minWidth: 200,
  }}>
    <p style={{ color: C.textDim, fontSize: 10, textTransform: "uppercase", letterSpacing: 2, margin: 0, fontFamily: "'Montserrat'", fontWeight: 700 }}>{label}</p>
    <p style={{
      color: alert ? color : C.textBright,
      fontSize: 28, fontWeight: 400, margin: "10px 0 6px",
      fontFamily: "'Bebas Neue'", letterSpacing: 1.5,
      textShadow: alert ? `0 0 20px ${color}33` : "none",
    }}>{value}</p>
    {sub && <p style={{ color: C.textDim, fontSize: 11, margin: 0, fontFamily: "'Montserrat'", fontWeight: 500 }}>{sub}</p>}
  </div>
);

const HighlightBadge = ({ children, color = C.highlight }) => (
  <span style={{
    display: "inline-block", background: color + "18", color,
    border: `1px solid ${color}33`, borderRadius: 6,
    padding: "3px 10px", fontSize: 11,
    fontFamily: "'Montserrat'", fontWeight: 700, letterSpacing: 0.3,
  }}>{children}</span>
);

const SectionTitle = ({ children, badge }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
    <h2 style={{
      color: C.textBright, fontSize: 22, fontWeight: 400, margin: 0,
      fontFamily: "'Bebas Neue'", letterSpacing: 2,
    }}>{children}</h2>
    {badge}
  </div>
);

const Card = ({ children, style, glow }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
    padding: 28, boxShadow: glow ? `0 0 30px ${glow}` : "0 4px 20px rgba(0,0,0,.2)",
    ...style,
  }}>{children}</div>
);

const TabButton = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    background: active ? "rgba(56,189,248,0.12)" : "transparent",
    color: active ? C.sky : C.textDim,
    border: active ? `1px solid ${C.sky}44` : "1px solid transparent",
    borderBottom: active ? `2px solid ${C.sky}` : "2px solid transparent",
    borderRadius: "8px 8px 0 0", padding: "10px 24px", cursor: "pointer",
    fontSize: 12, fontWeight: 700, fontFamily: "'Montserrat'",
    letterSpacing: 1, textTransform: "uppercase", transition: "all .2s",
  }}>{children}</button>
);

const InsightBox = ({ icon, text, color = C.amber }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: 12,
    background: color + "08", border: `1px solid ${color}22`,
    borderRadius: 10, padding: "14px 18px", marginBottom: 12,
  }}>
    <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
    <p style={{ color: C.text, fontSize: 12, margin: 0, fontFamily: "'Montserrat'", lineHeight: 1.6, fontWeight: 500 }}>{text}</p>
  </div>
);

export default function Dashboard() {
  const [tab, setTab] = useState("visaoGeral");

  const despesasPie = useMemo(() => [
    { name: "Tarifas Públicas", value: TOTALS.tarifasPublicas },
    { name: "Pessoal", value: TOTALS.pessoal },
    { name: "Manutenção", value: TOTALS.manutencao },
    { name: "Administrativas", value: TOTALS.administrativas },
    { name: "Investimentos", value: TOTALS.investimentos },
    { name: "Terceirização", value: TOTALS.terceirizacao },
    { name: "Controle Acesso", value: TOTALS.controleAcesso },
  ], []);

  const receitasPie = useMemo(() => [
    { name: "Taxa Condominial", value: 133864.23 },
    { name: "Acordos", value: 11361.03 },
    { name: "Rendimentos", value: 2923.81 },
    { name: "Hon. Cobrança", value: 2920.22 },
    { name: "Taxa Mudança", value: 2340 },
    { name: "Multas/Juros", value: 888.34 },
  ], []);

  const recDespData = rawData.map(d => ({ month: MONTHS_SHORT[d.idx], receitas: d.receitas, despesas: d.despesas }));
  const saldoData = rawData.map(d => ({ month: MONTHS_SHORT[d.idx], saldo: d.saldoFinal, movLiquido: d.receitas - d.despesas }));
  const despCategData = rawData.map(d => ({ month: MONTHS_SHORT[d.idx], pessoal: d.pessoal, tarifas: d.tarifasPublicas, manutencao: d.manutencao, admin: d.administrativas }));
  const energiaData = rawData.map(d => ({ month: MONTHS_SHORT[d.idx], energia: d.energia, agua: d.agua, gas: d.gas }));
  const taxaCondData = rawData.map(d => ({ month: MONTHS_SHORT[d.idx], taxa: d.taxaCond, highlight: d.taxaCond >= 12000 }));
  const avgReceita = TOTALS.receitas / 12;

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: C.bg, color: C.text, minHeight: "100vh", width: "100%" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, padding: "32px 40px 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: 1440, margin: "0 auto" }}>
          <div>
            <p style={{ color: C.textDim, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 4px", fontWeight: 700 }}>Prestação de Contas</p>
            <h1 style={{ color: C.textBright, fontSize: 38, fontWeight: 400, margin: 0, fontFamily: "'Bebas Neue'", letterSpacing: 4 }}>
              RESIDENCIAL ALPINE IV
            </h1>
            <p style={{ color: C.textMuted, fontSize: 13, margin: "6px 0 0", fontWeight: 500 }}>
              Demonstrativo de Receitas e Despesas — <span style={{ color: C.sky, fontWeight: 700 }}>Janeiro a Dezembro 2025</span>
            </p>
          </div>
          <div style={{ textAlign: "right", paddingTop: 4 }}>
            <p style={{ color: C.textDim, fontSize: 10, margin: 0, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Emitido</p>
            <p style={{ color: C.textBright, fontSize: 20, fontFamily: "'Bebas Neue'", margin: "2px 0", letterSpacing: 1.5 }}>25/02/2026</p>
            <p style={{ color: C.textDim, fontSize: 10, margin: 0, fontWeight: 600, letterSpacing: 1 }}>Ampla Administradora de Condomínios</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 24, maxWidth: 1440, margin: "24px auto 0" }}>
          {[
            { id: "visaoGeral", label: "Visão Geral" },
            { id: "receitas", label: "Receitas" },
            { id: "despesas", label: "Despesas" },
            { id: "saldo", label: "Saldo & Evolução" },
            { id: "tabela", label: "Tabela Detalhada" },
          ].map(t => (
            <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</TabButton>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 40px 40px", maxWidth: 1440, margin: "0 auto" }}>

        {/* =================== VISÃO GERAL =================== */}
        {tab === "visaoGeral" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <KPI label="Receita Total" value={fmt(TOTALS.receitas)} sub="Acumulado 12 meses" color={C.emerald} />
              <KPI label="Despesa Total" value={fmt(TOTALS.despesas)} sub="Acumulado 12 meses" color={C.coral} />
              <KPI label="Resultado Líquido" value={fmt(TOTALS.movLiquido)} sub="Déficit no período" color={C.coral} alert />
              <KPI label="Saldo Final Dez/25" value={fmt(14643.05)} sub={`Saldo Inicial Jan/25: ${fmt(30342.28)}`} color={C.amber} alert />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <InsightBox icon="⚠️" text={`O condomínio encerrou 2025 com déficit de ${fmt(15699.23)}. As despesas superaram as receitas em 9 dos 12 meses do ano.`} color={C.coral} />
              <InsightBox icon="📉" text={`O saldo caiu de ${fmt(30342.28)} (Jan) para ${fmt(14643.05)} (Dez), uma redução de 51,7%. O menor saldo foi em Nov/2025: ${fmt(13525.04)}.`} color={C.amber} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
              <Card>
                <SectionTitle badge={<HighlightBadge color={C.coral}>9 MESES DEFICITÁRIOS</HighlightBadge>}>Receitas vs Despesas</SectionTitle>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={recDespData} barGap={4}>
                    <defs>
                      <linearGradient id="recG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.emerald} stopOpacity={0.9} /><stop offset="100%" stopColor={C.emerald} stopOpacity={0.5} /></linearGradient>
                      <linearGradient id="despG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.coral} stopOpacity={0.9} /><stop offset="100%" stopColor={C.coral} stopOpacity={0.5} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="month" tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600 }} axisLine={{ stroke: C.border }} />
                    <YAxis tickFormatter={fmtK} tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'Montserrat'" }} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={avgReceita} stroke={C.emerald} strokeDasharray="6 4" strokeOpacity={0.4} label={{ value: `Média ${fmtK(avgReceita)}`, fill: C.emerald, fontSize: 10, fontFamily: "'Montserrat'" }} />
                    <Bar dataKey="receitas" fill="url(#recG)" name="Receitas" radius={[5,5,0,0]} maxBarSize={32} />
                    <Bar dataKey="despesas" fill="url(#despG)" name="Despesas" radius={[5,5,0,0]} maxBarSize={32} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <SectionTitle>Composição das Despesas</SectionTitle>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={despesasPie} cx="50%" cy="48%" outerRadius={105} innerRadius={55} paddingAngle={3}
                      dataKey="value" strokeWidth={0}
                      label={({ name, percent }) => `${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`}
                      style={{ fontSize: 10, fontFamily: "'Montserrat'", fontWeight: 600, fill: C.textMuted }}>
                      {despesasPie.map((_, i) => <Cell key={i} fill={PIE_DESP[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'Montserrat'", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card glow={C.amberGlow}>
              <SectionTitle badge={<HighlightBadge color={C.amber}>-51,7% NO PERÍODO</HighlightBadge>}>Evolução do Saldo</SectionTitle>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={saldoData}>
                  <defs>
                    <linearGradient id="sG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.sky} stopOpacity={0.25} /><stop offset="100%" stopColor={C.sky} stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="month" tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600 }} axisLine={{ stroke: C.border }} />
                  <YAxis tickFormatter={fmtK} tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'Montserrat'" }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={20000} stroke={C.amber} strokeDasharray="6 4" strokeOpacity={0.5} label={{ value: "Reserva mín. sugerida", fill: C.amber, fontSize: 10, fontFamily: "'Montserrat'" }} />
                  <Area type="monotone" dataKey="saldo" stroke={C.sky} fill="url(#sG)" strokeWidth={3} name="Saldo Final"
                    dot={({ cx, cy, payload }) => {
                      const isLow = payload.saldo < 15000;
                      return <circle cx={cx} cy={cy} r={isLow ? 6 : 4} fill={isLow ? C.coral : C.sky} stroke={isLow ? C.coral : C.sky} strokeWidth={2} opacity={isLow ? 1 : 0.8} />;
                    }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* =================== RECEITAS =================== */}
        {tab === "receitas" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <KPI label="Taxa Condominial" value={fmt(133864.23)} sub="87,4% das receitas" color={C.emerald} />
              <KPI label="Acordos" value={fmt(11361.03)} sub="7,4% das receitas" color={C.sky} />
              <KPI label="Rendimentos Investimentos" value={fmt(2923.81)} sub="1,9% das receitas" color={C.amber} />
              <KPI label="Receita Média Mensal" value={fmt(avgReceita)} sub="Média aritmética" color={C.violet} />
            </div>

            <InsightBox icon="📊" text={`A taxa condominial representa 87,4% de toda a arrecadação. Junho teve a maior receita do ano (${fmt(14635.01)}) impulsionado por taxa condominial de ${fmt(13556)}.`} color={C.emerald} />

            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
              <Card>
                <SectionTitle>Taxa de Condomínio por Mês</SectionTitle>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={taxaCondData}>
                    <defs>
                      <linearGradient id="taxaH" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.emerald} stopOpacity={1} /><stop offset="100%" stopColor={C.emerald} stopOpacity={0.6} /></linearGradient>
                      <linearGradient id="taxaN" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.sky} stopOpacity={0.8} /><stop offset="100%" stopColor={C.sky} stopOpacity={0.4} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="month" tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600 }} axisLine={{ stroke: C.border }} />
                    <YAxis tickFormatter={fmtK} tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'Montserrat'" }} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={133864.23/12} stroke={C.highlight} strokeDasharray="6 4" strokeOpacity={0.5} label={{ value: `Média ${fmtK(133864.23/12)}`, fill: C.highlight, fontSize: 10, fontFamily: "'Montserrat'" }} />
                    <Bar dataKey="taxa" name="Taxa Condominial" radius={[5,5,0,0]} maxBarSize={40}>
                      {taxaCondData.map((d, i) => <Cell key={i} fill={d.highlight ? "url(#taxaH)" : "url(#taxaN)"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <SectionTitle>Composição das Receitas</SectionTitle>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={receitasPie} cx="50%" cy="48%" outerRadius={105} innerRadius={55} paddingAngle={3}
                      dataKey="value" strokeWidth={0}
                      label={({ percent }) => `${(percent*100).toFixed(0)}%`}
                      style={{ fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 700, fill: C.textMuted }}>
                      {receitasPie.map((_, i) => <Cell key={i} fill={PIE_REC[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'Montserrat'", fontSize: 12 }} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600, color: C.textMuted }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <SectionTitle>Receita Total Mensal</SectionTitle>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={rawData.map(d => ({ month: MONTHS_SHORT[d.idx], total: d.receitas }))}>
                  <defs>
                    <linearGradient id="rTG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.emerald} stopOpacity={0.3} /><stop offset="100%" stopColor={C.emerald} stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="month" tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600 }} axisLine={{ stroke: C.border }} />
                  <YAxis tickFormatter={fmtK} tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'Montserrat'" }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke={C.emerald} fill="url(#rTG)" strokeWidth={3} name="Total Receitas"
                    dot={{ r: 4, fill: C.emerald, strokeWidth: 0 }} activeDot={{ r: 6, stroke: C.emerald, strokeWidth: 2, fill: C.bg }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* =================== DESPESAS =================== */}
        {tab === "despesas" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <KPI label="Tarifas Públicas" value={fmt(TOTALS.tarifasPublicas)} sub={`33,7% — ${fmt(TOTALS.tarifasPublicas/12)}/mês`} color={C.amber} alert />
              <KPI label="Pessoal" value={fmt(TOTALS.pessoal)} sub={`22,3% — ${fmt(TOTALS.pessoal/12)}/mês`} color={C.sky} />
              <KPI label="Manutenção" value={fmt(TOTALS.manutencao)} sub={`19,1% — ${fmt(TOTALS.manutencao/12)}/mês`} color={C.violet} />
              <KPI label="Administrativas" value={fmt(TOTALS.administrativas)} sub={`18,2% — ${fmt(TOTALS.administrativas/12)}/mês`} color={C.rose} />
            </div>

            <InsightBox icon="🔥" text={`Tarifas públicas (Água, Gás e Energia) são a maior despesa: ${fmt(TOTALS.tarifasPublicas)} (33,7%). Somente Água/Esgoto somou ${fmt(28645.72)} e Gás ${fmt(15760.67)}. Maio/2025 teve pico de ${fmt(8254.03)} em tarifas (Gás: ${fmt(5153.35)}).`} color={C.amber} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <Card>
                <SectionTitle badge={<HighlightBadge color={C.amber}>MAIOR CUSTO</HighlightBadge>}>Despesas por Categoria</SectionTitle>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={despCategData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="month" tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600 }} axisLine={{ stroke: C.border }} />
                    <YAxis tickFormatter={fmtK} tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'Montserrat'" }} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600, color: C.textMuted }} />
                    <Bar dataKey="tarifas" stackId="a" fill={C.amber} name="Tarifas Públicas" />
                    <Bar dataKey="pessoal" stackId="a" fill={C.sky} name="Pessoal" />
                    <Bar dataKey="manutencao" stackId="a" fill={C.violet} name="Manutenção" />
                    <Bar dataKey="admin" stackId="a" fill={C.rose} name="Administrativas" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <SectionTitle badge={<HighlightBadge color={C.coral}>PICO EM MAI/25</HighlightBadge>}>Tarifas Públicas Detalhadas</SectionTitle>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={energiaData}>
                    <defs>
                      <linearGradient id="eG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.amber} stopOpacity={0.9} /><stop offset="100%" stopColor={C.amber} stopOpacity={0.5} /></linearGradient>
                      <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.sky} stopOpacity={0.9} /><stop offset="100%" stopColor={C.sky} stopOpacity={0.5} /></linearGradient>
                      <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.teal} stopOpacity={0.9} /><stop offset="100%" stopColor={C.teal} stopOpacity={0.5} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="month" tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600 }} axisLine={{ stroke: C.border }} />
                    <YAxis tickFormatter={fmtK} tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'Montserrat'" }} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600, color: C.textMuted }} />
                    <Bar dataKey="energia" fill="url(#eG)" name="Energia" radius={[4,4,0,0]} maxBarSize={28} />
                    <Bar dataKey="agua" fill="url(#aG)" name="Água/Esgoto" radius={[4,4,0,0]} maxBarSize={28} />
                    <Bar dataKey="gas" fill="url(#gG)" name="Gás" radius={[4,4,0,0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <SectionTitle>Top 10 — Manutenção (Acumulado Anual)</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                {[
                  { name: "Material p/ reforma", val: 3915.91 },
                  { name: "Manutenção Portão", val: 3640.50 },
                  { name: "Equip. Eletrônico (Inst./Manut.)", val: 2939.12 },
                  { name: "Desentupimento", val: 2450 },
                  { name: "Ar Condicionado", val: 2400 },
                  { name: "Material Eletrônico", val: 2219.50 },
                  { name: "Material de Limpeza", val: 1884.82 },
                  { name: "Jardinagem", val: 1750 },
                  { name: "Dedetização/Desratização", val: 1695 },
                  { name: "Material Elétrico", val: 1410.89 },
                ].map((item, i) => {
                  const pct = (item.val / 3915.91) * 100;
                  return (
                    <div key={i} style={{
                      background: C.surface, borderRadius: 8,
                      padding: "14px 18px", border: `1px solid ${C.border}`,
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{
                        position: "absolute", top: 0, left: 0, bottom: 0,
                        width: `${pct}%`, background: C.violet + "12",
                        borderRight: `2px solid ${C.violet}33`,
                      }} />
                      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ color: i < 3 ? C.highlight : C.textDim, fontFamily: "'Bebas Neue'", fontSize: 18, width: 24 }}>#{i + 1}</span>
                          <span style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{item.name}</span>
                        </div>
                        <span style={{ color: i < 3 ? C.highlight : C.textBright, fontWeight: 800, fontSize: 13, fontFamily: "'Bebas Neue'", letterSpacing: 1 }}>{fmt(item.val)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* =================== SALDO =================== */}
        {tab === "saldo" && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <KPI label="Saldo Inicial (Jan)" value={fmt(30342.28)} color={C.sky} />
              <KPI label="Saldo Final (Dez)" value={fmt(14643.05)} color={C.amber} alert />
              <KPI label="Redução no Período" value={fmt(30342.28 - 14643.05)} sub="-51,7% em 12 meses" color={C.coral} alert />
              <KPI label="Menor Saldo" value={fmt(13525.04)} sub="Novembro/2025" color={C.coral} alert />
            </div>

            <InsightBox icon="🚨" text={`O saldo caiu abaixo de R$ 15.000 em 3 meses (Set, Nov, Dez), indicando reserva financeira em nível crítico. O mês de Maio registrou a maior queda isolada: ${fmt(8546.31)} de déficit.`} color={C.coral} />

            <Card style={{ marginBottom: 24 }} glow={C.coralGlow}>
              <SectionTitle badge={<HighlightBadge color={C.coral}>ATENÇÃO: SALDO EM QUEDA</HighlightBadge>}>Saldo + Movimento Líquido</SectionTitle>
              <ResponsiveContainer width="100%" height={340}>
                <ComposedChart data={saldoData}>
                  <defs>
                    <linearGradient id="sG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.sky} stopOpacity={0.2} /><stop offset="100%" stopColor={C.sky} stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="month" tick={{ fill: C.textDim, fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600 }} axisLine={{ stroke: C.border }} />
                  <YAxis tickFormatter={fmtK} tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'Montserrat'" }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11, fontFamily: "'Montserrat'", fontWeight: 600, color: C.textMuted }} />
                  <ReferenceLine y={0} stroke={C.textDim} strokeDasharray="3 3" />
                  <ReferenceLine y={15000} stroke={C.coral} strokeDasharray="6 4" strokeOpacity={0.5} label={{ value: "Zona crítica", fill: C.coral, fontSize: 10, fontFamily: "'Montserrat'", fontWeight: 700 }} />
                  <Area type="monotone" dataKey="saldo" stroke={C.sky} fill="url(#sG2)" strokeWidth={3} name="Saldo Final"
                    dot={({ cx, cy, payload }) => {
                      const critical = payload.saldo < 15000;
                      return <circle cx={cx} cy={cy} r={critical ? 7 : 4} fill={critical ? C.coral : C.sky} stroke={critical ? "#fff" : C.sky} strokeWidth={critical ? 2 : 0} />;
                    }} />
                  <Bar dataKey="movLiquido" name="Mov. Líquido" radius={[4,4,0,0]} maxBarSize={24}>
                    {saldoData.map((entry, i) => (
                      <Cell key={i} fill={entry.movLiquido >= 0 ? C.emerald : C.coral} opacity={0.75} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionTitle>Resultado Mensal</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 8, marginTop: 8 }}>
                {rawData.map((d, i) => {
                  const mov = d.receitas - d.despesas;
                  const pos = mov >= 0;
                  const isCritical = Math.abs(mov) > 3000 && !pos;
                  return (
                    <div key={i} style={{
                      textAlign: "center", padding: "16px 6px", borderRadius: 10,
                      background: pos ? C.emeraldGlow : isCritical ? C.coralGlow : "rgba(244,63,94,0.05)",
                      border: `1px solid ${pos ? C.emerald + "33" : isCritical ? C.coral + "55" : C.coral + "22"}`,
                      boxShadow: isCritical ? `0 0 16px ${C.coral}22` : "none",
                    }}>
                      <p style={{ color: C.textBright, fontSize: 13, margin: 0, fontFamily: "'Bebas Neue'", letterSpacing: 1.5 }}>{MONTHS_SHORT[i]}</p>
                      <p style={{
                        color: pos ? C.emerald : C.coral,
                        fontSize: 13, fontWeight: 400, margin: "8px 0 0",
                        fontFamily: "'Bebas Neue'", letterSpacing: 1,
                      }}>
                        {pos ? "+" : ""}{(mov/1000).toFixed(1)}k
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* =================== TABELA =================== */}
        {tab === "tabela" && (
          <Card>
            <SectionTitle badge={<HighlightBadge color={C.sky}>12 MESES</HighlightBadge>}>Resumo Mensal Completo</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13, minWidth: 960 }}>
                <thead>
                  <tr>
                    {["Mês", "Saldo Anterior", "Receitas", "Despesas", "Mov. Líquido", "Saldo Final"].map((h, i) => (
                      <th key={h} style={{
                        padding: "14px 16px", textAlign: i === 0 ? "left" : "right",
                        color: C.textBright, fontWeight: 800, fontSize: 10,
                        textTransform: "uppercase", letterSpacing: 2,
                        fontFamily: "'Montserrat'",
                        borderBottom: `2px solid ${C.sky}`,
                        background: C.surface, position: "sticky", top: 0,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawData.map((d, i) => {
                    const mov = d.receitas - d.despesas;
                    const isCritical = mov < -3000;
                    return (
                      <tr key={i} style={{
                        background: isCritical ? C.coralGlow : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      }}>
                        <td style={{ padding: "12px 16px", fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: 1.5, color: C.textBright, borderBottom: `1px solid ${C.border}` }}>{d.month}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 500, color: C.textDim, borderBottom: `1px solid ${C.border}` }}>{fmt(d.saldoAnterior)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 700, color: C.emerald, borderBottom: `1px solid ${C.border}` }}>{fmt(d.receitas)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 700, color: C.coral, borderBottom: `1px solid ${C.border}` }}>{fmt(d.despesas)}</td>
                        <td style={{
                          padding: "12px 16px", textAlign: "right",
                          fontFamily: "'Montserrat'", fontWeight: 800,
                          color: mov >= 0 ? C.emerald : C.coral,
                          borderBottom: `1px solid ${C.border}`,
                          textShadow: isCritical ? `0 0 8px ${C.coral}44` : "none",
                        }}>
                          {mov >= 0 ? "+" : ""}{fmt(mov)}
                          {isCritical && <span style={{ marginLeft: 6, fontSize: 10, color: C.coral }}>⚠</span>}
                        </td>
                        <td style={{
                          padding: "12px 16px", textAlign: "right",
                          fontFamily: "'Montserrat'", fontWeight: 700,
                          color: d.saldoFinal < 15000 ? C.amber : C.textBright,
                          borderBottom: `1px solid ${C.border}`,
                        }}>
                          {fmt(d.saldoFinal)}
                          {d.saldoFinal < 15000 && <span style={{ marginLeft: 6, fontSize: 10, color: C.amber }}>●</span>}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: C.skyGlow }}>
                    <td style={{ padding: "16px", fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: C.textBright, borderTop: `2px solid ${C.sky}` }}>TOTAL 2025</td>
                    <td style={{ padding: "16px", textAlign: "right", color: C.textDim, borderTop: `2px solid ${C.sky}`, fontFamily: "'Montserrat'" }}>—</td>
                    <td style={{ padding: "16px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 800, color: C.emerald, borderTop: `2px solid ${C.sky}`, fontSize: 14 }}>{fmt(TOTALS.receitas)}</td>
                    <td style={{ padding: "16px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 800, color: C.coral, borderTop: `2px solid ${C.sky}`, fontSize: 14 }}>{fmt(TOTALS.despesas)}</td>
                    <td style={{ padding: "16px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 900, color: C.coral, borderTop: `2px solid ${C.sky}`, fontSize: 14 }}>{fmt(TOTALS.movLiquido)}</td>
                    <td style={{ padding: "16px", textAlign: "right", fontFamily: "'Montserrat'", fontWeight: 900, color: C.amber, borderTop: `2px solid ${C.sky}`, fontSize: 14 }}>{fmt(14643.05)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <p style={{ color: C.textDim, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Montserrat'" }}>
            Ampla Administradora de Condomínios — Av. Cesário Alvim, 3640 — CEP 38.400-696 — (34) 3211-8313
          </p>
        </div>
      </div>
    </div>
  );
}
