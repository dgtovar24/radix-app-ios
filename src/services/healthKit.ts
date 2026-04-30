import { Platform } from 'react-native';

let AppleHealthKit: any = null;

function getHealthKit(): any {
  if (Platform.OS !== 'ios') return null;
  if (AppleHealthKit) return AppleHealthKit;
  try {
    AppleHealthKit = require('react-native-health').default;
  } catch {
    return null;
  }
  return AppleHealthKit;
}

let isInitialized = false;

export async function initHealthKit(): Promise<boolean> {
  const HK = getHealthKit();
  if (!HK) return false;

  return new Promise((resolve) => {
    HK.initHealthKit(
      {
        permissions: {
          read: [
            HK.Constants.Permissions.HeartRate,
            HK.Constants.Permissions.StepCount,
            HK.Constants.Permissions.DistanceWalkingRunning,
            HK.Constants.Permissions.ActiveEnergyBurned,
            HK.Constants.Permissions.SleepAnalysis,
            HK.Constants.Permissions.BloodPressureSystolic,
            HK.Constants.Permissions.BloodPressureDiastolic,
            HK.Constants.Permissions.RespiratoryRate,
            HK.Constants.Permissions.BodyTemperature,
            HK.Constants.Permissions.OxygenSaturation,
            HK.Constants.Permissions.Weight,
            HK.Constants.Permissions.Height,
          ],
          write: [HK.Constants.Permissions.StepCount],
        },
      },
      (err: string) => {
        if (err) { resolve(false); return; }
        isInitialized = true;
        resolve(true);
      }
    );
  });
}

export function isHealthKitAvailable(): boolean {
  return Platform.OS === 'ios' && isInitialized;
}

export async function getLatestHeartRate(): Promise<number | null> {
  const HK = getHealthKit();
  if (!HK || !isInitialized) return null;
  return new Promise((resolve) => {
    HK.getHeartRateSamples(
      { limit: 1, ascending: false },
      (err: string, results: any[]) => {
        if (err || !results.length) { resolve(null); return; }
        resolve(results[0].value);
      }
    );
  });
}

export async function getStepCountToday(): Promise<number | null> {
  const HK = getHealthKit();
  if (!HK || !isInitialized) return null;
  return new Promise((resolve) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    HK.getStepCount(
      { startDate: start.toISOString(), endDate: now.toISOString() },
      (err: string, results: { value: number }) => {
        if (err) { resolve(null); return; }
        resolve(results.value ?? 0);
      }
    );
  });
}

export async function getDistanceToday(): Promise<number | null> {
  const HK = getHealthKit();
  if (!HK || !isInitialized) return null;
  return new Promise((resolve) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    HK.getDistanceWalkingRunning(
      { startDate: start.toISOString(), endDate: now.toISOString() },
      (err: string, results: { value: number }) => {
        if (err) { resolve(null); return; }
        resolve(results.value ?? 0);
      }
    );
  });
}

export async function getSleepToday(): Promise<number | null> {
  const HK = getHealthKit();
  if (!HK || !isInitialized) return null;
  return new Promise((resolve) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    HK.getSleepSamples(
      { startDate: start.toISOString(), endDate: now.toISOString() },
      (err: string, results: any[]) => {
        if (err || !results.length) { resolve(null); return; }
        let totalMs = 0;
        for (const r of results) {
          if (r.endDate) {
            totalMs += new Date(r.endDate).getTime() - new Date(r.startDate).getTime();
          }
        }
        resolve(totalMs / 3600000);
      }
    );
  });
}

export async function getHeartRateHistory(days: number): Promise<{ label: string; value: number }[]> {
  const HK = getHealthKit();
  if (!HK || !isInitialized) return [];
  return new Promise((resolve) => {
    const now = new Date();
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    HK.getHeartRateSamples(
      { startDate: start.toISOString(), endDate: now.toISOString(), limit: days * 24 },
      (err: string, results: any[]) => {
        if (err) { resolve([]); return; }
        resolve(
          results
            .filter((r: any) => r.startDate)
            .map((r: any) => ({
              label: new Date(r.startDate).toLocaleDateString('es-ES', { weekday: 'short' }),
              value: r.value,
            }))
        );
      }
    );
  });
}

export async function getStepHistory(days: number): Promise<{ label: string; value: number }[]> {
  const HK = getHealthKit();
  if (!HK || !isInitialized) return [];
  return new Promise((resolve) => {
    const now = new Date();
    const results: { label: string; value: number }[] = [];
    let completed = 0;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      HK.getStepCount(
        { startDate: dayStart.toISOString(), endDate: dayEnd.toISOString() },
        (err: string, r: { value: number }) => {
          results.push({
            label: d.toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 3),
            value: err ? 0 : (r.value ?? 0),
          });
          completed++;
          if (completed === days) {
            resolve(results.sort((a, b) => a.label.localeCompare(b.label)));
          }
        }
      );
    }
  });
}
