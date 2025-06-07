import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Clock, Phone, User, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: (message?: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const { theme } = useTheme();

  const handleQuickAction = (action: string) => {
    onStartChat(action);
  };

  const quickActions = [
    { text: 'Ask a question', icon: MessageCircle },
    { text: 'Track my order', icon: Clock },
    { text: 'Get support', icon: Shield },
    { text: 'New features', icon: Sparkles },
  ];

  const recentConversations = [
    {
      id: 1,
      preview: "Great! Please provide the following details...",
      timestamp: "2 minutes ago"
    }
  ];

  // Feature section removed

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-r from-emerald-400/10 to-lime-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-r from-lime-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-r from-emerald-400/5 to-lime-400/5 rounded-full blur-3xl animate-pulse [animation-delay:4s]"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto w-full">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            {theme.logoUrl ? (
              <img 
                src={theme.logoUrl} 
                alt={theme.brandName}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-2xl shadow-2xl animate-pulse"
              />
            ) : (
              <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${theme.primaryGradient} shadow-2xl flex items-center justify-center animate-pulse`}>
                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            )}
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Hi, there! 👋
            </h1>
            <p className="text-white/80 text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
              How can we help you today?
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.text)}
                  className="group p-4 sm:p-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 hover:border-white/30 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${theme.primaryGradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="font-medium text-sm sm:text-base lg:text-lg">{action.text}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feature section removed */}

          {/* Recent Conversations */}
          {recentConversations.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-4 sm:mb-6">Recent Conversation</h3>
              {recentConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onStartChat()}
                  className="w-full p-4 sm:p-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 hover:border-white/30 text-left transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm sm:text-base mb-2">{conversation.preview}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{conversation.timestamp}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all ml-4" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Additional Actions */}
          <div className="space-y-3 sm:space-y-4">
            <button
              className="w-full p-4 sm:p-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 hover:border-white/30 text-white transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-sm sm:text-base lg:text-lg block">Start a live call</span>
                    <span className="text-white/70 text-xs sm:text-sm">Connect instantly</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="sm:hidden h-20"></div>
    </div>
  );
};

export default WelcomeScreen;