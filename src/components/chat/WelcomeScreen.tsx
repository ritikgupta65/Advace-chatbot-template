
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Clock, Settings, User } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: (message?: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const { theme } = useTheme();

  const handleQuickAction = (action: string) => {
    onStartChat(action);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400/10 to-lime-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-lime-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto text-center">
        {/* Logo Section */}
        <div className="mb-8">
          {theme.logoUrl ? (
            <img 
              src={theme.logoUrl} 
              alt={theme.brandName}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-2xl"
            />
          ) : (
            <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${theme.primaryGradient} shadow-2xl flex items-center justify-center`}>
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-white mb-2">{theme.brandName}</h1>
          <p className="text-gray-300 text-lg">{theme.welcomeMessage}</p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 mb-8">
          {theme.quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="w-full p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{action}</span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Start Chat Button */}
        <button
          onClick={() => onStartChat()}
          className={`w-full p-4 bg-gradient-to-r ${theme.primaryGradient} rounded-2xl text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
        >
          Start New Conversation
        </button>

        {/* Recent Activity Hint */}
        <div className="mt-8 flex items-center justify-center text-gray-400 text-sm">
          <Clock className="w-4 h-4 mr-2" />
          <span>Recent conversations will appear here</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
