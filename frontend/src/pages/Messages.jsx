import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import DemoBadge from '../components/common/DemoBadge';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversation data
  const mockConversations = [
    {
      id: 1,
      participant: {
        id: 1,
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6d6b3b0?w=150',
        role: 'alumni',
        isOnline: true
      },
      lastMessage: {
        content: 'Thanks for the guidance on the ML project!',
        timestamp: '2025-09-17T14:30:00Z',
        senderId: 1
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 'current-user',
          content: 'Hi Priya! Thank you for your help with my project. I have a few more questions about NLP if you have time.',
          timestamp: '2025-09-17T14:30:00Z'
        },
        {
          id: 2,
          senderId: 1,
          content: 'Of course! Always happy to help. What specific aspects of NLP are you working on?',
          timestamp: '2025-09-17T14:35:00Z'
        },
        {
          id: 3,
          senderId: 'current-user',
          content: 'I\'m trying to implement sentiment analysis for my chatbot project. Having trouble with preprocessing the text data.',
          timestamp: '2025-09-17T14:40:00Z'
        },
        {
          id: 4,
          senderId: 1,
          content: 'Ah, preprocessing is crucial! For sentiment analysis, you\'ll want to handle things like tokenization, removing stop words, and stemming. Have you looked into NLTK or spaCy?',
          timestamp: '2025-09-17T14:45:00Z'
        },
        {
          id: 5,
          senderId: 1,
          content: 'Thanks for the guidance on the ML project!',
          timestamp: '2025-09-17T15:00:00Z'
        }
      ]
    },
    {
      id: 2,
      participant: {
        id: 2,
        name: 'Rahul Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'alumni',
        isOnline: false
      },
      lastMessage: {
        content: 'Sure, I can review your resume. Send it over!',
        timestamp: '2025-09-17T12:00:00Z',
        senderId: 2
      },
      unreadCount: 1,
      messages: [
        {
          id: 1,
          senderId: 'current-user',
          content: 'Hello Rahul! I saw your post about Tesla openings. I\'m really interested in sustainable energy and would love to learn more about opportunities for EE students.',
          timestamp: '2025-09-17T11:30:00Z'
        },
        {
          id: 2,
          senderId: 2,
          content: 'Hi! Great to hear from you. Tesla is always looking for passionate engineers. What\'s your background and what specific areas interest you?',
          timestamp: '2025-09-17T11:45:00Z'
        },
        {
          id: 3,
          senderId: 'current-user',
          content: 'I\'m in my second year of EE, focusing on power systems and renewable energy. I\'ve done some projects with solar panel optimization.',
          timestamp: '2025-09-17T12:00:00Z'
        },
        {
          id: 4,
          senderId: 2,
          content: 'That sounds perfect! Tesla has several teams working on energy storage and solar. Would you like me to review your resume and provide some guidance?',
          timestamp: '2025-09-17T12:15:00Z'
        },
        {
          id: 5,
          senderId: 2,
          content: 'Sure, I can review your resume. Send it over!',
          timestamp: '2025-09-17T12:30:00Z'
        }
      ]
    },
    {
      id: 3,
      participant: {
        id: 3,
        name: 'Vikram Singh',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'alumni',
        isOnline: true
      },
      lastMessage: {
        content: 'Happy to help! Let\'s schedule a call next week.',
        timestamp: '2025-09-17T10:00:00Z',
        senderId: 3
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          senderId: 'current-user',
          content: 'Hi Vikram! I\'m really interested in product management and would love to learn more about your journey at Microsoft.',
          timestamp: '2025-09-17T09:30:00Z'
        },
        {
          id: 2,
          senderId: 3,
          content: 'Hello! I\'d be happy to share my experience. Product management is a great field - very dynamic and impactful.',
          timestamp: '2025-09-17T09:45:00Z'
        },
        {
          id: 3,
          senderId: 3,
          content: 'Happy to help! Let\'s schedule a call next week.',
          timestamp: '2025-09-17T10:00:00Z'
        }
      ]
    }
  ];

  const [conversations, setConversations] = useState(mockConversations);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      senderId: 'current-user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: {
              content: newMessage,
              timestamp: message.timestamp,
              senderId: 'current-user'
            }
          }
        : conv
    ));

    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                  <DemoBadge label="Static demo" />
                </div>
                <Button size="sm" className="flex items-center space-x-1">
                  <PlusIcon className="h-4 w-4" />
                  <span>New</span>
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={conversation.participant.avatar}
                      name={conversation.participant.name}
                      size="md"
                      showStatus
                      isOnline={conversation.participant.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.participant.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={selectedConversation.participant.avatar}
                      name={selectedConversation.participant.name}
                      size="md"
                      showStatus
                      isOnline={selectedConversation.participant.isOnline}
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedConversation.participant.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {selectedConversation.participant.role} • {selectedConversation.participant.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === 'current-user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'current-user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="rounded-full p-2 w-10 h-10 flex items-center justify-center"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              /* No conversation selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Messages;