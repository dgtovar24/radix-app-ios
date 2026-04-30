import { useState, useEffect, useCallback } from 'react';
import {
  initHealthKit,
  isHealthKitAvailable,
  getLatestHeartRate,
  getStepCountToday,
  getDistanceToday,
  getSleepToday,
  getHeartRateHistory,
  getStepHistory,
} from '../services/healthKit';

interface HealthData {
  bpm: number | null;
  steps: number | null;
  distance: number | null;
  sleep: number | null;
  loading: boolean;
  available: boolean;
}

interface HealthHistory {
  heartRate: { label: string; value: number }[];
  steps: { label: string; value: number }[];
  loading: boolean;
}

export function useHealthData() {
  const [data, setData] = useState<HealthData>({
    bpm: null,
    steps: null,
    distance: null,
    sleep: null,
    loading: true,
    available: false,
  });

  useEffect(() => {
    initAndFetch();
  }, []);

  const initAndFetch = async () => {
    const ok = await initHealthKit();
    setData((prev) => ({ ...prev, available: ok }));

    if (ok) {
      const [bpm, steps, distance, sleep] = await Promise.all([
        getLatestHeartRate(),
        getStepCountToday(),
        getDistanceToday(),
        getSleepToday(),
      ]);
      setData({ bpm, steps, distance, sleep, loading: false, available: true });
    } else {
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  const refresh = useCallback(async () => {
    if (!isHealthKitAvailable()) return;
    setData((prev) => ({ ...prev, loading: true }));
    const [bpm, steps, distance, sleep] = await Promise.all([
      getLatestHeartRate(),
      getStepCountToday(),
      getDistanceToday(),
      getSleepToday(),
    ]);
    setData({ bpm, steps, distance, sleep, loading: false, available: true });
  }, []);

  return { ...data, refresh };
}

export function useHealthHistory(days: number = 7) {
  const [data, setData] = useState<HealthHistory>({
    heartRate: [],
    steps: [],
    loading: true,
  });

  useEffect(() => {
    fetchHistory();
  }, [days]);

  const fetchHistory = async () => {
    const ok = await initHealthKit();
    if (ok) {
      const [heartRate, steps] = await Promise.all([
        getHeartRateHistory(days),
        getStepHistory(days),
      ]);
      setData({ heartRate, steps, loading: false });
    } else {
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  return { ...data, refresh: fetchHistory };
}
