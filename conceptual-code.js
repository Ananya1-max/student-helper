// modules/note-taking/screens/NoteEditorScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { io } from 'socket.io-client'; // Import Socket.IO

const NoteEditorScreen = ({ noteId }) => {
  const [noteContent, setNoteContent] = useState('');
  const socketRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io('http://your-backend-server.com'); // Replace with your server URL
    const socket = socketRef.current;

    // Fetch initial note content
    const fetchNote = async () => {
      // Simulate fetching note content from a server
      setTimeout(() => {
        setNoteContent(`Note ${noteId} Initial Content.  Start Collaborating!`);
        // Join a Socket.IO room for this note
        socket.emit('join-note', noteId);
      }, 500);
    };
    fetchNote();

    // Listen for changes from other users
    socket.on(`note-update-${noteId}`, (updatedContent) => {
      if (editorRef.current && updatedContent !== noteContent) {
        setNoteContent(updatedContent);
      }
    });

    // Emit changes when the local note changes
    const handleTextChange = (text) => {
      setNoteContent(text);
      socket.emit(`note-update-${noteId}`, text);
    };

    return () => {
      // Clean up Socket.IO connection
      socket.disconnect();
      socketRef.current = null;
    };
  }, [noteId, noteContent]);

    const handleTextChange = (text) => {
        setNoteContent(text);
        if (socketRef.current) {
            socketRef.current.emit(`note-update-${noteId}`, text);
        }
    }

  return (
    <View style={styles.container}>
      <TextInput
        ref={editorRef}
        style={styles.editor}
        value={noteContent}
        onChangeText={handleTextChange}
        multiline
        placeholder="Start typing here..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default NoteEditorScreen;