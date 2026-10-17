'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { mockSOPs, mockWorkstations } from '@/lib/mock-data';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  History, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Video,
  Languages
} from 'lucide-react';

export default function SOPCatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedStationFilter, setSelectedStationFilter] = useState('all');

  const filteredSops = mockSOPs.filter((sop) => {
    const matchesSearch = sop.title.toLowerCase().includes(search.toLowerCase());
    const matchesStation = selectedStationFilter === 'all' || sop.workstation_id === selectedStationFilter;
    return matchesSearch && matchesStation;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <Sidebar />

      <div className="pl-64 pt-16 flex-1 flex flex-col">
        {/* Breadcrumb Header */}
        <div className="w-full px-8 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-400">Kiosk Portal</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Katalóg SOP & Auditné verzie</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              IATF 16949 / ISO 9001 Audit Ready
            </span>
          </div>
        </div>

        <main className="p-8 flex flex-col gap-6 max-w-7xl">
          {/* Header Action Bar */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  Katalóg štandardných postupov & Verzie
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Centrálny register overených pracovných inštrukcií s nemennou auditnou históriou zmien pre výrobné linky.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/sops/editor"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nový postup (z 45s videa)</span>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Hľadať postup podľa názvu, kódu alebo operácie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Filter stanice:</span>
              <select
                value={selectedStationFilter}
                onChange={(e) => setSelectedStationFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800"
              >
                <option value="all">Všetky stanice linky</option>
                {mockWorkstations.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SOP Cards Grid */}
          <div className="space-y-4">
            {filteredSops.map((sop) => (
              <div
                key={sop.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {sop.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {sop.status === 'published' ? 'Platná verzia' : 'V revízii'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-700">
                        v{sop.current_version?.version}.0
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                      <span className="font-semibold text-slate-700">
                        {sop.workstation?.name}
                      </span>
                      <span>•</span>
                      <span>
                        Takt: <strong className="text-slate-800">{sop.current_version?.estimated_time_sec}s</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Krokov: <strong className="text-slate-800">{sop.current_version?.steps?.length || 3}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Languages className="w-3.5 h-3.5" /> SK, UK, SR, EN
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Schválené: {sop.current_version?.published_by || 'Peter Horváth'} • {new Date(sop.created_at).toLocaleDateString('sk-SK')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center">
                  <Link
                    href="/kiosk"
                    className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Otestovať v kiosku</span>
                  </Link>

                  <Link
                    href="/sops/editor"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Upraviť / Nová verzia</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
