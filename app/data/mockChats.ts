import type { Chat, Message } from '../contexts/ChatContext';

export const mockChats: Chat[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Sarah Johnson',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
    },
    last_message: {
      id: 'msg1',
      sender_id: 'user1',
      receiver_id: 'current_user',
      content: "Perfect! I'll be there at 2 PM to pick up the package.",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
    },
    unread_count: 1,
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Michael Chen',
      avatar_url: 'https://i.pravatar.cc/150?img=2',
    },
    last_message: {
      id: 'msg2',
      sender_id: 'current_user',
      receiver_id: 'user2',
      content: 'Could you please confirm the delivery address?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: true,
    },
    unread_count: 0,
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Emma Wilson',
      avatar_url: 'https://i.pravatar.cc/150?img=3',
    },
    last_message: {
      id: 'msg3',
      sender_id: 'user3',
      receiver_id: 'current_user',
      content: "Thanks for choosing me as your carrier! I'll take good care of your package.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
    },
    unread_count: 0,
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'msg1_1',
      sender_id: 'current_user',
      receiver_id: 'user1',
      content: 'Hi Sarah! I have a package that needs to be delivered to Boston.',
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: true,
    },
    {
      id: 'msg1_2',
      sender_id: 'user1',
      receiver_id: 'current_user',
      content: "I can help with that! I'm heading to Boston tomorrow.",
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      read: true,
    },
    {
      id: 'msg1_3',
      sender_id: 'current_user',
      receiver_id: 'user1',
      content: 'Great! What time would you be able to pick it up?',
      created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      read: true,
    },
    {
      id: 'msg1_4',
      sender_id: 'user1',
      receiver_id: 'current_user',
      content: "Perfect! I'll be there at 2 PM to pick up the package.",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
  ],
  '2': [
    {
      id: 'msg2_1',
      sender_id: 'user2',
      receiver_id: 'current_user',
      content: 'Hello! I saw your package delivery request to New York.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      read: true,
    },
    {
      id: 'msg2_2',
      sender_id: 'current_user',
      receiver_id: 'user2',
      content: 'Hi Michael! Yes, I need it delivered by next week.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
      read: true,
    },
    {
      id: 'msg2_3',
      sender_id: 'user2',
      receiver_id: 'current_user',
      content: "I can definitely help with that. What's the exact delivery location?",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2.2).toISOString(),
      read: true,
    },
    {
      id: 'msg2_4',
      sender_id: 'current_user',
      receiver_id: 'user2',
      content: 'Could you please confirm the delivery address?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: true,
    },
  ],
  '3': [
    {
      id: 'msg3_1',
      sender_id: 'current_user',
      receiver_id: 'user3',
      content: 'Hi Emma! Are you still available to carry my package to Chicago?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
      read: true,
    },
    {
      id: 'msg3_2',
      sender_id: 'user3',
      receiver_id: 'current_user',
      content: 'Yes, absolutely! I have space in my luggage.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24.5).toISOString(),
      read: true,
    },
    {
      id: 'msg3_3',
      sender_id: 'current_user',
      receiver_id: 'user3',
      content: "Wonderful! I've accepted your offer.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24.2).toISOString(),
      read: true,
    },
    {
      id: 'msg3_4',
      sender_id: 'user3',
      receiver_id: 'current_user',
      content: "Thanks for choosing me as your carrier! I'll take good care of your package.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
    },
  ],
}; 