"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { AlertTriangle, Droplets, Calendar, Activity, Loader2 } from 'lucide-react';
import Sidebar from "../components/Sidebar";

export default function PredictionsPage() {
  const [user, setUser] = useState(null);
  const [activeKey, setActiveKey] = useState("predictions");
  const router = useRouter();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Using 127.0.0.1 instead of localhost for Windows compatibility
  const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || "http://127.0.0.1:5000/api/predict";

  // Auth & Profile Check (Consistent with Dashboard)
  useEffect(() => {
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
  }, [router]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const response = await fetch(ML_API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch prediction data.');
        }

        setPredictions(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError(err.message || "Could not connect to ML Engine API. Please ensure the backend is running.");
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [ML_API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleNavClick = (item) => {
    setActiveKey(item.key);
    router.push(item.href);
  };

  // Aggregate some metrics
  const totalRiskDays = predictions?.reduce((acc, curr) => acc + (curr.risk_days || 0), 0) || 0;
  const maxRiskMonth = predictions?.reduce((prev, current) => (prev.risk_days > current.risk_days) ? prev : current, {})?.month || "N/A";

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-blue-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm tracking-widest uppercase opacity-70">Securing Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] font-sans text-slate-900 italic-text-none">
      
      {/* ── Sidebar ── */}
      <Sidebar 
        activeKey={activeKey} 
        onNavClick={handleNavClick} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* ── Main Content Area ── */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        
        {/* Header Section with Neon accents */}
        <div className="max-w-7xl mx-auto mb-12 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400 opacity-10 blur-3xl rounded-full"></div>
          <div className="absolute -top-5 right-0 w-64 h-64 bg-cyan-400 opacity-10 blur-3xl rounded-full"></div>
          
          <div className="relative">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-700">
              2026 High-Risk Forecast
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
              Targeted AI analysis focusing exclusively on projected overflow windows. 
              <span className="block mt-1 font-medium text-blue-600">Months with zero projected risk are automatically excluded for clarity.</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-10 mb-20">
          
          {/* Loading State - Modern Pulse */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-96 bg-white/50 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-slate-200/50">
              <div className="relative">
                 <div className="absolute inset-0 rounded-full bg-blue-400 blur-md animate-ping opacity-25"></div>
                 <Loader2 className="h-12 w-12 text-blue-600 animate-spin relative" />
              </div>
              <p className="text-slate-500 font-semibold mt-6 tracking-wide uppercase text-xs">Processing ML Models...</p>
            </div>
          )}

          {/* Error State - Glassmorphism Red */}
          {!loading && error && (
            <div className="bg-red-50/80 backdrop-blur-md border border-red-100 p-8 rounded-3xl shadow-lg flex items-start gap-4">
              <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-200">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-red-900 font-bold text-xl mb-1">API Node Offline</h3>
                <p className="text-red-700 leading-relaxed">{error}</p>
                <div className="mt-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                   <code className="bg-red-100 px-2 py-0.5 rounded text-xs text-red-800 font-mono italic-none">{ML_API_URL}</code>
                </div>
              </div>
            </div>
          )}

          {/* Data Cards */}
          {!loading && !error && predictions.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/50">
                  <div className="absolute -right-2 -top-2 w-24 h-24 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-5">
                     <div className="bg-red-100 p-4 rounded-2xl text-red-600 transition-colors group-hover:bg-red-500 group-hover:text-white">
                      <AlertTriangle size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Risk Days</p>
                      <p className="text-4xl font-black text-slate-800 mt-1">{totalRiskDays}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/50">
                  <div className="absolute -right-2 -top-2 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-5">
                    <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <Calendar size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Peak Risk Month</p>
                      <p className="text-4xl font-black text-slate-800 mt-1">{maxRiskMonth}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/50">
                  <div className="absolute -right-2 -top-2 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-5">
                    <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                      <Activity size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Engine</p>
                      <p className="text-4xl font-black text-slate-800 mt-1 uppercase tracking-tighter">Live</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                     <span className="w-1.5 h-8 bg-red-500 rounded-full"></span> Overflow Risk Distribution
                  </h2>
                  <div className="h-80 w-full italic-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={predictions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                            <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}}
                        />
                        <Bar 
                          dataKey="risk_days" 
                          fill="url(#barGradient)" 
                          radius={[8, 8, 8, 8]} 
                          name="Risk Days"
                          barSize={40}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                     <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span> Probability Curve
                  </h2>
                  <div className="h-80 w-full italic-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="probability_percent" 
                          stroke="#3b82f6" 
                          strokeWidth={4} 
                          dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} 
                          activeDot={{ r: 9, strokeWidth: 0, shadow: '0 0 10px rgba(59, 130, 246, 0.5)' }} 
                          name="Chance (%)"
                          animationDuration={2000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Filtered Results Grid */}
              <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-slate-800 px-2 italic-none">High-Risk Windows Identified</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   {predictions.filter(row => (row.risk_days || 0) > 0).map((row, idx) => (
                     <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-2xl font-bold text-slate-800">{row.month}</span>
                          <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wider uppercase">
                            {row.total_days} Days Analysis
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-red-50 p-4 rounded-2xl">
                            <span className="text-red-700 font-semibold">Projected Overflow</span>
                            <span className="text-2xl font-black text-red-600">{row.risk_days} Days</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-3 bg-slate-50 rounded-2xl">
                               <p className="text-[10px] uppercase font-bold text-slate-400">Average Chance</p>
                               <p className="text-xl font-bold text-slate-700">{row.probability_percent}%</p>
                             </div>
                             <div className="p-3 bg-slate-50 rounded-2xl">
                               <p className="text-[10px] uppercase font-bold text-slate-400">Safe Status</p>
                               <p className="text-xl font-bold text-green-600">{row.safe_days} Days</p>
                             </div>
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </>
          )}

          {/* Empty State when no risks found */}
          {!loading && !error && predictions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] shadow-xl border border-slate-50 text-center">
              <div className="bg-green-50 p-8 rounded-full mb-6">
                <Droplets className="h-16 w-16 text-green-500 animate-bounce" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4">Zero Risk Detected</h2>
              <p className="text-slate-500 text-lg max-w-md">Our ML engine predicts safe water levels across all upcoming windows. No overflow events are currently projected based on 2026 data.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
