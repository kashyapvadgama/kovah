import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constant/colors';
import { Feather } from '@expo/vector-icons';

const PostCard = ({ post }) => {
  const timeSince = (dateString) => {
    if (!dateString) return 'just now';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m`;
    return `${Math.floor(seconds)}s`;
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.header}>
        <Image 
            source={{ uri: post.avatar_url || 'https://via.placeholder.com/44' }} 
            style={styles.avatar} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.full_name || 'Anonymous User'}</Text>
          <Text style={styles.timestamp}>{timeSince(post.created_at)} ago</Text>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} color={Colors.GRAY} />
        </TouchableOpacity>
      </View>

      {/* Card Body */}
      {post.content && <Text style={styles.content}>{post.content}</Text>}
      {post.media_urls && post.media_urls[0] && (
        <Image source={{ uri: post.media_urls[0] }} style={styles.postImage} />
      )}

      {/* Card Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="heart" size={22} color={Colors.GRAY} />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="message-square" size={22} color={Colors.GRAY} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={22} color={Colors.GRAY} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        backgroundColor: '#e5e7eb',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.BLACK,
    },
    timestamp: {
        fontSize: 13,
        color: Colors.GRAY,
    },
    content: {
        fontSize: 15,
        lineHeight: 22,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    postImage: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#e5e7eb',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#f0f2f5',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        color: Colors.GRAY,
        fontWeight: '600',
    }
});

export default PostCard;