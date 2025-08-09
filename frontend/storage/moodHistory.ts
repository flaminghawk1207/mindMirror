import AsyncStorage from '@react-native-async-storage/async-storage';

export type MoodEntry = {
  timestamp: number; // ms since epoch
  mood: string;
  intensity: number; // 1-10
};

const STORAGE_KEY = 'mood_history_v1';

export async function getMoodHistory(): Promise<MoodEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(e => e && typeof e.timestamp === 'number' && typeof e.mood === 'string' && typeof e.intensity === 'number');
    }
    return [];
  } catch {
    return [];
  }
}

export async function appendMoodEntry(entry: MoodEntry): Promise<void> {
  const current = await getMoodHistory();
  current.push(entry);
  current.sort((a, b) => a.timestamp - b.timestamp);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export async function clearMoodHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
} 