import { useTheme } from '@/contexts/ThemeContext';
import { Message } from '@/types/chat';
import { User, MessageCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { theme } = useTheme(); 
  const isUser = message.sender === 'user';

  // Format message: *bold*, **bold**, \n -> <br />, <strong>
  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')     // *bold*
      .replace(/\n/g, '<br/>')  
        
    .replace(/\*(?!\*)(.*?)\*/g, '• $1') ;             // *item* → • item
                         // newline
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-white/20' 
              : `bg-gradient-to-r ${theme.primaryGradient}`
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Bot" className="w-8 h-8 rounded-full" />
            ) : (
              <MessageCircle className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Message Bubble */}
        <div className={`relative p-3 rounded-2xl ${
          isUser
            ? `bg-gradient-to-r ${theme.primaryGradient} text-white ml-auto`
            : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
        } shadow-xl`}>
          <p
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />

          {/* Timestamp */}
          <p className={`text-xs mt-1 ${
            isUser ? 'text-white/70' : 'text-gray-400'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>

          {/* Message Tail */}
          <div className={`absolute top-4 ${
            isUser 
              ? 'right-0 transform translate-x-1' 
              : 'left-0 transform -translate-x-1'
          }`}>
            <div className={`w-3 h-3 rotate-45 ${
              isUser 
                ? `bg-gradient-to-r ${theme.primaryGradient}` 
                : 'bg-white/10 border-l border-t border-white/20'
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
