import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MessageCircle, User, Search, MoreVertical, Package, Clock, CheckCheck, Check } from 'lucide-react-native';
import { useChat, type Chat } from '@/contexts/ChatContext';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';

export default function MessagesScreen() {
  const router = useRouter();
  const { chats, loading } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity style={styles.actionButton}>
        <Package size={20} color="#3B82F6" />
        <Text style={styles.actionText}>Active Deliveries</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Clock size={20} color="#3B82F6" />
        <Text style={styles.actionText}>Pending</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMessageStatus = (message: Chat['last_message']) => {
    if (!message) return null;
    
    // Mock read status - in real app, this would come from the message object
    const isRead = message.read;
    const isSent = true;
    
    return (
      <View style={styles.messageStatus}>
        {isRead ? (
          <CheckCheck size={16} color="#3B82F6" />
        ) : isSent ? (
          <CheckCheck size={16} color="#94A3B8" />
        ) : (
          <Check size={16} color="#94A3B8" />
        )}
      </View>
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const hasUnread = item.unread_count > 0;
    const isOnline = Math.random() > 0.5; // Mock online status - replace with real data

    const handleChatPress = () => {
      router.push(`/(chat)/${item.id}`);
    };

    return (
      <TouchableOpacity
        style={[styles.chatItem, hasUnread && styles.unreadChat]}
        onPress={handleChatPress}
      >
        <View style={styles.avatarContainer}>
          {item.user.avatar_url ? (
            <Image
              source={{ uri: item.user.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <User size={24} color="#94A3B8" />
            </View>
          )}
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[styles.userName, hasUnread && styles.unreadText]}>
              {item.user.name}
            </Text>
            {item.last_message && (
              <Text style={[styles.timestamp, hasUnread && styles.unreadText]}>
                {formatDistanceToNow(new Date(item.last_message.created_at), { addSuffix: true })}
              </Text>
            )}
          </View>

          <View style={styles.lastMessage}>
            <View style={styles.messagePreview}>
              {item.last_message ? (
                <>
                  <Text 
                    style={[styles.messageText, hasUnread && styles.unreadText]} 
                    numberOfLines={2}
                  >
                    {item.last_message.content}
                  </Text>
                  {renderMessageStatus(item.last_message)}
                </>
              ) : (
                <Text style={styles.noMessages}>No messages yet</Text>
              )}
            </View>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unread_count}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color="#64748B" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {renderQuickActions()}

      {!filteredChats || filteredChats.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageCircle size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptyText}>
            Start connecting with other users to see your conversations here
          </Text>
          <TouchableOpacity style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Browse Deliveries</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  chatList: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    marginVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  unreadChat: {
    backgroundColor: '#F8FAFC',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    marginRight: 8,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadText: {
    fontWeight: '700',
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748B',
  },
  lastMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },
  messageStatus: {
    marginLeft: 4,
  },
  noMessages: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});