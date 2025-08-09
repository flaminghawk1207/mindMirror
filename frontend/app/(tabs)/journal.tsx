import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { addJournalEntry, getJournalEntries, deleteJournalEntry, JournalEntry } from '../../storage/journal';

export default function JournalScreen() {
  const { colors } = useTheme();
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saving, setSaving] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      color: colors.text,
      borderRadius: 12,
      padding: 12,
      minHeight: 80,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      alignSelf: 'flex-end',
      marginTop: 8,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    listTitle: {
      marginTop: 16,
      marginBottom: 8,
      color: colors.text,
      fontWeight: '600',
      fontSize: 16,
    },
    item: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    itemMeta: {
      color: colors.icon,
      fontSize: 12,
    },
    itemMood: {
      color: colors.text,
      fontWeight: '600',
    },
    deleteBtn: {
      backgroundColor: colors.border,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    deleteText: {
      color: colors.text,
      fontWeight: '600',
    },
    empty: {
      color: colors.icon,
      textAlign: 'center',
      marginTop: 24,
    },
  });

  const loadEntries = async () => {
    const data = await getJournalEntries();
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleAdd = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await addJournalEntry({
        timestamp: Date.now(),
        mood: null, // Could be wired to current mood state if desired
        intensity: null,
        note: note.trim(),
      });
      setNote('');
      loadEntries();
    } catch (e) {
      // noop
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete entry', 'Are you sure you want to delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteJournalEntry(id); loadEntries(); } },
    ]);
  };

  const renderItem = ({ item }: { item: JournalEntry }) => {
    const date = new Date(item.timestamp);
    const ts = date.toLocaleString();
    return (
      <View style={styles.item}>
        <View style={styles.itemRow}>
          <Text style={styles.itemMeta}>{ts}</Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item.id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemMood}>
          {item.mood ? `Mood: ${item.mood}` : 'Mood: -'}{item.intensity ? `  |  Intensity: ${item.intensity}` : ''}
        </Text>
        <Text style={{ color: colors.text, marginTop: 6 }}>{item.note}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Write a quick note about your day..."
        placeholderTextColor={colors.icon}
        style={styles.input}
        multiline
      />
      <TouchableOpacity style={[styles.button, (!note.trim() || saving) && { opacity: 0.6 }]} disabled={!note.trim() || saving} onPress={handleAdd}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>Your entries</Text>
      {entries.length === 0 ? (
        <Text style={styles.empty}>No entries yet</Text>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(e) => e.id}
        />
      )}
    </View>
  );
} 