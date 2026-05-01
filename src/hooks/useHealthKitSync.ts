import { useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getLatestHeartRate, getStepCountToday, getDistanceToday } from '../services/healthKit';
import { patientService, smartwatchService } from '../services/api';

export function useHealthKitSync(enabled: boolean, intervalMs = 300000) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sync = async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        if (!token) return;

        const patients = await patientService.getAll(token);
        if (patients.length === 0) return;
        const patient = patients[0];

        const watches = await smartwatchService.getByPatient(patient.id, token);
        if (watches.length === 0) return;
        const imei = watches[0].imei;

        const [bpm, steps, distance] = await Promise.all([
          getLatestHeartRate().catch(() => null),
          getStepCountToday().catch(() => null),
          getDistanceToday().catch(() => null),
        ]);

        const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.raddix.pro/v1';
        await fetch(`${API_BASE}/api/watch/ingest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            imei,
            familyAccessCode: patient.familyAccessCode,
            bpm,
            steps,
            distance,
            currentRadiation: 0,
          }),
        });
      } catch (err) {
        // Silent background sync — don't disturb the user
      }
    };

    sync(); // Initial sync
    intervalRef.current = setInterval(sync, intervalMs);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [enabled, intervalMs]);
}
