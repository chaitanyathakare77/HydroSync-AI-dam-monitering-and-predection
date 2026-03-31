'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import Sidebar from '../components/Sidebar';
import {
    ComposedChart,
    Area,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ReferenceArea,
    ResponsiveContainer,
    Brush,
} from 'recharts';

// ── Constants ──────────────────────────────────────────────────────────────────
const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_OPTIONS = MONTHS.map((m, i) => ({ label: m, value: i + 1 }));

// Monsoon = June (6) to September (9) each year
const MONSOON_BANDS = YEARS.map(y => ({
    start: new Date(`${y}-06-01`).getTime(),
    end: new Date(`${y}-09-30`).getTime(),
}));

const FRL = 463.91;

const SEASONS = [
    { label: 'All Year', mFrom: 1, mTo: 12 },
    { label: 'Monsoon', mFrom: 6, mTo: 9 },
    { label: 'Post-Monsoon', mFrom: 10, mTo: 12 },
    { label: 'Winter', mFrom: 1, mTo: 3 },
    { label: 'Pre-Monsoon', mFrom: 4, mTo: 5 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function parseDateDMY(value) {
    if (!value) return null;
    const parts = value.split('-').map(p => p.trim());
    if (parts.length === 3) {
        const [d, m, y] = parts;
        const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
        if (!isNaN(date.getTime())) return date;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
}

function filterDataset(data, yFrom, yTo, mFrom, mTo) {
    return data.filter(r => {
        const y = r.dateObj.getFullYear();
        const m = r.dateObj.getMonth() + 1;
        return y >= yFrom && y <= yTo && m >= mFrom && m <= mTo;
    });
}

function fmt(v, digits = 2) {
    return v == null ? '—' : Number(v).toFixed(digits);
}

function fmtDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function computeStats(data) {
    const peakIn = Math.max(0, ...data.map(r => r.inflowMm3 ?? 0));
    const peakOut = Math.max(0, ...data.map(r => r.outflowMm3 ?? 0));
    const avgRain = data.length
        ? data.reduce((s, r) => s + (r.rainfall ?? 0), 0) / data.length
        : 0;
    const surplus = data.filter(r => r.inflowMm3 != null && r.outflowMm3 != null && r.inflowMm3 > r.outflowMm3).length;
    const deficit = data.filter(r => r.inflowMm3 != null && r.outflowMm3 != null && r.inflowMm3 < r.outflowMm3).length;
    return { peakIn, peakOut, avgRain, surplus, deficit, total: data.length };
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, unit }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8,
            padding: '8px 12px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,.1)',
        }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: '#333' }}>{fmtDate(label)}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                    <span>{p.name}</span>
                    <strong>{fmt(p.value)} {unit}</strong>
                </div>
            ))}
        </div>
    );
}

// ── Monsoon ReferenceAreas for a Recharts chart ────────────────────────────────
function MonsoonRefs({ data }) {
    // Only render bands that overlap the current data's time range
    if (!data.length) return null;
    const minTs = data[0].ts;
    const maxTs = data[data.length - 1].ts;
    return (
        <>
            {MONSOON_BANDS.map((b, i) => {
                if (b.end < minTs || b.start > maxTs) return null;
                return (
                    <ReferenceArea
                        key={i}
                        x1={Math.max(b.start, minTs)}
                        x2={Math.min(b.end, maxTs)}
                        fill="#2196f3"
                        fillOpacity={0.07}
                        ifOverflow="hidden"
                    />
                );
            })}
        </>
    );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, color }) {
    return (
        <div style={{
            flex: '1 1 140px', minWidth: 130, maxWidth: 220,
            background: '#fff', border: '1px solid #e8eaf0',
            borderTop: `3px solid ${color}`, borderRadius: 10,
            padding: '12px 16px',
        }}>
            <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                {label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{unit}</div>
        </div>
    );
}

// ── Select ─────────────────────────────────────────────────────────────────────
function Sel({ label, value, onChange, options }) {
    return (
        <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, color: '#666' }}>
            {label}
            <select
                value={value}
                onChange={e => onChange(+e.target.value)}
                style={{
                    padding: '5px 10px', borderRadius: 6, border: '1px solid #d0d5e0',
                    fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none',
                }}
            >
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </label>
    );
}

// ── Chart Card ─────────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children }) {
    return (
        <div style={{
            background: '#fff', border: '1px solid #e8eaf0', borderRadius: 12,
            padding: '20px 24px', marginBottom: 16,
        }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: '#1a1a2e' }}>{title}</div>
            {subtitle && (
                <div style={{ fontSize: 11, color: '#999', marginBottom: 12 }}>{subtitle}</div>
            )}
            {children}
        </div>
    );
}

// ── X-axis tick formatter ──────────────────────────────────────────────────────
function xTickFormatter(ts) {
    const d = new Date(ts);
    return d.getDate() === 1 && d.getMonth() === 0
        ? d.getFullYear().toString()
        : MONTHS[d.getMonth()];
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function JayakwadiDashboard() {
    const [user, setUser] = React.useState(null);
    const [activeKey, setActiveKey] = React.useState("visualize");
    const router = useRouter();

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    localStorage.removeItem("token");
                    router.push("/login");
                } else {
                    setUser(data);
                }
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleNavClick = (item) => {
        setActiveKey(item.key);
        if (item.key !== "visualize") {
            router.push(item.href);
        }
    };

    const [rawData, setRawData] = React.useState([]);
    const [yFrom, setYFrom] = React.useState(2016);
    const [yTo, setYTo] = React.useState(2025);
    const [mFrom, setMFrom] = React.useState(1);
    const [mTo, setMTo] = React.useState(12);
    const [season, setSeason] = React.useState('All Year');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Load CSV once
    React.useEffect(() => {
        fetch('/csv/jayakwadi_with_outflow.csv')
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then(text => {
                Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    complete: ({ data }) => {
                        const parsed = data.map(row => {
                            const dateObj = parseDateDMY(row['Date']);
                            const inflow = parseFloat(row['Inflow (m3/day)']);
                            const outflow = parseFloat(row['Estimated_Outflow_m3_day']);
                            const rainfall = parseFloat(row['avg_rainfall']);
                            const waterLevel = parseFloat(row['Water_Level_m']);
                            return {
                                dateObj,
                                ts: dateObj?.getTime() ?? null,
                                label: dateObj?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) ?? '',
                                inflowMm3: isFinite(inflow) ? inflow / 1e6 : null,
                                outflowMm3: isFinite(outflow) ? outflow / 1e6 : null,
                                rainfall: isFinite(rainfall) ? rainfall : null,
                                waterLevelM: isFinite(waterLevel) ? waterLevel : null,
                            };
                        }).filter(r => r.dateObj && !isNaN(r.ts));
                        setRawData(parsed);
                        setLoading(false);
                    },
                    error: err => { setError(err.message); setLoading(false); },
                });
            })
            .catch(e => { setError(e.message); setLoading(false); });
    }, []);

    const filtered = React.useMemo(
        () => filterDataset(rawData, yFrom, yTo, mFrom, mTo),
        [rawData, yFrom, yTo, mFrom, mTo]
    );

    const stats = React.useMemo(() => computeStats(filtered), [filtered]);

    function applySeason(s) {
        setSeason(s.label);
        setMFrom(s.mFrom);
        setMTo(s.mTo);
    }

    const yearOptions = YEARS.map(y => ({ label: y, value: y }));
    const monthOptions = MONTH_OPTIONS;

    // Common axis / chart props
    const commonMargin = { top: 10, right: 16, left: 10, bottom: 0 };
    const xAxisProps = {
        dataKey: 'ts',
        type: 'number',
        scale: 'time',
        domain: ['dataMin', 'dataMax'],
        tickFormatter: xTickFormatter,
        tick: { fontSize: 11, fill: '#888' },
        tickCount: 8,
    };

    if (!user)
        return (
            <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 text-blue-600">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-sm tracking-widest uppercase opacity-70">Loading Visualize…</span>
                </div>
            </div>
        );

    return (
        <div className="flex h-screen w-full overflow-hidden bg-linear-to-br from-gray-50 to-blue-50 font-sans text-gray-900">
            <Sidebar activeKey={activeKey} onNavClick={handleNavClick} user={user} onLogout={handleLogout} />
            <main className="relative flex-1 overflow-auto">
                <div style={{ background: '#f5f7fa', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

            {/* Header */}
            <div style={{
                background: '#fff', borderBottom: '1px solid #e8eaf0',
                padding: '14px 32px', display: 'flex', flexDirection: 'column', gap: 2,
            }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#1976d2' }}>
                    Jayakwadi Dam — Flow Explorer
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                    Inflow · Outflow · Rainfall &nbsp;|&nbsp; Maharashtra, India &nbsp;|&nbsp;
                    {loading ? 'Loading…' : `${filtered.length} days selected`}
                </div>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: 60, fontSize: 15, color: '#888' }}>
                    Loading CSV data…
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', padding: 40, color: '#c62828', fontSize: 14 }}>
                    Error loading data: {error}
                </div>
            )}

            {!loading && !error && (
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px' }}>

                    {/* Stat Cards */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                        <StatCard label="Peak Inflow" value={fmt(stats.peakIn)} unit="Mm³/day" color="#1976d2" />
                        <StatCard label="Peak Outflow" value={fmt(stats.peakOut)} unit="Mm³/day" color="#e53935" />
                        <StatCard label="Avg Rainfall" value={fmt(stats.avgRain)} unit="mm/day" color="#388e3c" />
                        <StatCard label="Surplus Days" value={stats.surplus} unit="inflow > outflow" color="#f57c00" />
                        <StatCard label="Deficit Days" value={stats.deficit} unit="inflow < outflow" color="#7b1fa2" />
                    </div>

                    {/* Filter Panel */}
                    <div style={{
                        background: '#fff', border: '1px solid #e8eaf0', borderRadius: 12,
                        padding: '18px 24px', marginBottom: 20,
                    }}>
                        <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                            Filters &amp; Controls
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 14 }}>
                            <Sel label="From Year" value={yFrom} onChange={setYFrom} options={yearOptions} />
                            <Sel label="To Year" value={yTo} onChange={setYTo} options={yearOptions} />
                            <Sel label="From Month" value={mFrom} onChange={v => { setMFrom(v); setSeason(''); }} options={monthOptions} />
                            <Sel label="To Month" value={mTo} onChange={v => { setMTo(v); setSeason(''); }} options={monthOptions} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: '#aaa', marginRight: 4 }}>Quick season:</span>
                            {SEASONS.map(s => (
                                <button
                                    key={s.label}
                                    onClick={() => applySeason(s)}
                                    style={{
                                        padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                                        border: season === s.label ? 'none' : '1px solid #d0d5e0',
                                        background: season === s.label ? '#1976d2' : '#fff',
                                        color: season === s.label ? '#fff' : '#555',
                                        fontWeight: season === s.label ? 600 : 400,
                                        transition: 'all .15s',
                                    }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Chart 1: Inflow ── */}
                    <ChartCard
                        title="Daily Inflow (Mm³/day)"
                        subtitle="Blue shaded bands = Monsoon season (Jun–Sep) | Use brush slider below chart to zoom & pan"
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={filtered} margin={commonMargin}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <MonsoonRefs data={filtered} />
                                <XAxis {...xAxisProps} />
                                <YAxis
                                    tickFormatter={v => v.toFixed(0)}
                                    tick={{ fontSize: 11, fill: '#888' }}
                                    width={55}
                                    label={{ value: 'Mm³/day', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: '#aaa' } }}
                                />
                                <Tooltip content={<CustomTooltip unit="Mm³" />} labelFormatter={fmtDate} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Area
                                    type="monotone"
                                    dataKey="inflowMm3"
                                    name="Inflow"
                                    stroke="#1976d2"
                                    fill="#1976d2"
                                    fillOpacity={0.15}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                    connectNulls={true}
                                />
                                <Brush
                                    dataKey="ts"
                                    height={24}
                                    stroke="#1976d2"
                                    tickFormatter={xTickFormatter}
                                    travellerWidth={8}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartCard>



                    {/* ── Chart 3: Date vs Water Level ── */}
                    <ChartCard
                        title="Water Level (m)"
                        subtitle="Daily reservoir water level | FRL = 463.91 m (dashed red line) | Use brush slider to zoom & pan"
                    >
                        <ResponsiveContainer width="100%" height={320}>
                            <ComposedChart data={filtered} margin={commonMargin}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis {...xAxisProps} />
                                <YAxis
                                    tickFormatter={v => v.toFixed(1)}
                                    tick={{ fontSize: 11, fill: '#888' }}
                                    width={60}
                                    domain={['auto', 'auto']}
                                    label={{ value: 'Level (m)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: '#aaa' } }}
                                />
                                <Tooltip content={<CustomTooltip unit="m" />} labelFormatter={fmtDate} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <ReferenceLine
                                    y={FRL}
                                    stroke="#e53935"
                                    strokeDasharray="6 3"
                                    strokeWidth={1.5}
                                    label={{ value: 'FRL 463.91 m', position: 'insideTopRight', fontSize: 10, fill: '#e53935', fontWeight: 600 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="waterLevelM"
                                    name="Water Level"
                                    stroke="#0288d1"
                                    strokeWidth={1.8}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                    connectNulls={true}
                                />
                                <Brush
                                    dataKey="ts"
                                    height={24}
                                    stroke="#0288d1"
                                    tickFormatter={xTickFormatter}
                                    travellerWidth={8}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* ── Chart 4: Rainfall ── */}
                    <ChartCard
                        title="Daily Rainfall (mm/day)"
                        subtitle="Average catchment rainfall contributing to reservoir inflow"
                    >
                        <ResponsiveContainer width="100%" height={240}>
                            <ComposedChart data={filtered} margin={commonMargin}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis {...xAxisProps} />
                                <YAxis
                                    tickFormatter={v => `${v}`}
                                    tick={{ fontSize: 11, fill: '#888' }}
                                    width={55}
                                    label={{ value: 'mm', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: '#aaa' } }}
                                />
                                <Tooltip
                                    content={<CustomTooltip unit="mm" />}
                                    labelFormatter={fmtDate}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar
                                    dataKey="rainfall"
                                    name="Rainfall"
                                    fill="#388e3c"
                                    fillOpacity={0.7}
                                    maxBarSize={4}
                                />
                                <Brush
                                    dataKey="ts"
                                    height={24}
                                    stroke="#388e3c"
                                    tickFormatter={xTickFormatter}
                                    travellerWidth={8}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* ── Chart 2: Outflow ── */}
                    <ChartCard
                        title="Daily Estimated Outflow (Mm³/day)"
                        subtitle="Blue shaded bands = Monsoon season (Jun–Sep) | Use brush slider below chart to zoom & pan"
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={filtered} margin={commonMargin}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <MonsoonRefs data={filtered} />
                                <XAxis {...xAxisProps} />
                                <YAxis
                                    tickFormatter={v => v.toFixed(0)}
                                    tick={{ fontSize: 11, fill: '#888' }}
                                    width={55}
                                    label={{ value: 'Mm³/day', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: '#aaa' } }}
                                />
                                <Tooltip content={<CustomTooltip unit="Mm³" />} labelFormatter={fmtDate} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Area
                                    type="monotone"
                                    dataKey="outflowMm3"
                                    name="Estimated Outflow"
                                    stroke="#e53935"
                                    fill="#e53935"
                                    fillOpacity={0.15}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                    connectNulls={true}
                                />
                                <Brush
                                    dataKey="ts"
                                    height={24}
                                    stroke="#e53935"
                                    tickFormatter={xTickFormatter}
                                    travellerWidth={8}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <div style={{ textAlign: 'center', fontSize: 11, color: '#ccc', marginTop: 8 }}>
                        Source: Jayakwadi Dam CSV records &nbsp;·&nbsp; Built with Recharts (free, open-source)
                    </div>
                </div>
            )}
        </div>
    </main>
</div>
);
}