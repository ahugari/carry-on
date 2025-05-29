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
import { ArrowLeft, Send, Image as ImageIcon, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useChat, type Message } from '@/contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';

type RootStackParamList = {
  'chat/[id]': { id: string };
};

export default function ChatScreen() {
  const router = useRouter();
  const route = useRoute<RouteProp<RootStackParamList, 'chat/[id]'>>();
  const id = route.params.id;
  const { currentChat, messages, sendMessage, markAsRead } = useChat();
  const [messageText, setMessageText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (id) {
      markAsRead(id);
    }
  }, [id]);

  const handleSend = async () => {
    if (messageText.trim()) {
      await sendMessage(messageText.trim());
      setMessageText('');
    }
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
        // TODO: Implement image upload to storage
        const imageUrl = result.assets[0].uri;
        await sendMessage('', imageUrl);
      } catch (error) {
        console.error('Failed to upload image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isSender = message.sender_id === currentChat?.user.id;

    return (
      <View style={[styles.messageContainer, isSender ? styles.receivedMessage : styles.sentMessage]}>
        {message.image_url ? (
          <Image source={{ uri: message.image_url }} style={styles.messageImage} />
        ) : (
          <Text style={[styles.messageText, isSender ? styles.receivedText : styles.sentText]}>
            {message.content}
          </Text>
        )}
        <Text style={[styles.timestamp, isSender ? styles.receivedTimestamp : styles.sentTimestamp]}>
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </Text>
      </View>
    );
  };

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
          {currentChat?.user.avatar_url ? (
            <Image
              source={{ uri: currentChat.user.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <User size={20} color="#94A3B8" />
            </View>
          )}
          <Text style={styles.userName}>{currentChat?.user.name}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

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
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
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
    borderRadius: 8,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  sentTimestamp: {
    color: '#E2E8F0',
    textAlign: 'right',
  },
  receivedTimestamp: {
    color: '#94A3B8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'Inter-Regular',
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
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
}); 