
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import LoadingAnimation from './LoadingAnimation';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onGoHome: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  isLoading, 
  onSendMessage, 
  onGoHome 
}) => {
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col max-h-screen">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center">
          <button
            onClick={onGoHome}
            className="p-2 rounded-full hover:bg-white/20 transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center">
            {theme.logoUrl ? (
              <img 
                src={theme.logoUrl} 
                alt={theme.brandName}
                className="w-10 h-10 rounded-full mr-3"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.primaryGradient} flex items-center justify-center mr-3`}>
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-white font-semibold">{theme.brandName}</h2>
              <p className="text-gray-300 text-sm">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${theme.primaryGradient} flex items-center justify-center mb-4`}>
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400">Start a conversation by typing a message below</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingAnimation />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;
