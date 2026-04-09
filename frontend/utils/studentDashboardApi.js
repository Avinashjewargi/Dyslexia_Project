// frontend/utils/studentDashboardApi.js
// Aggregates reading data from API + local persistence for the student dashboard.

const API = 'http://localhost:5000/api';

function isLikelyMongoObjectId(id) {
  if (!id || typeof id !== 'string') return false;
  return /^[a-f\d]{24}$/i.test(id);
}

function getAuthToken() {
  return (
    localStorage.getItem('dyslexia_token') ||
    sessionStorage.getItem('dyslexia_token') ||
    null
  );
}

/** Map file-based session (reading.js) to dashboard shape */
export function normalizeFileSession(s) {
  const accuracy = typeof s.accuracy === 'number' ? s.accuracy : null;
  const difficultyFromAccuracy =
    accuracy != null ? Math.min(1, Math.max(0, (100 - accuracy) / 100)) : null;
  const ts = s.timestamp || s.completedAt || new Date().toISOString();
  const source = s.storyTitle || s.sessionType || 'Reading';
  return {
    id: s.sessionId || `file-${ts}`,
    timestamp: ts,
    wpm: Number(s.wpm) || 0,
    readingTimeSec: Number(s.readingTimeSec || s.readingDuration || 0),
    language: s.language || 'en',
    sessionType: s.sessionType || 'custom',
    storyTitle: s.storyTitle || null,
    contentPreview: (s.content || '').slice(0, 120),
    accuracy,
    analysis: {
      difficulty_score:
        s.difficulty_score != null
          ? Number(s.difficulty_score)
          : difficultyFromAccuracy != null
            ? difficultyFromAccuracy
            : 0.5,
      source,
    },
  };
}

/** Mongo ReadingProgress document */
export function normalizeMongoProgress(p) {
  const raw = p.toJSON ? p.toJSON() : p;
  const accuracy = typeof raw.accuracy === 'number' ? raw.accuracy : 0;
  const difficulty = Math.min(1, Math.max(0, (100 - accuracy) / 100));
  const ts = raw.createdAt || raw.completedAt || raw.updatedAt || new Date().toISOString();
  const storyTitle =
    raw.storyTitle ||
    (raw.storyId && typeof raw.storyId === 'object' && raw.storyId.title) ||
    null;
  const source = storyTitle || raw.sessionType || 'custom';
  return {
    id: String(raw._id || raw.id),
    timestamp: typeof ts === 'string' ? ts : new Date(ts).toISOString(),
    wpm: Number(raw.wpm) || 0,
    readingTimeSec: Number(raw.readingTimeSec) || 0,
    language: raw.language || 'en',
    sessionType: raw.sessionType || 'custom',
    storyTitle,
    contentPreview: (raw.content || '').slice(0, 120),
    accuracy,
    analysis: {
      difficulty_score: accuracy > 0 ? difficulty : 0.5,
      source,
    },
  };
}

/** LocalStorage / Firestore session from firebase.js */
export function normalizeLocalSession(s) {
  let analysis = s.analysis;
  if (typeof analysis === 'string') {
    try {
      analysis = JSON.parse(analysis);
    } catch {
      analysis = {};
    }
  }
  analysis = analysis || {};
  const accuracy = typeof s.accuracy === 'number' ? s.accuracy : null;
  const difficulty =
    analysis.difficulty_score != null
      ? Number(analysis.difficulty_score)
      : accuracy != null
        ? Math.min(1, Math.max(0, (100 - accuracy) / 100))
        : 0.5;
  return {
    id: s.id || `local-${s.timestamp}`,
    timestamp: s.timestamp || new Date().toISOString(),
    wpm: Number(s.wpm) || 0,
    readingTimeSec: Number(s.readingTimeSec) || 0,
    language: s.language || 'en',
    sessionType: s.sessionType || 'local',
    storyTitle: s.storyTitle || null,
    contentPreview: (s.content || '').slice(0, 120),
    accuracy,
    analysis: {
      difficulty_score: difficulty,
      source: analysis.source || s.sessionType || 'Local',
    },
  };
}

function dedupeSessions(list) {
  const seen = new Set();
  const out = [];
  for (const s of list) {
    const key = `${s.timestamp}|${s.wpm}|${s.readingTimeSec}|${s.contentPreview?.slice(0, 40) || ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * @param {string} userId
 * @param {object|null} user - normalized app user (optional)
 * @returns {Promise<{ sessions: array, analytics: object|null, leaderboardPoints: number|null, rank: number|null, loadErrors: string[] }>}
 */
export async function fetchStudentDashboardData(userId, user = null) {
  const uid = userId || 'guest-user';
  const token = getAuthToken();
  const mongoId = isLikelyMongoObjectId(uid);
  const errors = [];

  const bucket = [];

  try {
    const res = await fetch(`${API}/reading/sessions/${encodeURIComponent(uid)}`);
    const data = await res.json().catch(() => ({}));
    if (data.success && Array.isArray(data.sessions)) {
      data.sessions.forEach((s) => bucket.push(normalizeFileSession(s)));
    }
  } catch (e) {
    errors.push('file-sessions');
    console.warn('Dashboard: file sessions', e);
  }

  if (token && mongoId) {
    try {
      const res = await fetch(`${API}/storage/progress/${uid}?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.progress)) {
        data.progress.forEach((p) => bucket.push(normalizeMongoProgress(p)));
      } else if (res.status === 401) {
        errors.push('progress-unauthorized');
      }
    } catch (e) {
      errors.push('mongo-progress');
      console.warn('Dashboard: mongo progress', e);
    }
  }

  let analytics = null;
  if (token && mongoId) {
    try {
      const res = await fetch(`${API}/storage/progress/${uid}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && data.analytics) analytics = data.analytics;
    } catch {
      /* optional */
    }
  }

  let leaderboardPoints = null;
  let rank = null;
  if (token && mongoId && user?.role === 'student') {
    try {
      const res = await fetch(`${API}/storage/leaderboard/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        if (typeof data.totalPoints === 'number') leaderboardPoints = data.totalPoints;
        if (data.rank != null) rank = data.rank;
      }
    } catch {
      /* optional */
    }
  }

  try {
    const { fetchReadingSessions } = await import('./firebase.js');
    const local = await fetchReadingSessions(uid);
    if (Array.isArray(local)) {
      local
        .filter((s) => !s.userId || String(s.userId) === String(uid))
        .forEach((s) => bucket.push(normalizeLocalSession(s)));
    }
  } catch (e) {
    console.warn('Dashboard: local sessions', e);
  }

  const sessions = dedupeSessions(bucket);

  return {
    sessions,
    analytics,
    leaderboardPoints,
    rank,
    loadErrors: errors,
  };
}
