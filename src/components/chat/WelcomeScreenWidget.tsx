
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Phone, User } from 'lucide-react';

interface WelcomeScreenWidgetProps {
  onStartChat: (initialMessage?: string) => void;
}

const WelcomeScreenWidget: React.FC<WelcomeScreenWidgetProps> = ({ onStartChat }) => {
  const { theme } = useTheme();

  const quickActions = [
    { text: 'Ask a question', icon: MessageCircle },
    { text: 'Track my order', action: () => onStartChat('Track my order') },
    { text: 'New arrivals', action: () => onStartChat('Show me new arrivals') },
  ];

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header with Logo */}
      <div className="flex items-center justify-center mb-6 mt-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center mr-3">
            <span className="text-black font-bold text-lg">W</span>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="text-center mb-6">
        <h2 className="text-white text-xl font-semibold mb-2">Hi, there!</h2>
        <p className="text-gray-300 text-sm">How can we help you today??</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => onStartChat()}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-between transition-colors"
        >
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">Ask a question</span>
          </div>
          <span>›</span>
        </button>

        <div className="flex space-x-2">
          <button 
            onClick={() => onStartChat('Track my order')}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white text-xs py-2 px-3 rounded-lg transition-colors"
          >
            Track my order
          </button>
          <button 
            onClick={() => onStartChat('Show me new arrivals')}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white text-xs py-2 px-3 rounded-lg transition-colors"
          >
            New arrivals
          </button>
        </div>
      </div>

      {/* Recent Conversation */}
      <div className="mb-6">
        <h3 className="text-white text-sm font-medium mb-2">Recent Conversation</h3>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs">Hi, I am Wakao ai virtual assistant, ho...</p>
              <p className="text-gray-500 text-xs">an hour ago</p>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="space-y-2">
        <button
          onClick={() => onStartChat('Start a live call')}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center justify-between transition-colors"
        >
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">Start a live call</span>
          </div>
          <span>›</span>
        </button>

        <button
          onClick={() => onStartChat('Talk to a human agent')}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center justify-between transition-colors"
        >
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm">Talk to a human agent</span>
          </div>
          <span>›</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreenWidget;
