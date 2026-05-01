import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as SecureStore from 'expo-secure-store';

const HEALTH_SYNC_TASK = 'radix-health-sync';

TaskManager.defineTask(HEALTH_SYNC_TASK, async () => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    if (!token) return BackgroundFetch.BackgroundFetchResult.NoData;

    const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.raddix.pro/v1';

    const patientsRes = await fetch(`${API_BASE}/api/patients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const patients = await patientsRes.json();
    if (!patients.length) return BackgroundFetch.BackgroundFetchResult.NoData;
    const patient = patients[0];

    const watchesRes = await fetch(`${API_BASE}/api/smartwatches/patient/${patient.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const watches = await watchesRes.json();
    if (!watches.length) return BackgroundFetch.BackgroundFetchResult.NoData;

    // Post a basic heartbeat to the watch ingest endpoint
    await fetch(`${API_BASE}/api/watch/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imei: watches[0].imei,
        familyAccessCode: patient.familyAccessCode,
        currentRadiation: 0,
      }),
    });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundSync() {
  const status = await BackgroundFetch.getStatusAsync();
  if (status === BackgroundFetch.BackgroundFetchStatus.Denied) {
    return false;
  }

  return BackgroundFetch.registerTaskAsync(HEALTH_SYNC_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
