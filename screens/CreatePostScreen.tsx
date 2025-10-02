// This file can stay the same, but we will use apiClient in its `handlePost` function
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, Platform, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constant/colors';
import apiClient from '../api/client'; // <-- USE THE NEW API CLIENT

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert("Empty Post", "Please write something before posting.");
      return;
    }
    setLoading(true);
    try {
      // Use the apiClient to make the request.
      // It automatically includes the token.
      const data = await apiClient('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: content }),
      });

      Alert.alert('Success!', 'Your post has been created.', [
         // @ts-ignore
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Post Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.postButton, (loading || !content.trim()) && styles.disabledButton]}
          onPress={handlePost}
          disabled={loading || !content.trim()}
        >
          {loading ? <ActivityIndicator color={Colors.WHITE} size="small" /> : <Text style={styles.postButtonText}>Post</Text>}
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor={Colors.GRAY}
        multiline
        value={content}
        onChangeText={setContent}
        autoFocus={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelText: {
    fontSize: 16,
    color: Colors.GRAY,
  },
  postButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  postButtonText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    textAlignVertical: 'top',
  },
});

export default CreatePostScreen;