'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { mockTrainingLogs, mockSOPs } from '@/lib/mock-data';
import { 
  FileCheck2, 
  Download, 
  Printer, 
  Search, 
  ShieldCheck, 
  User, 
  Clock, 
  Award,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function AuditsPage() {
  const [selectedLog, setSelectedLog] = useState(mockTrainingLogs[0]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <Sidebar />

      <div className="pl-64 pt-16 flex-1 flex flex-col">
        {/* Header Breadcrumb */}
        <div className="w-full px-8 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-400">Kiosk Portal</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Protokoly & Audity zaškolenia</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              ISO 9001:2015 & IATF 16949:2016 Compliant
            </span>
          </div>
        </div>

        <main className="p-8 flex flex-col gap-6 max-w-7xl">
          {/* Header Action Bar */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <FileCheck2 className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  Auditné protokoly o zaškolení operátorov
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Nemenná auditná stopa pre audítorov kvality a BOZP technikov. Generovanie a tlač oficiálnych certifikátov.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Vytlačiť / Uložiť do PDF</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Protocols List (Left) + Detailed Certificate Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Logs Table */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <span className="font-bold text-xs text-slate-900 block">
                  Záznamy o zaškolení ({mockTrainingLogs.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  Kliknutím zobrazíte detailný certifikát
                </span>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
                {mockTrainingLogs.map((log) => {
                  const isSelected = selectedLog.id === log.id;
                  return (
                    <button
                      key={log.id}
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className={`w-full p-4 text-left transition-colors flex items-start justify-between gap-3 ${
                        isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {log.user?.full_name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {log.user?.employee_no}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 truncate max-w-[240px]">
                          {log.sop_title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                          <span>{new Date(log.started_at).toLocaleDateString('sk-SK')}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">{log.quiz_score}% OK</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.passed ? 'Schválené' : 'Opakovať'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Printable Audit Certificate */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-300 shadow-md p-8 flex flex-col justify-between print:border-none print:shadow-none">
              <div>
                {/* Official Certificate Header */}
                <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block">
                      OFICIÁLNY AUDITNÝ PROTOKOL
                    </span>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      PROTOKOL O ZAŠKOLENÍ OPERÁTORA VÝROBY
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                      Závod Trnava • Montážna linka 04 • Norma STN EN ISO 9001:2015, čl. 7.2
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                    ISO
                  </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Identifikácia pracovníka
                    </span>
                    <span className="font-bold text-sm text-slate-900 block">
                      {selectedLog.user?.full_name}
                    </span>
                    <span className="font-mono text-slate-600 block mt-0.5">
                      Osobné číslo: {selectedLog.user?.employee_no}
                    </span>
                    <span className="text-slate-500 block">
                      Jazyk zaškolenia: {selectedLog.lang.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Štandardný pracovný postup
                    </span>
                    <span className="font-bold text-xs text-slate-900 block">
                      {selectedLog.sop_title}
                    </span>
                    <span className="font-mono text-blue-700 font-bold block mt-0.5">
                      Verzia: 2.0 (Nemenná auditná revízia)
                    </span>
                    <span className="text-slate-500 block">
                      Stanica: Lis 04 - Dverový modul
                    </span>
                  </div>
                </div>

                {/* Audit Metrics Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs mb-6">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 font-bold text-slate-700 text-[11px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Parameter auditu</th>
                        <th className="py-2.5 px-3">Zaznamenaná hodnota</th>
                        <th className="py-2.5 px-3 text-right">Hodnotenie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-2.5 px-3 font-medium">Výsledok kontrolného kvízu</td>
                        <td className="py-2.5 px-3 font-mono font-bold">{selectedLog.quiz_score}% správne</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">VYHOVEL</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium">Celkový čas zaškolenia</td>
                        <td className="py-2.5 px-3 font-mono">49 sekúnd (takt linky: 54s)</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">V NORME</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium">SOS privolania majstra</td>
                        <td className="py-2.5 px-3 font-mono">{selectedLog.sos_events.length} incidentov</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">OK</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium">Spôsob autorizácie</td>
                        <td className="py-2.5 px-3 font-mono">NFC zamestnanecká karta (UID overené)</td>
                        <td className="py-2.5 px-3 text-right text-blue-700 font-bold">OVERENÉ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Verification Statement */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Doložka o právnej a technickej záväznosti</span>
                  </div>
                  <p>
                    Tento záznam bol automaticky vygenerovaný a časovo označený systémom SOP Kiosk na autorizovanom priemyselnom tablete. V súlade s normou IATF 16949 je záznam archivovaný v nemenných databázach po dobu minimálne 3 rokov.
                  </p>
                </div>
              </div>

              {/* Signatures Footer */}
              <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-6">Digitálne overenie operátora:</span>
                  <div className="border-b border-slate-400 pb-1 font-mono text-[11px] font-bold">
                    PÍPNUTÉ NFC KARTOU ({selectedLog.user?.employee_no})
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-6">Podpis majstra zmeny:</span>
                  <div className="border-b border-slate-400 pb-1 font-semibold text-slate-900">
                    Peter Horváth (Majster zmeny A)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
