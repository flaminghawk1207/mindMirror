import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import type { ListRenderItem, FlatList as FlatListType } from 'react-native';

export default function AIScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am Gemini. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const flatListRef = useRef<FlatListType<any>>(null);

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
  });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setError('');
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.chatContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx.toString()}
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
          placeholder="Type your message..."
          placeholderTextColor={colors.icon}
          editable={!loading}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading || !input.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
} 