import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getMoodHistory, clearMoodHistory, MoodEntry } from '../../storage/moodHistory';

export default function TrendsScreen() {
  const { colors } = useTheme();
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: colors.icon,
      marginTop: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    barRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 140,
      paddingHorizontal: 4,
    },
    bar: {
      flex: 1,
      marginHorizontal: 4,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      backgroundColor: colors.primary,
      opacity: 0.9,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    barLabel: {
      fontSize: 12,
      color: '#fff',
      marginBottom: 4,
    },
    barDay: {
      fontSize: 12,
      color: colors.icon,
      textAlign: 'center',
      marginTop: 6,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    statText: {
      color: colors.text,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    button: {
      backgroundColor: colors.border,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    buttonText: {
      color: colors.text,
      fontWeight: '600',
    },
  });

  const refresh = async () => {
    setRefreshing(true);
    const data = await getMoodHistory();
    setHistory(data);
    setRefreshing(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const last7 = useMemo(() => {
    const now = new Date();
    const days: { day: string; entries: MoodEntry[] }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayKey = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
      const entries = history.filter(h => new Date(h.timestamp).toISOString().slice(0,10) === dayKey);
      days.push({ day: dayLabel, entries });
    }
    return days;
  }, [history]);

  const summary = useMemo(() => {
    if (history.length === 0) return { avg: 0, latest: null as null | MoodEntry, count: 0 };
    const avg = history.reduce((s, e) => s + e.intensity, 0) / history.length;
    const latest = history[history.length - 1];
    return { avg, latest, count: history.length };
  }, [history]);

  const handleClear = async () => {
    await clearMoodHistory();
    refresh();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Trends</Text>
        <Text style={styles.subtitle}>Track how your mood changes over time</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        <View style={styles.barRow}>
          {last7.map((d, idx) => {
            const intensity = d.entries.length > 0 ? Math.round(d.entries.reduce((s, e) => s + e.intensity, 0) / d.entries.length) : 0;
            const height = Math.max(2, Math.round((intensity / 10) * 120));
            return (
              <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
                <View style={[styles.bar, { height }]}> 
                  <Text style={styles.barLabel}>{intensity > 0 ? intensity : ''}</Text>
                </View>
                <Text style={styles.barDay}>{d.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.statRow}>
          <Text style={styles.statText}>Entries: {summary.count}</Text>
          <Text style={styles.statText}>Average intensity: {summary.count ? summary.avg.toFixed(1) : '-'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statText}>Latest mood: {summary.latest ? summary.latest.mood : '-'}</Text>
          <Text style={styles.statText}>Latest intensity: {summary.latest ? summary.latest.intensity : '-'}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={refresh} disabled={refreshing}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
