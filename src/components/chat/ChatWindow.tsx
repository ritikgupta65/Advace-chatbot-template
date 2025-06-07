import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ArrowLeft, 
  MessageCircle, 
  Plus, 
  MoreVertical, 
  Download,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Message, RegularMessage, TypingMessage } from '@/types/chat';
import MessageBubble from './MessageBubble';
import LoadingAnimation from './LoadingAnimation';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isTyping?: boolean;
  onSendMessage: (message: string) => void;
  onGoHome: () => void;
  onNewChat: () => void;
  onExportChat?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  isLoading, 
  isTyping = false,
  onSendMessage, 
  onGoHome,
  onNewChat,
  onExportChat
}) => {
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isTyping]);

  // Handle scroll to detect if user is at bottom
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setAutoScroll(isAtBottom);
    }
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    if (isSpeechEnabled && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const regenerateLastResponse = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      const isUserMessage = (message: Message): message is RegularMessage => {
        if ('sender' in message) {
          return message.sender === 'user';
        }
        return false;
      };
      const isRegularMessage = (message: Message): message is RegularMessage => 'content' in message;
      const isTypingMessage = (message: Message): message is TypingMessage => 'isTyping' in message;
      if (isUserMessage(lastUserMessage) && isRegularMessage(lastUserMessage)) {
        onSendMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col max-h-screen">
      {/* Enhanced Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onGoHome}
              className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 mr-3 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center">
              {theme.logoUrl ? (
                <img 
                  src={theme.logoUrl} 
                  alt={theme.brandName}
                  className="w-10 h-10 rounded-full mr-3 ring-2 ring-white/20"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.primaryGradient} flex items-center justify-center mr-3 shadow-lg`}>
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-white font-semibold">{theme.brandName}</h2>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <p className="text-green-300 text-sm">Online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            {/* Speech Toggle */}
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                isSpeechEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'hover:bg-white/20 text-white/70'
              }`}
              title={isSpeechEnabled ? 'Disable speech' : 'Enable speech'}
            >
              {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="flex items-center px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white text-sm hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </button>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                <MoreVertical className="w-4 h-4 text-white" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-12 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 shadow-xl py-2 min-w-[160px] z-20">
                  <button
                    onClick={() => {
                      onExportChat?.();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Chat
                  </button>
                  <button
                    onClick={() => {
                      regenerateLastResponse();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors flex items-center"
                    disabled={messages.length < 2}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Stats */}
        {messages.length > 0 && (
          <div className="mt-2 text-xs text-white/60">
            {messages.filter(m => 'sender' in m && m.sender === 'user').length} messages • {messages.filter(m => 'sender' in m && m.sender === 'bot').length} responses
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${theme.primaryGradient} flex items-center justify-center mb-4 animate-pulse shadow-lg`}>
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-gray-400 max-w-sm">
              Type a message below to begin chatting with your AI assistant. 
              I'm here to help with any questions you have!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                enableSpeech={isSpeechEnabled}
              />
            ))}
            {(isLoading || isTyping) && <LoadingAnimation />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {!autoScroll && (
        <div className="absolute bottom-20 right-4 z-10">
          <button
            onClick={() => {
              setAutoScroll(true);
              scrollToBottom();
            }}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200 shadow-lg hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 rotate-90" />
          </button>
        </div>
      )}

      {/* Message Input */}
      <MessageInput 
        onSendMessage={onSendMessage} 
        disabled={isLoading} 
      />
    </div>
  );
};

export default ChatWindow;