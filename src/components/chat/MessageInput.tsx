import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Send, Paperclip, Mic, X, File, Image } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(message.trim(), attachments.length > 0 ? attachments : undefined);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="sticky bottom-0 p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-black/30 via-black/20 to-transparent backdrop-blur-xl border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white/90 border border-white/20"
              >
                {getFileIcon(file)}
                <span className="truncate max-w-[150px]">{file.name}</span>
                <span className="text-white/60 text-xs">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={`hidden sm:flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-200 backdrop-blur-sm flex-shrink-0 ${
              disabled 
                ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
            }`}
          >
            <Paperclip className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message..."
              disabled={disabled}
              className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-white/10 backdrop-blur-lg border rounded-2xl sm:rounded-3xl text-white placeholder-gray-400 resize-none focus:outline-none transition-all duration-300 min-h-[48px] sm:min-h-[56px] max-h-[120px] text-sm sm:text-base ${
                isFocused 
                  ? `ring-2 ring-white/30 border-white/30 bg-white/15` 
                  : 'border-white/20 hover:border-white/30'
              } ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              rows={1}
            />
          </div>

          {/* Voice Button - Mobile only (when no message and no attachments) */}
          {!message.trim() && attachments.length === 0 && (
            <button
              type="button"
              disabled={disabled}
              className={`sm:hidden flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 backdrop-blur-sm ${
                disabled 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                  : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}

          {/* Mobile Attachment Button (when no message but no send button needed) */}
          {!message.trim() && attachments.length === 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={`sm:hidden flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 backdrop-blur-sm ${
                disabled 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                  : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
          )}
          
          {/* Send Button */}
          {(message.trim() || attachments.length > 0) && (
            <button
              type="submit"
              disabled={(!message.trim() && attachments.length === 0) || disabled}
              className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 transform ${
                (message.trim() || attachments.length > 0) && !disabled
                  ? `bg-gradient-to-r ${theme.primaryGradient} text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`
                  : 'bg-white/10 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </form>

        {/* Quick Suggestions - Only show on larger screens when not typing and no attachments */}
        {!message.trim() && attachments.length === 0 && (
          <div className="hidden sm:flex flex-wrap gap-2 mt-3 justify-center">
            {['Ask a question', 'Track order', 'Get help'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setMessage(suggestion)}
                disabled={disabled}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 backdrop-blur-sm border ${
                  disabled
                    ? 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;