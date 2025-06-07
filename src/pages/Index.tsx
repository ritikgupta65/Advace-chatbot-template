
import { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import CustomizationPanel from '@/components/customization/CustomizationPanel';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Settings } from 'lucide-react';

const Index = () => {
  const [showCustomization, setShowCustomization] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-lime-900/10 via-transparent to-transparent"></div>
        
        {/* Customization Toggle */}
        <button
          onClick={() => setShowCustomization(!showCustomization)}
          className="fixed top-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Main Chat Interface */}
        <ChatInterface />

        {/* Customization Panel */}
        {showCustomization && (
          <CustomizationPanel onClose={() => setShowCustomization(false)} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
