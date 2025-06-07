import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle } from 'lucide-react';

const LoadingAnimation = () => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-start mb-4 px-3 sm:px-4">
      <div className="flex items-start max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-2 sm:mr-3">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${theme.primaryGradient} flex items-center justify-center shadow-lg`}>
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Bot" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
            ) : (
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            )}
          </div>
        </div>

        {/* Loading Bubble */}
        <div className="relative px-4 py-3 sm:px-5 sm:py-4 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl animate-pulse">
          <div className="flex space-x-1.5">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r ${theme.primaryGradient} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r ${theme.primaryGradient} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r ${theme.primaryGradient} rounded-full animate-bounce`}></div>
          </div>
          
          {/* Message Tail */}
          <div className="absolute top-3 sm:top-4 left-0 transform -translate-x-0.5">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rotate-45 bg-white/10 border-l border-t border-white/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;