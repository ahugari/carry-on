import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Check, CheckCheck, Search } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Message List */}
        <View style={styles.listContainer}>
          {conversations.length > 0 ? (
            conversations.map(conversation => (
              <Link key={conversation.id} href={`/messages/${conversation.id}`} asChild>
                <TouchableOpacity style={styles.conversationItem}>
                  <Image source={{ uri: conversation.user.image }} style={styles.userImage} />
                  {conversation.unread && <View style={styles.unreadIndicator} />}
                  
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <Text style={styles.userName}>{conversation.user.name}</Text>
                      <Text style={styles.messageTime}>{conversation.lastMessageTime}</Text>
                    </View>
                    
                    <View style={styles.conversationPreview}>
                      <Text 
                        style={[styles.lastMessage, conversation.unread && styles.unreadMessage]}
                        numberOfLines={1}
                      >
                        {conversation.lastMessage}
                      </Text>
                      
                      {conversation.read && (
                        conversation.read === 'delivered' ? 
                          <Check size={16} color="#94A3B8" /> : 
                          <CheckCheck size={16} color="#3B82F6" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/3867210/pexels-photo-3867210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
                style={styles.emptyStateImage}
              />
              <Text style={styles.emptyStateTitle}>No messages yet</Text>
              <Text style={styles.emptyStateText}>
                When you connect with other users, your conversations will appear here.
              </Text>
            </View>
          )}
        </View>
        
        {/* Bottom padding for tab bar */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

// Sample conversation data
const conversations = [
  {
    id: '1',
    user: {
      name: 'Michael Scott',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    lastMessage: 'I\'m interested in sending my package with you to London. Is there still space available?',
    lastMessageTime: '10:30 AM',
    unread: true,
    read: null,
  },
  {
    id: '2',
    user: {
      name: 'Sophia Lee',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    lastMessage: 'Perfect! I can meet you at the airport on Friday at 2 PM.',
    lastMessageTime: 'Yesterday',
    unread: false,
    read: 'read',
  },
  {
    id: '3',
    user: {
      name: 'Thomas Klein',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    lastMessage: 'Thanks for delivering my package safely. I just left you a 5-star review!',
    lastMessageTime: 'Aug 5',
    unread: false,
    read: 'delivered',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    left: 46,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  messageTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
  },
  conversationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    marginRight: 4,
  },
  unreadMessage: {
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
});