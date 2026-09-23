import { generateMockPredictionResponse } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health/ready`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const liveRes = await fetch(`${BASE_URL}/health/live`);
      if (liveRes.ok) {
        return { isLive: true, isReady: false, message: 'API process live, databases connecting...' };
      }
      return { isLive: false, isReady: false, message: 'Backend unreachable' };
    }
    const data = await res.json();
    return {
      isLive: true,
      isReady: data.status === 'healthy',
      postgres: data.postgres?.status || 'unknown',
      redis: data.redis?.status || 'unknown',
      version: data.version || '1.0.0',
    };
  } catch (err) {
    return { isLive: false, isReady: false, error: err.message };
  }
}

export async function fetchPredictions(sequence, timestamp, isDemoMode = false, scenario = 'rush_hour') {
  if (isDemoMode) {
    // Return precomputed simulation data instantly
    return {
      data: generateMockPredictionResponse(scenario),
      source: 'demo',
    };
  }

  try {
    const payload = {
      sequence,
      timestamp: timestamp || new Date().toISOString(),
    };

    const res = await fetch(`${BASE_URL}/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return { data, source: 'live' };
  } catch (err) {
    console.warn('Backend API request failed, switching to demo mode fallback:', err);
    return {
      data: generateMockPredictionResponse(scenario),
      source: 'fallback',
      error: err.message,
    };
  }
}
