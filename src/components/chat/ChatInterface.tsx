
import { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ChatWindow from './ChatWindow';
import NavigationBar from './NavigationBar';
import { Message, ChatState } from '@/types/chat';

const ChatInterface = () => {
  const [chatState, setChatState] = useState<ChatState>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startChat = (initialMessage?: string) => {
    setChatState('chatting');
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // N8N Webhook Integration
      const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK_URL || '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I apologize, but I encountered an error processing your request.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    setChatState('welcome');
  };

  const startNewChat = () => {
    setMessages([]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        {chatState === 'welcome' ? (
          <WelcomeScreen onStartChat={startChat} />
        ) : (
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onGoHome={goHome}
            onNewChat={startNewChat}
          />
        )}
      </div>
      <NavigationBar currentView={chatState} onNavigate={setChatState} />
    </div>
  );
};

export default ChatInterface;
