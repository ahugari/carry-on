import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Send, Image as ImageIcon, User, Package, MapPin, Calendar, Info, CheckCheck, Check, MessageCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useChat, type Message, type Chat } from '@/contexts/ChatContext';
import { formatDistanceToNow, format } from 'date-fns';

type RootStackParamList = {
  '(chat)/[id]': { id: string };
};

type DeliveryInfo = {
  status: 'pending' | 'active' | 'completed';
  item: string;
  origin: string;
  destination: string;
  date: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const route = useRoute<RouteProp<RootStackParamList, '(chat)/[id]'>>();
  const id = route.params?.id;
  const { chats, currentChat, messages, sendMessage, markAsRead, setCurrentChat } = useChat();
  const [messageText, setMessageText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  // Select the current chat when the screen loads
  useEffect(() => {
    if (id && (!currentChat || currentChat.id !== id)) {
      const chat = chats.find(c => c.id === id);
      if (chat) {
        setCurrentChat(chat);
      } else {
        // If chat not found, go back
        router.back();
      }
    }
  }, [id, chats]);

  // Mock delivery info - in real app, this would come from the backend
  const deliveryInfo: DeliveryInfo = {
    status: 'active',
    item: 'Gaming Laptop',
    origin: 'Boston, MA',
    destination: 'New York, NY',
    date: new Date().toISOString(),
  };

  useEffect(() => {
    if (currentChat?.id) {
      markAsRead(currentChat.id);
    }
  }, [currentChat?.id]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    const text = messageText;
    setMessageText('');
    await sendMessage(text);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setIsUploading(true);
      try {
        // In a real app, upload the image and get the URL
        const imageUrl = result.assets[0].uri;
        await sendMessage('', imageUrl);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const renderDeliveryInfo = () => (
    <View style={styles.deliveryInfo}>
      <View style={styles.deliveryHeader}>
        <Package size={20} color="#3B82F6" />
        <Text style={styles.deliveryTitle}>Delivery Details</Text>
      </View>
      <View style={styles.deliveryContent}>
        <View style={styles.deliveryRow}>
          <Text style={styles.deliveryLabel}>Item:</Text>
          <Text style={styles.deliveryValue}>{deliveryInfo.item}</Text>
        </View>
        <View style={styles.deliveryRow}>
          <MapPin size={16} color="#64748B" />
          <Text style={styles.deliveryRoute}>
            {deliveryInfo.origin} → {deliveryInfo.destination}
          </Text>
        </View>
        <View style={styles.deliveryRow}>
          <Calendar size={16} color="#64748B" />
          <Text style={styles.deliveryDate}>
            {format(new Date(deliveryInfo.date), 'MMM d, yyyy')}
          </Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(deliveryInfo.status)]}>
          <Text style={styles.statusText}>
            {deliveryInfo.status.charAt(0).toUpperCase() + deliveryInfo.status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderMessageStatus = (message: Message) => {
    const isRead = message.read;
    const isSent = true;
    
    return (
      <View style={styles.messageStatus}>
        {isRead ? (
          <CheckCheck size={14} color="#3B82F6" />
        ) : isSent ? (
          <CheckCheck size={14} color="#94A3B8" />
        ) : (
          <Check size={14} color="#94A3B8" />
        )}
      </View>
    );
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isSender = message.sender_id === currentChat?.user.id;
    const showAvatar = !isSender;

    return (
      <View style={[styles.messageContainer, isSender ? styles.receivedMessage : styles.sentMessage]}>
        {showAvatar && (
          <View style={styles.messageAvatar}>
            {currentChat?.user.avatar_url ? (
              <Image source={{ uri: currentChat.user.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <User size={20} color="#94A3B8" />
              </View>
            )}
          </View>
        )}
        <View style={styles.messageContent}>
          {message.image_url ? (
            <Image source={{ uri: message.image_url }} style={styles.messageImage} />
          ) : (
            <View style={[styles.messageBubble, isSender ? styles.receivedBubble : styles.sentBubble]}>
              <Text style={[styles.messageText, isSender ? styles.receivedText : styles.sentText]}>
                {message.content}
              </Text>
            </View>
          )}
          <View style={styles.messageFooter}>
            <Text style={styles.timestamp}>
              {format(new Date(message.created_at), 'h:mm a')}
            </Text>
            {!isSender && renderMessageStatus(message)}
          </View>
        </View>
      </View>
    );
  };

  const getStatusStyle = (status: DeliveryInfo['status']) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusPending;
    }
  };

  const renderEmptyChat = () => (
    <View style={styles.emptyChat}>
      <MessageCircle size={48} color="#94A3B8" />
      <Text style={styles.emptyTitle}>Start a Conversation</Text>
      <Text style={styles.emptyText}>
        Discuss delivery details, timing, and any special requirements with {currentChat?.user.name}
      </Text>
    </View>
  );

  if (!currentChat) {
    router.back();
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {currentChat.user.avatar_url ? (
            <Image
              source={{ uri: currentChat.user.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <User size={20} color="#94A3B8" />
            </View>
          )}
          <View>
            <Text style={styles.userName}>{currentChat.user.name}</Text>
            <Text style={styles.userStatus}>
              {deliveryInfo.status === 'active' ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      {renderDeliveryInfo()}

      {messages.length === 0 ? (
        renderEmptyChat()
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleImagePick}
          disabled={isUploading}
        >
          <ImageIcon size={24} color="#64748B" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!messageText.trim() || isUploading}
        >
          <Send size={20} color={messageText.trim() ? '#FFFFFF' : '#94A3B8'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  userStatus: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryInfo: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  deliveryContent: {
    gap: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  deliveryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  deliveryRoute: {
    fontSize: 14,
    color: '#1F2937',
  },
  deliveryDate: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusActive: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusCompleted: {
    backgroundColor: '#DBEAFE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageContent: {
    flex: 1,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '100%',
  },
  sentBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  sentText: {
    color: '#FFFFFF',
  },
  receivedText: {
    color: '#1F2937',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748B',
  },
  messageStatus: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: '#1F2937',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
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
    lineHeight: 24,
  },
}); 