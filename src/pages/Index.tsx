
import ChatInterface from '@/components/chat/ChatInterface';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  return (
    <ThemeProvider>
      {/* Full black background */}
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        {/* Professional widget-style chatbot container with proper height */}
        <div className="w-full max-w-sm h-[650px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-600/5 via-transparent to-transparent"></div>
          
          {/* Main Chat Interface */}
          <ChatInterface />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
