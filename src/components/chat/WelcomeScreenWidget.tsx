
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Phone, User } from 'lucide-react';

interface WelcomeScreenWidgetProps {
  onStartChat: (initialMessage?: string) => void;
}

const WelcomeScreenWidget: React.FC<WelcomeScreenWidgetProps> = ({ onStartChat }) => {
  const { theme } = useTheme();

  return (
    <div className="h-full flex flex-col">
      {/* Header with Logo - positioned at top left */}
      <div className="flex items-start justify-start p-4 pb-2">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
          <span className="text-black font-bold text-sm">W</span>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-white text-lg font-medium mb-1">Hi, there!</h2>
          <p className="text-gray-300 text-sm">How can we help you today??</p>
        </div>

        {/* Main Action Button */}
        <div className="mb-4">
          <button
            onClick={() => onStartChat()}
            className="w-full bg-transparent border border-gray-600 hover:border-gray-400 text-white p-3 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-gray-800/30 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Ask a question</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        {/* Secondary Action Buttons */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => onStartChat('Track my order')}
            className="flex-1 bg-transparent border border-gray-600 hover:border-gray-400 text-white text-xs py-2.5 px-3 rounded-lg transition-all duration-300 hover:bg-gray-800/30 hover:scale-[1.02]"
          >
            Track my order
          </button>
          <button 
            onClick={() => onStartChat('Show me new arrivals')}
            className="flex-1 bg-transparent border border-gray-600 hover:border-gray-400 text-white text-xs py-2.5 px-3 rounded-lg transition-all duration-300 hover:bg-gray-800/30 hover:scale-[1.02]"
          >
            New arrivals
          </button>
        </div>

        {/* Recent Conversation */}
        <div className="mb-6">
          <h3 className="text-white text-sm font-medium mb-3">Recent Conversation</h3>
          <div className="bg-gray-800/50 border border-gray-700 hover:border-gray-500 rounded-lg p-3 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:scale-[1.01]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-300 text-xs mb-1">Hi, I am Wakao ai virtual assistant, ho...</p>
                <p className="text-gray-500 text-xs">an hour ago</p>
              </div>
              <span className="text-gray-400 ml-2">›</span>
            </div>
          </div>
        </div>

        {/* Additional Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onStartChat('Start a live call')}
            className="w-full bg-transparent border border-gray-600 hover:border-gray-400 text-white p-3 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-gray-800/30 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Start a live call</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>

          <button
            onClick={() => onStartChat('Talk to a human agent')}
            className="w-full bg-transparent border border-gray-600 hover:border-gray-400 text-white p-3 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-gray-800/30 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-center">
              <User className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Talk to a human agent</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreenWidget;
