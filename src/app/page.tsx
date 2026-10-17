'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { 
  mockWorkstations, 
  mockSOPs, 
  mockTrainingLogs, 
  mockSOSIncidents,
  mockUsers,
  mockDevices
} from '@/lib/mock-data';
import { supabase, fetchFromSupabaseOrFallback } from '@/lib/supabase';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  Tablet, 
  Video, 
  ChevronRight, 
  BookOpen, 
  GraduationCap, 
  CheckCheck, 
  AlertCircle, 
  TrendingUp, 
  UserCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const [activeSOS, setActiveSOS] = useState(mockSOSIncidents);
  const [sops, setSops] = useState(mockSOPs);
  const [trainingLogs, setTrainingLogs] = useState(mockTrainingLogs);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeSOSCount={0} />
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-64 pt-16 flex-1 flex flex-col">
        {/* Subheader Breadcrumbs and Line Metrics */}
        <div className="w-full px-8 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-400">Kiosk Portal</span>
            <span>/</span>
            <span className="text-slate-400">Závod Trnava</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Linka 04 (Aktuálna zmena)</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Taktový cieľ: <strong className="text-slate-900 font-bold">54s</strong></span>
            <span className="text-slate-300">|</span>
            <span>OEE Linky: <strong className="text-emerald-700 font-bold">92.4%</strong></span>
            <span className="text-slate-300">|</span>
            <span>Kiosky v prevádzke: <strong className="text-blue-700 font-bold">3 / 3 online</strong></span>
          </div>
        </div>

        <main className="p-8 flex flex-col gap-6 max-w-7xl">
          {/* Operational Shift Header Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">
                    Riadiaci pult majstra
                  </h1>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Linka v norme
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Zmena A • Ranná (06:00 - 14:00) • Taktový čas: 54s • Zodpovedný: Peter Horváth
                </p>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/audits"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export zmeny do PDF</span>
              </Link>
              
              <Link
                href="/operators"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Tablet className="w-4 h-4" />
                <span>Spárovať nový tablet</span>
              </Link>

              <Link
                href="/sops/editor"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Video className="w-4 h-4" />
                <span>Nahrať nové video (45s)</span>
              </Link>
            </div>
          </div>

          {/* Resolved SOS Incident Callout Strip */}
          {activeSOS.map((incident) => (
            <div
              key={incident.id}
              className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 pl-6 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-sm"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
              
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      SOS privolanie na {incident.workstation_name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800">
                      Vyriešené majstrom
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Operátor: <strong>{incident.operator_name}</strong> • Krok {incident.step_order}: {incident.step_title} • {incident.created_at} (Trvanie zásahu: {Math.floor(incident.duration_sec! / 60)}m {incident.duration_sec! % 60}s)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 md:mt-0 text-xs text-slate-500">
                <span>Protokol #{incident.id}</span>
                <ChevronRight className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
          ))}

          {/* Primary Key Performance Indicators (5 Metric Bento Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Metric 1: Aktívne SOP */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Aktívne SOP
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 font-mono">18</span>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span className="text-emerald-700 font-bold">100% platné</span>
                  <span className="text-slate-400">• 0 v revízii</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Metric 2: Prebiehajúce zaškolenia */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  V zaškoľovaní
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-blue-600 font-mono">4</span>
                  <span className="text-xs text-slate-500">/ 6 operátorov</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Linka 04 beží plynule
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '66%' }} />
              </div>
            </div>

            {/* Metric 3: Úspešnosť kvízov */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Kvíz 1. pokus
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <CheckCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 font-mono">94.2%</span>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  +3.1% oproti papierovým SOP
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            {/* Metric 4: SOS za zmenu */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  SOS za zmenu
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 font-mono">1</span>
                <div className="text-xs text-slate-500 mt-1">
                  1 vyriešené • 0 čaká
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Metric 5: Priemerný čas zaškolenia */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Takt zaškolenia
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 font-mono">48.5s</span>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  Cieľ 54s splnený (-5.5s)
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          {/* Workstations Operational Grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Stav pracovných staníc & Kioskov linky
                </h2>
                <p className="text-xs text-slate-500">
                  Prehľad pripojených tabletov Samsung Galaxy Tab A9+ a aktívnych operátorov
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Všetky stanice pripravené
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Stanica & Stroj</th>
                    <th className="py-3 px-4">Aktívny operátor</th>
                    <th className="py-3 px-4">Priradený SOP postup</th>
                    <th className="py-3 px-4">Jazyk</th>
                    <th className="py-3 px-4">Stav tabletu</th>
                    <th className="py-3 px-4">Kvíz skóre</th>
                    <th className="py-3 px-4 text-right">Akcia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {mockWorkstations.map((ws, idx) => {
                    const assignedSop = mockSOPs[idx % mockSOPs.length];
                    const operator = mockUsers[(idx + 1) % mockUsers.length];
                    const device = mockDevices[idx % mockDevices.length];

                    return (
                      <tr key={ws.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{ws.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            QR: {ws.qr_code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                              {operator.full_name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                {operator.full_name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {operator.employee_no}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800 block truncate max-w-xs">
                            {assignedSop?.title}
                          </span>
                          <span className="text-[10px] text-blue-600 font-semibold">
                            v{assignedSop?.current_version?.version}.0 • {assignedSop?.current_version?.estimated_time_sec}s takt
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {operator.preferred_lang}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Online (Dexie sync)</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {device?.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            100% OK
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href="/kiosk"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                          >
                            <span>Náhľad kiosku</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Training Logs & Recent Audits */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Posledné dokončené zaškolenia operátorov (Auditná stopa)
                </h2>
                <p className="text-xs text-slate-500">
                  Nemenný záznam absolvovaných SOP krokov a výsledkov kvízov pre ISO/IATF audit
                </p>
              </div>

              <Link
                href="/audits"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Zobraziť všetky protokoly</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {trainingLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">
                          {log.user?.full_name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {log.user?.employee_no}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                          {log.lang}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {log.sop_title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-500">
                      Čas: <strong>49.5s</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                      Kvíz: {log.quiz_score}% OK
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(log.completed_at || log.started_at).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
