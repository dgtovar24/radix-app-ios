const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.raddix.pro/v1';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (!headers['Content-Type'] && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error ?? `HTTP ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'GET', token }),
  post: <T>(endpoint: string, body?: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      token,
    }),
  put: <T>(endpoint: string, body?: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      token,
    }),
  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),
  upload: <T>(endpoint: string, formData: FormData, token?: string) =>
    request<T>(endpoint, { method: 'POST', body: formData, token }),
};

// ─── Types ───

export interface User {
  id: number; firstName: string; lastName: string; email: string; role: string;
  phone?: string; licenseNumber?: string; specialty?: string; createdAt?: string;
}

export interface Doctor {
  id: number; firstName: string; lastName: string; email: string; role: string;
  phone?: string; licenseNumber?: string; specialty?: string; createdAt?: string;
}

export interface Patient {
  id: number; fullName: string; phone?: string; address?: string; isActive: boolean;
  familyAccessCode?: string; fkUserId?: number; fkDoctorId?: number; createdAt?: string;
}

export interface Treatment {
  id: number; patientId?: number; patientName?: string; doctorId?: number; doctorName?: string;
  isotopeId?: number; isotopeName?: string; room: number; initialDose: number;
  safetyThreshold: number; isolationDays: number; startDate: string; endDate?: string;
  isActive: boolean; currentRadiation?: number;
}

export interface Smartwatch {
  id: number; imei: string; macAddress: string; model: string; isActive: boolean;
  patientId: number; patientName?: string;
}

export interface WatchMetrics {
  id: number; patientId: number; imei: string; bpm?: number; steps?: number;
  distance?: number; currentRadiation: number; recordedAt: string;
}

export interface HealthMetric {
  id: number; patientId: number; treatmentId?: number; bpm?: number; steps?: number;
  distance?: number; currentRadiation?: number; recordedAt: string;
}

export interface RadiationLog {
  id: number; patientId: number; treatmentId?: number; radiationLevel: number; timestamp: string;
}

export interface Alert {
  id: number; patientId: number; patientName: string; treatmentId?: number;
  alertType: string; message: string; isResolved: boolean; createdAt: string;
}

export interface Message {
  id: number; patientId: number; messageText: string; isRead: boolean; sentAt: string;
}

export interface GameSession {
  id: number; patientId: number; score: number; levelReached: number; playedAt: string;
}

export interface Settings {
  id: number; patientId: number; unitPreference: string; theme: string;
  notificationsEnabled: boolean; updatedAt: string;
}

export interface Isotope {
  id: number; name: string; symbol: string; type: string; halfLife: number; halfLifeUnit: string;
}

export interface DashboardStats {
  totalPatients: number; totalDoctors: number; activeTreatments: number;
  pendingAlerts: number; totalSmartwatches: number; activeIsotopes: number;
}

// ─── Auth ───

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; id: number; firstName: string; role: string }>('/api/auth/login', { email, password }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; role?: string }) =>
    api.post<{ message: string; id: number }>('/api/auth/register', data),

  getProfile: (token: string) =>
    api.get<{ id: number; fullName: string }>('/api/patients/profile/me', token),
};

// ─── Patients ───

export const patientService = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; doctorId?: string; phone?: string; address?: string }) =>
    api.post<{ message: string; userId: number }>('/api/patients/register', data),

  getAll: (token: string) =>
    api.get<Patient[]>('/api/patients', token),

  getById: (id: number, token: string) =>
    api.get<Patient>(`/api/patients/${id}`, token),

  getProfileByUser: (userId: number, token: string) =>
    api.get<Patient>(`/api/patients/profile/${userId}`, token),

  update: (id: number, data: Record<string, string>, token: string) =>
    api.put<Patient>(`/api/patients/${id}`, data, token),
};

// ─── Users ───

export const userService = {
  getAll: (token: string) => api.get<User[]>('/api/users', token),
  getByRole: (role: string, token: string) => api.get<User[]>(`/api/users/role/${role}`, token),
  getById: (id: number, token: string) => api.get<User>(`/api/users/${id}`, token),
  update: (id: number, data: Record<string, string>, token: string) => api.put<User>(`/api/users/${id}`, data, token),
};

// ─── Doctors ───

export const doctorService = {
  getAll: (token: string) => api.get<Doctor[]>('/api/doctors', token),
  getById: (id: number, token: string) => api.get<Doctor>(`/api/doctors/${id}`, token),
  update: (id: number, data: Record<string, string>, token: string) => api.put<Doctor>(`/api/doctors/${id}`, data, token),
};

// ─── Treatments ───

export const treatmentService = {
  getAll: (token: string) => api.get<Treatment[]>('/api/treatments', token),
  getActive: (token: string) => api.get<Treatment[]>('/api/treatments/active', token),
  getById: (id: number, token: string) => api.get<Treatment>(`/api/treatments/${id}`, token),
  getByPatient: (patientId: number, token: string) => api.get<Treatment[]>(`/api/treatments/patient/${patientId}`, token),
  create: (data: { fkPatientId: number; fkRadioisotopeId: number; room: number; initialDose: number; fkSmartwatchId?: number }, token: string) =>
    api.post<Treatment>('/api/treatments', data, token),
  end: (id: number, token: string) => api.post<Treatment>(`/api/treatments/${id}/end`, {}, token),
};

// ─── Smartwatches ───

export const smartwatchService = {
  getAll: (token: string) => api.get<Smartwatch[]>('/api/smartwatches', token),
  getById: (id: number, token: string) => api.get<Smartwatch>(`/api/smartwatches/${id}`, token),
  getByPatient: (patientId: number, token: string) => api.get<Smartwatch[]>(`/api/smartwatches/patient/${patientId}`, token),
  create: (data: { fkPatientId: number; imei: string; macAddress: string; model: string }, token: string) =>
    api.post<Smartwatch>('/api/smartwatches', data, token),
  deactivate: (id: number, token: string) => api.delete<{ message: string }>(`/api/smartwatches/${id}`, token),
};

// ─── Watch Data ───

export const watchService = {
  getLatestByPatient: (patientId: number, token: string) =>
    api.get<WatchMetrics>(`/api/watch/patient/${patientId}/latest`, token),
  getMetricsByImei: (imei: string, token: string) =>
    api.get<WatchMetrics[]>(`/api/watch/${imei}/metrics`, token),
};

// ─── Health Metrics ───

export const healthMetricsService = {
  getByPatient: (patientId: number, days?: number, token?: string) => {
    const qs = days ? `?days=${days}` : '';
    return api.get<HealthMetric[]>(`/api/health-metrics/patient/${patientId}${qs}`, token);
  },
  getLatest: (patientId: number, token: string) =>
    api.get<HealthMetric>(`/api/health-metrics/patient/${patientId}/latest`, token),
  getByTreatment: (treatmentId: number, token: string) =>
    api.get<HealthMetric[]>(`/api/health-metrics/treatment/${treatmentId}`, token),
};

// ─── Radiation Logs ───

export const radiationLogService = {
  getByPatient: (patientId: number, days?: number, token?: string) => {
    const qs = days ? `?days=${days}` : '';
    return api.get<RadiationLog[]>(`/api/radiation-logs/patient/${patientId}${qs}`, token);
  },
  getByTreatment: (treatmentId: number, token: string) =>
    api.get<RadiationLog[]>(`/api/radiation-logs/treatment/${treatmentId}`, token),
};

// ─── Alerts ───

export const alertService = {
  getAll: (token: string) => api.get<Alert[]>('/api/alerts', token),
  getPending: (token: string) => api.get<Alert[]>('/api/alerts/pending', token),
  getByPatient: (patientId: number, token: string) =>
    api.get<Alert[]>(`/api/alerts/patient/${patientId}`, token),
  resolve: (id: number, token: string) =>
    api.put<Alert>(`/api/alerts/${id}/resolve`, {}, token),
};

// ─── Messages ───

export const messageService = {
  getByPatient: (patientId: number, token: string) =>
    api.get<Message[]>(`/api/messages/patient/${patientId}`, token),
  send: (data: { fkPatientId: number; messageText: string }, token: string) =>
    api.post<Message>('/api/messages', data, token),
  markRead: (id: number, token: string) =>
    api.put<Message>(`/api/messages/${id}/read`, {}, token),
};

// ─── Game Sessions ───

export const gameService = {
  getByPatient: (patientId: number, token: string) =>
    api.get<GameSession[]>(`/api/games/patient/${patientId}`, token),
  create: (data: { fkPatientId: number; score: number; levelReached: number }, token: string) =>
    api.post<GameSession>('/api/games', data, token),
};

// ─── Settings ───

export const settingsService = {
  getByPatient: (patientId: number, token: string) =>
    api.get<Settings>(`/api/settings/patient/${patientId}`, token),
  update: (patientId: number, data: Record<string, string | boolean>, token: string) =>
    api.put<Settings>(`/api/settings/patient/${patientId}`, data, token),
};

// ─── Isotopes ───

export const isotopeService = {
  getAll: (token?: string) => api.get<Isotope[]>('/api/isotopes', token),
  getById: (id: number, token?: string) => api.get<Isotope>(`/api/isotopes/${id}`, token),
};

// ─── Dashboard ───

export const dashboardService = {
  getStats: (token?: string) => api.get<DashboardStats>('/api/dashboard/stats', token),
};

// ─── File Upload ───

export const fileService = {
  upload: (file: { uri: string; name: string; type: string }, token: string) => {
    const formData = new FormData();
    formData.append('file', { uri: file.uri, name: file.name, type: file.type } as any);
    return api.upload<{ url: string; filename: string; originalName: string; size: number }>('/api/upload', formData, token);
  },
};
