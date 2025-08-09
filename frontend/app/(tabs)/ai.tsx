import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../contexts/ThemeContext';
import type { ListRenderItem, FlatList as FlatListType } from 'react-native';
import { appendMoodEntry } from '../../storage/moodHistory';

export default function AIScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am MindMirror. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const flatListRef = useRef<FlatListType<any>>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  const moodOptions = ['Happy', 'Sad', 'Angry', 'Excited', 'Calm', 'Anxious'];

  const getMoodSuggestions = (currentMood: string | null): string[] => {
    switch (currentMood) {
      case 'Sad':
        return ['Suggest a 2-minute mood lift', 'Help me reframe a negative thought', 'Give me 3 tiny steps for today'];
      case 'Angry':
        return ['Quick calm-down (under 2 minutes)', 'Help me de-escalate', 'How can I respond constructively?'];
      case 'Anxious':
        return ['A 2-minute grounding exercise', 'Plan the next tiny step', 'Reframe a worry'];
      case 'Happy':
        return ['Build on this feeling', 'Gratitude prompt', 'Share it forward idea'];
      case 'Excited':
        return ['Channel this energy', 'Quick plan in 3 steps', 'Avoid burnout tips'];
      case 'Calm':
        return ['Maintain this calm', 'Light reflection', 'Gentle productivity tip'];
      default:
        return ['Suggest a 2-minute reset', 'Give me 3 small actions', 'Help me reframe my thoughts'];
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    chatContainer: {
      flex: 1,
      padding: 16,
    },
    messageBubble: {
      padding: 12,
      borderRadius: 12,
      marginBottom: 8,
      maxWidth: '80%',
    },
    userBubble: {
      backgroundColor: colors.primary,
      alignSelf: 'flex-end',
    },
    aiBubble: {
      backgroundColor: colors.card,
      alignSelf: 'flex-start',
    },
    messageText: {
      color: colors.text,
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderTopWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    input: {
      flex: 1,
      fontSize: 16,
      padding: 10,
      backgroundColor: colors.card,
      borderRadius: 8,
      color: colors.text,
      marginRight: 8,
    },
    sendButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginBottom: 8,
    },
    moodContainer: {
      marginBottom: 16,
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
    },
    moodLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    moodOptionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    moodButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: colors.border,
      marginRight: 8,
      marginBottom: 8,
    },
    moodButtonSelected: {
      backgroundColor: colors.primary,
    },
    moodButtonText: {
      color: colors.text,
      fontWeight: '500',
    },
    moodButtonTextSelected: {
      color: '#fff',
    },
    sliderLabel: {
      fontSize: 15,
      color: colors.text,
      marginBottom: 4,
    },
    sliderValue: {
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: 8,
    },
    submitMoodButton: {
      marginTop: 12,
      backgroundColor: colors.primary,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitMoodButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    moodResult: {
      marginTop: 10,
      alignItems: 'center',
    },
    moodSummary: {
      marginBottom: 16,
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    changeMoodButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: colors.border,
      borderRadius: 8,
    },
    changeMoodButtonText: {
      color: colors.text,
      fontWeight: '600',
    },
    suggestionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
    },
    suggestionChip: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    suggestionText: {
      color: colors.text,
      fontSize: 13,
    },
  });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setError('');
    const moodPrefix = mood ? `(Context: I'm feeling ${mood} at intensity ${intensity}/10.) ` : '';
    const userMessage = { role: 'user', text: moodPrefix + input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      // Prepare the conversation history for the backend
      const history = [...messages, userMessage].map(m => ({ role: m.role, text: m.text }));
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, history, mood, intensity })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        if (data.inferredMood && typeof data.inferredMood === 'string') {
          setMood(data.inferredMood);
          setMoodSubmitted(true);
        }
        if (typeof data.inferredIntensity === 'number') {
          setIntensity(data.inferredIntensity);
        }
        // Persist inferred mood entry for trends
        const entryMood = (data.inferredMood && typeof data.inferredMood === 'string') ? data.inferredMood : (mood || 'Unknown');
        const entryIntensity = (typeof data.inferredIntensity === 'number') ? data.inferredIntensity : intensity;
        appendMoodEntry({ timestamp: Date.now(), mood: entryMood, intensity: entryIntensity }).catch(() => {});
      } else {
        setError(data.error || 'Failed to get response from Gemini.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderItem: ListRenderItem<{ role: string; text: string }> = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const dynamicPlaceholder = mood ? `What\'s making you feel ${mood.toLowerCase()}?` : 'Type your message...';
  const suggestions = getMoodSuggestions(mood);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Mood and Intensity Selector or Summary */}
      {!moodSubmitted ? (
        <View style={styles.moodContainer}>
          <Text style={styles.moodLabel}>How are you feeling today?</Text>
          <View style={styles.moodOptionsRow}>
            {moodOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.moodButton,
                  mood === option && styles.moodButtonSelected,
                ]}
                onPress={() => setMood(option)}
              >
                <Text
                  style={[
                    styles.moodButtonText,
                    mood === option && styles.moodButtonTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sliderLabel}>
            Intensity: <Text style={styles.sliderValue}>{intensity}</Text>
          </Text>
          {/* @ts-ignore */}
          <Slider
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={intensity}
            onValueChange={setIntensity}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <TouchableOpacity
            style={[styles.submitMoodButton, !mood && { opacity: 0.6 }]}
            onPress={() => setMoodSubmitted(true)}
            disabled={!mood}
          >
            <Text style={styles.submitMoodButtonText}>Submit Mood</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.moodSummary}>
          <Text style={{ color: colors.text }}>
            Mood: <Text style={{ fontWeight: 'bold' }}>{mood}</Text> | Intensity: <Text style={{ fontWeight: 'bold' }}>{intensity}</Text>
          </Text>
          <TouchableOpacity style={styles.changeMoodButton} onPress={() => setMoodSubmitted(false)}>
            <Text style={styles.changeMoodButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Suggestions based on mood */}
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.suggestionsRow}>
          {suggestions.map(s => (
            <TouchableOpacity key={s} style={styles.suggestionChip} onPress={() => setInput(s)}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chat UI */}
      <View style={styles.chatContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={{ paddingBottom: 8 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        {loading && <ActivityIndicator size="small" color={colors.primary} style={{ marginBottom: 8 }} />}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={dynamicPlaceholder}
          placeholderTextColor={colors.icon}
          editable={!loading}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={[styles.sendButton, (loading || !input.trim()) && { opacity: 0.6 }]} onPress={sendMessage} disabled={loading || !input.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
} 