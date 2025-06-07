
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/20">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full p-4 pr-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all duration-200 min-h-[56px] max-h-32"
            rows={1}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
            message.trim() && !disabled
              ? `bg-gradient-to-r ${theme.primaryGradient} text-white shadow-xl hover:shadow-2xl`
              : 'bg-white/10 text-gray-400 cursor-not-allowed'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
