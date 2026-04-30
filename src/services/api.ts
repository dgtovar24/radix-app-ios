const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/v2';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error ?? `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), token }),

  put: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), token }),

  patch: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), token }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),
};

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; userId: number; role: string }>('/api/auth/login', { email, password }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; role?: string }) =>
    api.post<{ message: string; userId: number }>('/api/auth/register', data),

  getProfile: (token: string) =>
    api.get<{ id: number; fullName: string }>('/api/patients/profile/:userId', token),
};

export const patientService = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; doctorId?: string }) =>
    api.post<{ message: string; userId: number }>('/api/patients/register', data),

  getAll: (token: string) =>
    api.get<Array<{ id: number; fullName: string }>>('/api/patients', token),

  getById: (id: number, token: string) =>
    api.get<{ id: number; fullName: string }>(`/api/patients/${id}`, token),
};

export const userService = {
  getAll: (token: string) =>
    api.get<Array<{ id: number; firstName: string; lastName: string; email: string; role: string }>>('/api/users', token),

  getByRole: (role: string, token: string) =>
    api.get<Array<{ id: number; firstName: string; lastName: string; email: string; role: string }>>(`/api/users/role/${role}`, token),
};

export interface TreatmentResponse {
  id: number;
  fkPatientId: number;
  fkDoctorId: number;
  room: number;
  initialDose: number;
  safetyThreshold: number;
  isolationDays: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  isotopeName?: string;
  patientName?: string;
}

export interface WatchMetricsResponse {
  id: number;
  patientId: number;
  imei: string;
  bpm?: number;
  steps?: number;
  distance?: number;
  currentRadiation?: number;
  recordedAt: string;
}

export interface AlertResponse {
  id: number;
  patientId: number;
  patientName?: string;
  treatmentId?: number;
  alertType: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface PatientProfileResponse {
  id: number;
  fullName: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  familyAccessCode?: string;
  fkUserId?: number;
  fkDoctorId?: number;
  createdAt?: string;
}

export const treatmentService = {
  getByPatient: (patientId: number, token: string) =>
    api.get<TreatmentResponse[]>(`/api/treatments/patient/${patientId}`, token),
};

export const watchService = {
  getLatestByPatient: (patientId: number, token: string) =>
    api.get<WatchMetricsResponse>(`/api/watch/patient/${patientId}/latest`, token),
};

export const alertService = {
  getByPatient: (patientId: number, token: string) =>
    api.get<AlertResponse[]>(`/api/alerts/patient/${patientId}`, token),
};

export const patientProfileService = {
  getByUserId: (userId: number, token: string) =>
    api.get<PatientProfileResponse>(`/api/patients/profile/${userId}`, token),
};