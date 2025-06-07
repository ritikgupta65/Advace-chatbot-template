
import { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-lime-900/10 via-transparent to-transparent"></div>
        
        {/* Main Chat Interface */}
        <ChatInterface />
      </div>
    </ThemeProvider>
  );
};

export default Index;
