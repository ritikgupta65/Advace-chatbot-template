
import { useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, MessageCircle, Plus } from 'lucide-react';
import { Message, ChatState } from '@/types/chat';
import MessageBubble from './MessageBubble';
import LoadingAnimation from './LoadingAnimation';
import MessageInput from './MessageInput';
import NavigationBar from './NavigationBar';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onGoHome: () => void;
  onNewChat: () => void;
  isConnected: boolean;
  transcript: { role: string; text: string; timestamp: number }[];
  startCall: () => void;
  stopCall: () => void;
  currentView: ChatState;
  onNavigate: (view: ChatState) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onGoHome,
  onNewChat,
  isConnected,
  transcript,
  startCall,
  stopCall,
  currentView,
  onNavigate,
}) => {
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, transcript]);

  // Convert transcript to Message objects using provided timestamps
  const transcriptMessages: Message[] = transcript.map((msg, index) => ({
    id: `transcript-${index}`,
    content: msg.text,
    sender: msg.role === 'user' ? 'user' : 'bot',
    timestamp: new Date(msg.timestamp),
  }));

  // Combine and sort messages by timestamp
  const allMessages: Message[] = [...messages, ...transcriptMessages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div className="h-full flex flex-col">
      {/* Professional Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onGoHome}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors mr-3"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center mr-3">
                <span className="text-black font-bold text-sm">W</span>
              </div>
              <div>
                <h2 className="text-white font-medium text-sm">{theme.brandName}</h2>
                <p className="text-green-200 text-xs">Online</p>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center px-3 py-1.5 bg-transparent border border-white/20 rounded-lg hover:border-white/30 hover:bg-white/10 transition-all duration-200 text-white text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            New
          </button>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
        {allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center mb-3">
              <span className="text-black font-bold">W</span>
            </div>
            <p className="text-white/70 text-sm">Start a conversation by typing a message below</p>
          </div>
        ) : (
          <>
            {allMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingAnimation />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0">
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          isConnected={isConnected}
          startCall={startCall}
          stopCall={stopCall}
        />
      </div>

      {/* Navigation Bar inside chat window */}
      <div className="flex-shrink-0">
        <NavigationBar currentView={currentView} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default ChatWindow;
