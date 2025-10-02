import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Colors from '../constant/colors';
import PostCard from '../components/PostCard';
import { Feather } from '@expo/vector-icons';
import apiClient from '../api/client'; // <-- Use our new API client

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient('/api/posts'); // <-- Use apiClient
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchFeed(); }, [fetchFeed]));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kovah</Text>
        <TouchableOpacity 
          style={styles.createPostButton}
          // @ts-ignore
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Feather name="plus-square" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.PRIMARY} />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchFeed}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nothing in the feed yet!</Text>
              <Text style={styles.emptySubtext}>Be the first to post something amazing.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  createPostButton: {
    padding: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.GRAY,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 8,
  },
});