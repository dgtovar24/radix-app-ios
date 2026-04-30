export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Doctor' | 'patient' | string;
  createdAt: string;
}

export interface Patient {
  id: number;
  fullName: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  familyAccessCode: string;
  fkUserId: number;
  fkDoctorId?: number;
  createdAt: string;
  user?: User;
  doctor?: User;
}

export interface HealthMetrics {
  id: number;
  fkTreatmentId: number;
  fkPatientId: number;
  bpm: number;
  steps: number;
  distance: number;
  currentRadiation: number;
  recordedAt: string;
}

export interface Treatment {
  id: number;
  fkPatientId: number;
  fkDoctorId: number;
  fkRadioisotopeId: number;
  fkSmartwatchId: number;
  fkUnitId: number;
  room: number;
  initialDose: number;
  safetyThreshold: number;
  isolationDays: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Smartwatch {
  id: number;
  fkPatientId: number;
  imei: string;
  macAddress: string;
  model: string;
  isActive: boolean;
}

export interface DoctorAlert {
  id: number;
  fkPatientId: number;
  fkTreatmentId: number;
  alertType: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface HealthLog {
  id: number;
  fkPatientId: number;
  bpm: number;
  steps: number;
  distance: number;
  timestamp: string;
}

export interface RadiationLog {
  id: number;
  fkPatientId: number;
  fkTreatmentId: number;
  radiationLevel: number;
  timestamp: string;
}

export interface GameSession {
  id: number;
  fkPatientId: number;
  score: number;
  levelReached: number;
  playedAt: string;
}

export interface MotivationalMessage {
  id: number;
  fkPatientId: number;
  messageText: string;
  isRead: boolean;
  sentAt: string;
}

export interface Settings {
  id: number;
  fkPatientId: number;
  unitPreference: 'metric' | 'imperial';
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  userId?: number;
  role?: string;
  email?: string;
  firstName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}