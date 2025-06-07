import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Message, RegularMessage, TypingMessage } from '@/types/chat';
import { 
  User, 
  MessageCircle, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Volume2,
  RotateCcw,
  Share
} from 'lucide-react';

const isRegularMessage = (message: Message): message is RegularMessage => {
  return 'content' in message;
};

const isTypingMessage = (message: Message): message is TypingMessage => {
  return 'isTyping' in message;
};

interface MessageBubbleProps {
  message: Message;
  enableSpeech?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, enableSpeech = false }) => {
  const { theme } = useTheme();
  const [showActions, setShowActions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const isUser = isRegularMessage(message) ? message.sender === 'user' : false;

  const copyMessage = async () => {
    try {
      if (isRegularMessage(message)) {
        await navigator.clipboard.writeText(message.content);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const speakMessage = () => {
    if ('speechSynthesis' in window && isRegularMessage(message)) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use a more natural voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Neural') || voice.name.includes('Premium')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    // Here you could send feedback to your analytics or improvement system
    console.log(`Feedback for message ${message.id}: ${type}`);
  };

  const shareMessage = async () => {
    if (isRegularMessage(message)) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'AI Assistant Message',
            text: message.content,
          });
        } catch (error) {
          console.error('Error sharing:', error);
          copyMessage(); // Fallback to copy
        }
      } else {
        copyMessage(); // Fallback for browsers without Web Share API
      }
    } else {
      console.log('Cannot share typing message');
    }
  };

  const formatMessageContent = (content: string) => {
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-white/20 px-1 rounded text-sm">$1</code>');
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group animate-fade-in`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isUser 
              ? 'bg-white/20 group-hover:bg-white/30 group-hover:scale-110' 
              : `bg-gradient-to-r ${theme.primaryGradient} group-hover:shadow-lg group-hover:scale-110`
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : theme.logoUrl ? (
              <img 
                src={theme.logoUrl} 
                alt="Bot" 
                className="w-8 h-8 rounded-full object-cover" 
              />
            ) : (
              <MessageCircle className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="relative flex-1">
          <div className={`relative p-4 rounded-2xl transition-all duration-300 ${
            isUser
              ? `bg-gradient-to-r ${theme.primaryGradient} text-white shadow-lg group-hover:shadow-xl transform group-hover:scale-[1.02]`
              : 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg group-hover:shadow-xl hover:bg-white/15 transform group-hover:scale-[1.02]'
          }`}>
            {isTypingMessage(message) ? (
              <div className="flex space-x-1 py-2">
                <div className={`w-2 h-2 bg-gradient-to-r ${theme.primaryGradient} rounded-full animate-bounce`}></div>
                <div className={`w-2 h-2 bg-gradient-to-r ${theme.primaryGradient} rounded-full animate-bounce delay-100`}></div>
                <div className={`w-2 h-2 bg-gradient-to-r ${theme.primaryGradient} rounded-full animate-bounce delay-200`}></div>
              </div>
            ) : (
              <>
                <div 
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatMessageContent(isRegularMessage(message) ? message.content : '') }}
                />
                
                {/* Timestamp */}
                <p className={`text-xs mt-2 ${
                  isUser ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {isRegularMessage(message) ? message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : ''}
                </p>
              </>
            )}

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

          {/* Message Actions */}
          {!isTypingMessage(message) && (
            <div className={`flex items-center space-x-2 mt-2 transition-all duration-200 ${
              showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            } ${isUser ? 'justify-end' : 'justify-start'}`}>
              {/* Copy Button */}
              <button
                onClick={copyMessage}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10 hover:scale-110"
                title={isCopied ? 'Copied!' : 'Copy message'}
              >
                <Copy className={`w-3 h-3 ${isCopied ? 'text-green-400' : 'text-gray-400'}`} />
              </button>

              {/* Speak Button */}
              {enableSpeech && !isUser && (
                <button
                  onClick={speakMessage}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10 hover:scale-110"
                  title="Read aloud"
                >
                  <Volume2 className="w-3 h-3 text-gray-400" />
                </button>
              )}

              {/* Share Button */}
              <button
                onClick={shareMessage}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10 hover:scale-110"
                title="Share message"
              >
                <Share className="w-3 h-3 text-gray-400" />
              </button>

              {/* Feedback Buttons (only for bot messages) */}
              {!isUser && (
                <>
                  <button
                    onClick={() => handleFeedback('positive')}
                    className={`p-1.5 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/10 hover:scale-110 ${
                      feedback === 'positive' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-white/10 hover:bg-white/20 text-gray-400'
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback('negative')}
                    className={`p-1.5 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/10 hover:scale-110 ${
                      feedback === 'negative' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-white/10 hover:bg-white/20 text-gray-400'
                    }`}
                    title="Poor response"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;