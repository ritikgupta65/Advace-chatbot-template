import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, HelpCircle, Home, Settings, User } from 'lucide-react';
import { ChatState } from '@/types/chat';

interface NavigationBarProps {
  currentView: ChatState;
  onNavigate: (view: ChatState) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentView, onNavigate }) => {
  const { theme } = useTheme();

  const navItems = [
    { id: 'welcome' as ChatState, icon: Home, label: 'Home' },
    { id: 'history' as ChatState, icon: MessageCircle, label: 'Chats' },
    { id: 'faq' as ChatState, icon: HelpCircle, label: 'FAQ' },
  ];

  return (
    <>
      {/* Mobile Navigation - Bottom (unchanged) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="flex justify-around px-2 py-2 safe-area-inset-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center space-y-1 p-3 rounded-xl transition-all duration-300 min-w-[70px] relative ${
                  isActive 
                    ? `text-white` 
                    : 'text-gray-400 hover:text-white active:scale-95'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${theme.primaryGradient} rounded-xl opacity-20`}></div>
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'drop-shadow-lg' : ''}`} />
                <span className={`text-xs font-medium relative z-10 ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className={`absolute -top-1 w-8 h-0.5 bg-gradient-to-r ${theme.primaryGradient} rounded-full`}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop/Tablet Navigation - Horizontal Top */}
      <div className="hidden sm:flex sm:h-16 lg:h-20 bg-black/20 backdrop-blur-xl border-b border-white/10 w-full">
        <div className="flex items-center justify-between w-full px-4 lg:px-6">
          {/* Logo/Brand - Left Side */}
          <div className="flex items-center">
            {theme.logoUrl ? (
              <img 
                src={theme.logoUrl} 
                alt={theme.brandName}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg"
              />
            ) : (
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-r ${theme.primaryGradient} flex items-center justify-center`}>
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
            )}
            <span className="ml-3 text-white font-semibold text-lg lg:text-xl">
              {theme.brandName || 'AI Assistant'}
            </span>
          </div>

          {/* Navigation Items - Center */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-4 py-2 lg:px-6 lg:py-3 rounded-xl transition-all duration-300 relative ${
                    isActive 
                      ? `bg-gradient-to-r ${theme.primaryGradient} text-white shadow-lg` 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                  <span className="ml-2 lg:ml-3 font-medium">
                    {item.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* <button className="flex items-center p-2 lg:p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
              <Settings className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="hidden lg:block ml-2 font-medium">Settings</span>
            </button> */}
            
            <button className="flex items-center p-2 lg:p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
              <User className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="hidden lg:block ml-2 font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;