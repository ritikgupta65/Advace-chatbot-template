import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ChatWindow from './ChatWindow';
import NavigationBar from './NavigationBar';
import { Message, ChatState, TypingMessage } from '@/types/chat';

const ChatInterface: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Utility to generate or retrieve session ID
  const getSessionId = (): string => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  // Text-to-speech for bot responses
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Simulate "bot is typing" indicator
  const simulateTyping = async () => {
    setIsTyping(true);
    const typingMessage: TypingMessage = {
      id: `typing-${Date.now()}`,
      isTyping: true
    } as TypingMessage;
    setMessages(prev => [...prev, typingMessage]);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setMessages(prev => prev.filter((msg): msg is Message => !('isTyping' in msg)));
    setIsTyping(false);
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    await simulateTyping();

    try {
      const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK_URL || '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          timestamp: new Date().toISOString(),
          sessionId: getSessionId()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botContent = data.response || data.message || 'I apologize, but I encountered an error processing your request.';
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botContent,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      if ('speechSynthesis' in window && data.response) {
        speakMessage(data.response);
      }
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

  // Start chat, optionally with an initial message
  const startChat = (initialMessage?: string) => {
    setChatState('chatting');
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  };

  // Go back to welcome
  const goHome = () => {
    setChatState('welcome');
  };

  // Start a new chat session
  const startNewChat = () => {
    setMessages([]);
    setIsLoading(false);
    setIsTyping(false);
  };

  // Export chat to JSON
  const exportChat = () => {
    const chatData = {
      messages,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId()
    };
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Auto-save chat to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      try {
        const parsedMessages = JSON.parse(savedChat);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages.map((msg: Message) => {
            if ('content' in msg) {
              return {
                ...msg,
                timestamp: new Date(msg.timestamp)
              };
            }
            return msg;
          }));
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.02&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {chatState === 'welcome' ? (
          <WelcomeScreen onStartChat={startChat} />
        ) : (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onGoHome={goHome}
            onNewChat={startNewChat}
            onExportChat={exportChat}
          />
        )}
      </div>

      <NavigationBar
        currentView={chatState}
        onNavigate={setChatState}
      />
    </div>
  );
};

export default ChatInterface;