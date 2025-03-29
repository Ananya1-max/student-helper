import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Load initial messages
    setMessages([
      {
        _id: 1,
        text: 'Welcome to the Mental Health Support Chatbot. How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Support Bot',
        },
      },
    ]);
  }, []);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      _id: Date.now().toString(),
      text: input,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    };

    setMessages((previousMessages) => [...previousMessages, newMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMessage = {
        _id: (Date.now() + 1).toString(),
        text: botResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Support Bot',
        },
      };
      setMessages((previousMessages) => [...previousMessages, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    userInput = userInput.toLowerCase();
    if (userInput.includes('anxiety')) {
      return 'I understand you are feeling anxious.  Here are some resources: [https://www.anxiety.org/]';
    } else if (userInput.includes('depression')) {
      return 'I understand you are feeling depressed. Here are some resources: [https://www.depression.org/]';
    } else if (userInput.includes('help')) {
      return 'If you need immediate help, please call a crisis hotline: 988';
    } else {
      return "I'm here to help. Please tell me more about what you're feeling.";
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.user._id === 1 ? styles.sent : styles.received,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="Type your message..."
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  message: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  sent: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default ChatScreen;