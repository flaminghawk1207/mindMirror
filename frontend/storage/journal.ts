import AsyncStorage from '@react-native-async-storage/async-storage';

export type JournalEntry = {
  id: string;
  timestamp: number; // ms since epoch
  mood: string | null; // optional mood label
  intensity: number | null; // optional intensity 1-10
  note: string; // user note
};

const STORAGE_KEY = 'journal_entries_v1';

export async function getJournalEntries(): Promise<JournalEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(e => e && typeof e.id === 'string' && typeof e.timestamp === 'number' && typeof e.note === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

export async function addJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const record: JournalEntry = { id, ...entry };
  const current = await getJournalEntries();
  current.push(record);
  current.sort((a, b) => b.timestamp - a.timestamp);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return record;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const current = await getJournalEntries();
  const next = current.filter(e => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function clearJournal(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
} 