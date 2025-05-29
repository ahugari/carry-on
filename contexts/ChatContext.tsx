import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { mockChats, mockMessages } from '@/data/mockChats';

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  read: boolean;
};

export type Chat = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  last_message?: Message;
  unread_count: number;
};

type ChatContextType = {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  setCurrentChat: (chat: Chat | null) => void;
  sendMessage: (content: string, imageUrl?: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chats for the current user
  useEffect(() => {
    if (session?.user.id) {
      loadChats();
      subscribeToChats();
    } else {
      // Use mock data when not logged in or no real data
      setChats(mockChats);
    }
  }, [session?.user.id]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.id);
      subscribeToMessages(currentChat.id);
    }
  }, [currentChat?.id]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select('id, user:profiles!receiver_id(id, name, avatar_url), last_message:messages(id, sender_id, receiver_id, content, image_url, created_at, read), unread_count')
        .eq('sender_id', session!.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Use mock data if no real chats exist
        setChats(mockChats);
        return;
      }

      const formattedChats: Chat[] = data.map(chat => ({
        id: chat.id,
        user: {
          id: chat.user[0].id,
          name: chat.user[0].name,
          avatar_url: chat.user[0].avatar_url,
        },
        last_message: chat.last_message?.[0],
        unread_count: chat.unread_count || 0,
      }));

      setChats(formattedChats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats');
      // Use mock data on error
      setChats(mockChats);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Use mock messages if no real messages exist
        setMessages(mockMessages[chatId] || []);
        return;
      }

      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      // Use mock messages on error
      setMessages(mockMessages[chatId] || []);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChats = () => {
    const subscription = supabase
      .channel('chats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `sender_id=eq.${session!.user.id}`,
      }, () => {
        loadChats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const subscribeToMessages = (chatId: string) => {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        if (payload.new) {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!currentChat || !session) {
      // For mock data, just add the message locally
      if (currentChat) {
        const newMessage: Message = {
          id: `mock_${Date.now()}`,
          sender_id: 'current_user',
          receiver_id: currentChat.user.id,
          content,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
          read: false,
        };
        setMessages(prev => [...prev, newMessage]);
        return;
      }
      return;
    }

    try {
      const { error } = await supabase.from('messages').insert({
        chat_id: currentChat.id,
        sender_id: session.user.id,
        receiver_id: currentChat.user.id,
        content,
        image_url: imageUrl,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const markAsRead = async (chatId: string) => {
    if (!session) {
      // For mock data, just mark messages as read locally
      setMessages(prev => prev.map(msg => ({
        ...msg,
        read: true,
      })));
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('chat_id', chatId)
        .eq('receiver_id', session.user.id)
        .eq('read', false);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark messages as read');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        setCurrentChat,
        sendMessage,
        markAsRead,
        loading,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 