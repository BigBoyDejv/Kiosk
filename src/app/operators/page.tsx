'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { mockUsers, mockDevices, mockWorkstations } from '@/lib/mock-data';
import { User, Device } from '@/types';
import { 
  Users, 
  Plus, 
  CreditCard, 
  QrCode, 
  Tablet, 
  CheckCircle2, 
  Clock, 
  Languages, 
  Printer, 
  Key, 
  Wifi, 
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';

export default function OperatorsPage() {
  const [users, setUsers] = useState<User[]>(mockUsers.filter(u => u.role === 'operator'));
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedUserForQR, setSelectedUserForQR] = useState<User | null>(null);
  const [pairingNFCUser, setPairingNFCUser] = useState<User | null>(null);
  const [nfcSuccess, setNfcSuccess] = useState(false);

  const simulateNFCPairing = (user: User) => {
    setPairingNFCUser(user);
    setNfcSuccess(false);

    // Simulácia pípnutia NFC karty
    setTimeout(() => {
      setNfcSuccess(true);
      setTimeout(() => {
        setPairingNFCUser(null);
        setNfcSuccess(false);
      }, 1500);
    }, 2000);
  };

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
            <span className="text-slate-900 font-bold">Operátori, Kiosky & Identifikácia</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Web NFC & BarcodeDetector Ready
            </span>
          </div>
        </div>

        <main className="p-8 flex flex-col gap-6 max-w-7xl">
          {/* Header Title */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  Správa operátorov, zamestnaneckých kariet & Kioskov
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Párovanie NFC čipov, generovanie QR menoviek pre prednú kameru a správa tabletov Samsung Galaxy Tab A9+ pri linke.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Pridať operátora</span>
              </button>
            </div>
          </div>

          {/* Section 1: Operators and Badge Pairing Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Aktívni operátori zmeny ({users.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Priradenie NFC odznakov a QR menoviek pre bezklávesnicové prihlásenie
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Meno a priezvisko</th>
                    <th className="py-3 px-4">Osobné číslo</th>
                    <th className="py-3 px-4">Preferovaný jazyk</th>
                    <th className="py-3 px-4">NFC Identifikátor</th>
                    <th className="py-3 px-4">QR menovka</th>
                    <th className="py-3 px-4 text-right">Akcie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {user.full_name.charAt(0)}
                          </div>
                          <span>{user.full_name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {user.employee_no}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                          {user.preferred_lang}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {user.badge_hash ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <CreditCard className="w-4 h-4 text-emerald-600" />
                            <span className="font-mono text-[11px]">{user.badge_hash}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Nie je spárovaná</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setSelectedUserForQR(user)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Zobraziť QR</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => simulateNFCPairing(user)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pípnuť kartu</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Tablet Kiosks Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Autorizované tabletové kiosky pri linke
                </h2>
                <p className="text-xs text-slate-500">
                  Zariadenia bežiace v Kiosk režime s lokálnou Dexie.js pamäťou
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Zaregistrovať nový tablet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {devices.map((device, idx) => (
                <div
                  key={device.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                        <Tablet className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          {device.label}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {mockWorkstations[idx]?.name}
                        </span>
                      </div>
                    </div>

                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Posledná synchronizácia:</span>
                    <strong className="text-slate-800">{device.last_sync_at}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* NFC Pairing Modal Simulation */}
      {pairingNFCUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl border border-slate-200 flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              nfcSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600 animate-pulse'
            }`}>
              {nfcSuccess ? <CheckCircle2 className="w-8 h-8" /> : <CreditCard className="w-8 h-8" />}
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {nfcSuccess ? 'Karta úspešne spárovaná!' : 'Priložte kartu k čítačke'}
            </h3>
            
            <p className="text-xs text-slate-500 mt-1">
              Priraďujem zamestnaneckú kartu pre operátora <strong>{pairingNFCUser.full_name}</strong>.
            </p>

            {nfcSuccess ? (
              <span className="mt-3 px-3 py-1 rounded bg-emerald-50 text-emerald-700 font-mono text-xs font-bold">
                UID: 04A1B2C3D4 (Zaznamenané)
              </span>
            ) : (
              <span className="mt-3 text-[11px] text-slate-400">
                Web NFC API aktívne • Čakám na signál 13.56 MHz...
              </span>
            )}
          </div>
        </div>
      )}

      {/* QR Badge Modal */}
      {selectedUserForQR && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-xl border border-slate-200 flex flex-col items-center relative">
            <button
              onClick={() => setSelectedUserForQR(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Zamestnanecká menovka
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {selectedUserForQR.full_name}
            </h3>
            <span className="text-xs font-mono text-slate-500 mb-4">
              {selectedUserForQR.employee_no}
            </span>

            {/* Simulated QR Code Canvas */}
            <div className="w-44 h-44 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center text-white mb-4">
              <QrCode className="w-28 h-28" />
              <span className="font-mono text-[9px] mt-1 text-slate-300">
                {selectedUserForQR.qr_token}
              </span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Vytlačiť menovku</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
