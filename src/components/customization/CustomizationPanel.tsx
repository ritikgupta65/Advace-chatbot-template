import { useState } from 'react';
import { X, Download, Upload, RotateCcw, Palette, Image, MessageSquare, Plus, Check } from 'lucide-react';
import styled from 'styled-components';

const CustomScrollbar = styled.div`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

// Mock theme context for demonstration
const useTheme = () => {
  const [theme, setTheme] = useState({
    logoUrl: '',
    brandName: 'Your Brand',
    primaryGradient: 'from-emerald-600 to-lime-500',
    welcomeMessage: 'Hello! How can I help you today?',
    quickActions: ['Get Started', 'Contact Support', 'View Pricing']
  });

  const updateTheme = (updates) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme({
      logoUrl: '',
      brandName: 'Your Brand',
      primaryGradient: 'from-emerald-600 to-lime-500',
      welcomeMessage: 'Hello! How can I help you today?',
      quickActions: ['Get Started', 'Contact Support', 'View Pricing']
    });
  };

  const exportTheme = () => {
    return JSON.stringify(theme, null, 2);
  };

  const importTheme = (data) => {
    try {
      const parsedTheme = JSON.parse(data);
      setTheme(parsedTheme);
      return true;
    } catch {
      return false;
    }
  };

  return { theme, updateTheme, resetTheme, exportTheme, importTheme };
};

const CustomizationPanel = ({ onClose }) => {
  const { theme, updateTheme, resetTheme, exportTheme, importTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'branding' | 'colors' | 'messages'>('branding');
  const [isProcessing, setIsProcessing] = useState(false);

  const gradientOptions = [
    { name: 'Emerald to Lime', value: 'from-emerald-600 to-lime-500' },
    { name: 'Blue to Purple', value: 'from-blue-600 to-purple-500' },
    { name: 'Pink to Rose', value: 'from-pink-600 to-rose-500' },
    { name: 'Orange to Red', value: 'from-orange-600 to-red-500' },
    { name: 'Indigo to Blue', value: 'from-indigo-600 to-blue-500' },
    { name: 'Teal to Cyan', value: 'from-teal-600 to-cyan-500' },
    { name: 'Purple to Pink', value: 'from-purple-600 to-pink-500' },
    { name: 'Amber to Orange', value: 'from-amber-600 to-orange-500' },
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateTheme({ logoUrl: result });
        setIsProcessing(false);
      };
      reader.onerror = () => {
        alert('Error reading file');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportTheme = () => {
    try {
      const themeData = exportTheme();
      const blob = new Blob([themeData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${theme.brandName.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export theme');
    }
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const success = importTheme(result);
        if (success) {
          // Show success state briefly
          setIsProcessing(true);
          setTimeout(() => setIsProcessing(false), 1000);
        } else {
          alert('Invalid theme file format. Please check your file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const addQuickAction = () => {
    if (theme.quickActions.length < 8) {
      updateTheme({ quickActions: [...theme.quickActions, ''] });
    }
  };

  const removeQuickAction = (index: number) => {
    const newActions = theme.quickActions.filter((_, i) => i !== index);
    updateTheme({ quickActions: newActions });
  };

  const updateQuickAction = (index: number, value: string) => {
    const newActions = [...theme.quickActions];
    newActions[index] = value;
    updateTheme({ quickActions: newActions });
  };

  const tabs = [
    { id: 'branding', icon: Image, label: 'Branding' },
    { id: 'colors', icon: Palette, label: 'Colors' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.primaryGradient} animate-pulse`}></div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Customize Chatbot</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group"
            aria-label="Close customization panel"
          >
            <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Tabs - Horizontal on mobile, Vertical on desktop */}
          <div className="flex lg:flex-col border-b lg:border-b-0 lg:border-r border-white/10 bg-slate-800/30">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 p-3 lg:p-4 transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${theme.primaryGradient} text-white shadow-lg`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-medium text-sm lg:text-base hidden sm:block">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
              {activeTab === 'branding' && (
                <div className="space-y-6 sm:space-y-8 max-w-2xl">
                  {/* Logo Upload */}
                  <div className="space-y-4">
                    <label className="block text-white font-semibold text-base sm:text-lg">Brand Logo</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-4">
                        {theme.logoUrl ? (
                          <div className="relative group">
                            <img 
                              src={theme.logoUrl} 
                              alt="Brand Logo" 
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg" 
                            />
                            <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs">Change</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-white/30 flex items-center justify-center bg-white/5">
                            <Image className="w-6 h-6 sm:w-8 sm:h-8 text-white/50" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <label className="cursor-pointer bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl px-4 py-2.5 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-200 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            disabled={isProcessing}
                          />
                          <span className="text-white text-sm font-medium">
                            {isProcessing ? 'Uploading...' : theme.logoUrl ? 'Change Logo' : 'Upload Logo'}
                          </span>
                        </label>
                        
                        {theme.logoUrl && (
                          <button
                            onClick={() => updateTheme({ logoUrl: '' })}
                            className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-2.5 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all duration-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Upload PNG, JPG, or SVG. Max 5MB. Recommended: 64×64px or larger.
                    </p>
                  </div>

                  {/* Brand Name */}
                  <div className="space-y-4">
                    <label className="block text-white font-semibold text-base sm:text-lg">Brand Name</label>
                    <input
                      type="text"
                      value={theme.brandName}
                      onChange={(e) => updateTheme({ brandName: e.target.value })}
                      className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-200"
                      placeholder="Enter your brand name"
                      maxLength={50}
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>This appears in your chatbot header</span>
                      <span>{theme.brandName.length}/50</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-6 sm:space-y-8 max-w-4xl">
                  <div>
                    <label className="block text-white font-semibold text-base sm:text-lg mb-6">Primary Theme</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {gradientOptions.map((gradient) => (
                        <button
                          key={gradient.value}
                          onClick={() => updateTheme({ primaryGradient: gradient.value })}
                          className={`relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group hover:scale-105 ${
                            theme.primaryGradient === gradient.value
                              ? 'border-white shadow-lg shadow-white/20'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <div className={`w-full h-12 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r ${gradient.value} mb-3 shadow-lg`}></div>
                          <span className="text-white text-xs sm:text-sm font-medium block text-center">{gradient.name}</span>
                          {theme.primaryGradient === gradient.value && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-6 sm:space-y-8 max-w-2xl">
                  {/* Welcome Message */}
                  <div className="space-y-4">
                    <label className="block text-white font-semibold text-base sm:text-lg">Welcome Message</label>
                    <textarea
                      value={theme.welcomeMessage}
                      onChange={(e) => updateTheme({ welcomeMessage: e.target.value })}
                      className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-200 resize-none"
                      rows={4}
                      placeholder="Enter your welcome message"
                      maxLength={200}
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>First message users see when starting a conversation</span>
                      <span>{theme.welcomeMessage.length}/200</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-white font-semibold text-base sm:text-lg">Quick Actions</label>
                      <span className="text-sm text-gray-400">{theme.quickActions.length}/8</span>
                    </div>
                    
                    <div className="space-y-3">
                      {theme.quickActions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-3 group">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={action}
                              onChange={(e) => updateQuickAction(index, e.target.value)}
                              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-200"
                              placeholder={`Quick action ${index + 1}`}
                              maxLength={30}
                            />
                          </div>
                          <button
                            onClick={() => removeQuickAction(index)}
                            className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                            aria-label={`Remove quick action ${index + 1}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      {theme.quickActions.length < 8 && (
                        <button
                          onClick={addQuickAction}
                          className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="font-medium">Add Quick Action</span>
                        </button>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Quick actions appear as buttons below the welcome message
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-slate-800/30">
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex space-x-3">
                  <button
                    onClick={handleExportTheme}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  
                  <label className="cursor-pointer flex items-center space-x-2 px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportTheme}
                      className="hidden"
                    />
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={resetTheme}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-red-600/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-600/20 transition-all duration-200 text-sm font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  
                  <button
                    onClick={onClose}
                    className={`px-6 py-2.5 bg-gradient-to-r ${theme.primaryGradient} rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-sm`}
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomScrollbar />
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CustomizationPanel;