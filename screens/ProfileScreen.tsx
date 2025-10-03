import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Colors from '../constant/colors';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.banner_url || 'https://via.placeholder.com/400x150' }}
          style={styles.banner}
        />
        <Image
          source={{ uri: user.avatar_url || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.fullName}>{user.full_name || 'User Name'}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.bio}>{user.bio || 'No bio yet.'}</Text>
      </View>

      {/* Add more profile content here later */}

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 150,
    backgroundColor: '#e5e7eb',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: Colors.WHITE,
    borderWidth: 4,
    marginTop: -60, // Overlap the banner
    backgroundColor: '#d1d5db',
  },
  userInfo: {
    alignItems: 'center',
    padding: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  username: {
    fontSize: 16,
    color: Colors.GRAY,
    marginTop: 4,
  },
  bio: {
    fontSize: 15,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 12,
  },
  logoutButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.ERROR,
    fontWeight: 'bold',
  },
});
