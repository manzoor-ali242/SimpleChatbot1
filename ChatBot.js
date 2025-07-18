import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, ScrollView,
  StyleSheet, ActivityIndicator, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function ChatBot({ navigation }) {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.get(`https://api.duckduckgo.com/`, {
        params: {
          q: input,
          format: 'json',
        },
      });

      const answer = res.data.AbstractText || res.data.Heading || "Sorry, I couldn’t find an answer.";
      const botMessage = { from: 'bot', text: answer };
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      setChat((prev) => [...prev, { from: 'bot', text: "Error fetching answer." }]);
    }

    setLoading(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Camera roll permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const userImageMessage = { from: 'user', image: imageUri };
      setChat((prev) => [...prev, userImageMessage]);

      const botMessage = {
        from: 'bot',
        text: "Nice image! But I can't analyze pictures yet. Try asking me something."
      };
      setChat((prev) => [...prev, botMessage]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.header}>🤖 InfoBot</Text>

      <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingBottom: 20 }}>
        {chat.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.from === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            {msg.image ? (
              <Image source={{ uri: msg.image }} style={styles.image} />
            ) : (
              <Text style={styles.messageText}>{msg.text}</Text>
            )}
          </View>
        ))}

        {input.trim() !== '' && (
          <View style={[styles.message, styles.userMessage]}>
            <Text style={styles.messageText}>{input}</Text>
          </View>
        )}

        {loading && <ActivityIndicator size="small" color="#ffffff" />}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask a question..."
          placeholderTextColor="#ccc"
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} color="#3B82F6" />
        <Button title="📷" onPress={pickImage} color="#10B981" />
        <Button title="✈️ Travel" onPress={() => navigation.navigate('TravelPlanner')} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 20,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 10,
  },
  chatArea: {
    flex: 1,
    marginBottom: 5,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#4B5563',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  inputArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    backgroundColor: '#3B3B5C',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderRadius: 6,
    marginRight: 5,
  },
});
