import Dexie, { Table } from 'dexie';
import { SOP, SOPStep, User, TrainingLog } from '@/types';

export interface CachedVideoBlob {
  id: string; // step_id
  blob: Blob;
  updated_at: number;
}

export interface OfflineConfig {
  key: string;
  value: string;
}

export class IndustrialKioskDB extends Dexie {
  cached_sops!: Table<SOP, string>;
  cached_steps!: Table<SOPStep, string>;
  cached_users!: Table<User, string>;
  outbox_logs!: Table<TrainingLog, string>;
  cached_videos!: Table<CachedVideoBlob, string>;
  offline_config!: Table<OfflineConfig, string>;

  constructor() {
    super('IndustrialSOPKioskDB');
    this.version(1).stores({
      cached_sops: 'id, workstation_id, status, title',
      cached_steps: 'id, sop_version_id, step_order',
      cached_users: 'id, badge_hash, qr_token, full_name',
      outbox_logs: 'id, user_id, sop_version_id, started_at, synced_at',
      cached_videos: 'id, updated_at',
      offline_config: 'key'
    });
  }
}

export const kioskDB = new IndustrialKioskDB();

// Žiadosť o trvalé úložisko v Chrome na Androide (aby prehliadač nevymazal videá)
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      console.log(`[Storage] Persisted storage status: ${isPersisted}`);
      return isPersisted;
    } catch (e) {
      console.warn('[Storage] Could not persist storage', e);
      return false;
    }
  }
  return false;
}
