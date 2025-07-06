
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Clock, HelpCircle, Home } from 'lucide-react';
import { ChatState } from '@/types/chat';

interface NavigationBarProps {
  currentView: ChatState;
  onNavigate: (view: ChatState) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'welcome' as ChatState, icon: Home, label: 'Home' },
    { id: 'history' as ChatState, icon: MessageCircle, label: 'Chats' },
    { id: 'faq' as ChatState, icon: HelpCircle, label: 'FAQ' },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md border-t border-white/10 p-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 min-w-[80px] ${
                isActive 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-green-200 hover:text-white hover:bg-white/10'
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
