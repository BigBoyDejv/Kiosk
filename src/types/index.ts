// TypeScript modely pre SOP Kiosk Onboarding Platformu

export type UserRole = 'admin' | 'foreman' | 'operator';
export type SOPStatus = 'draft' | 'processing' | 'review' | 'published' | 'archived';
export type JobStatus = 'queued' | 'transcribing' | 'structuring' | 'cutting' | 'done' | 'failed';

export interface Organization {
  id: string;
  name: string;
  subscription_tier: string;
  supported_languages: string[];
  created_at: string;
}

export interface User {
  id: string;
  org_id: string;
  auth_user_id?: string;
  full_name: string;
  employee_no?: string;
  role: UserRole;
  preferred_lang: string;
  badge_hash?: string;
  qr_token?: string;
  active: boolean;
  created_at: string;
}

export interface Workstation {
  id: string;
  org_id: string;
  name: string;
  qr_code: string;
  created_at: string;
}

export interface Device {
  id: string;
  org_id: string;
  workstation_id?: string;
  label: string;
  secret_hash: string;
  last_sync_at?: string;
  revoked: boolean;
  created_at: string;
}

export interface StepTranslation {
  title: string;
  bullets: string[];
  safety: string;
}

export interface QuizQuestionI18n {
  question: string;
  options: string[];
}

export interface QuizQuestion {
  type: 'multiple_choice' | 'photo_ab';
  correct_index: number;
  i18n: Record<string, QuizQuestionI18n>;
}

export interface SOPStep {
  id: string;
  org_id: string;
  sop_version_id: string;
  step_order: number;
  start_time: number;
  end_time: number;
  video_key?: string;
  video_url?: string;
  video_bytes?: number;
  image_ok_key?: string;
  image_ok_url?: string;
  image_nok_key?: string;
  image_nok_url?: string;
  translations: Record<string, StepTranslation>;
  quiz_question?: QuizQuestion;
  created_at?: string;
}

export interface SOPVersion {
  id: string;
  org_id: string;
  sop_id: string;
  version: number;
  estimated_time_sec: number;
  source_video_key?: string;
  transcript?: any;
  published_at?: string;
  published_by?: string;
  steps?: SOPStep[];
  created_at: string;
}

export interface SOP {
  id: string;
  org_id: string;
  workstation_id: string;
  title: string;
  status: SOPStatus;
  current_version_id?: string;
  current_version?: SOPVersion;
  workstation?: Workstation;
  created_by?: string;
  created_at: string;
}

export interface TrainingLog {
  id: string;
  org_id: string;
  user_id: string;
  user?: User;
  sop_version_id: string;
  sop_version?: SOPVersion;
  sop_title?: string;
  device_id?: string;
  lang: string;
  started_at: string;
  completed_at?: string;
  quiz_score: number;
  passed: boolean;
  quiz_answers: Array<{ step_id: string; selected_index: number; correct: boolean }>;
  step_durations: Record<string, number>;
  sos_events: Array<{ step_id: string; timestamp: string }>;
  synced_at: string;
}

export interface SOSIncident {
  id: string;
  workstation_id: string;
  workstation_name: string;
  operator_id: string;
  operator_name: string;
  step_order: number;
  step_title: string;
  status: 'active' | 'resolved';
  created_at: string;
  resolved_at?: string;
  duration_sec?: number;
}
