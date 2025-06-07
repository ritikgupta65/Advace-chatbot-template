
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Clock, Settings, User } from 'lucide-react';
import { ChatState } from '@/types/chat';

interface NavigationBarProps {
  currentView: ChatState;
  onNavigate: (view: ChatState) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentView, onNavigate }) => {
  const { theme } = useTheme();

  const navItems = [
    { id: 'welcome' as ChatState, icon: MessageCircle, label: 'Home' },
    { id: 'history' as ChatState, icon: Clock, label: 'History' },
    { id: 'faq' as ChatState, icon: Settings, label: 'FAQ' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md border-t border-white/20 p-4 md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-r ${theme.primaryGradient} text-white shadow-lg` 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;
