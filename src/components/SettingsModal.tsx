// components/SettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { Settings, X, Palette, Info, Github, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'settings'>('about');
  const [currentTheme, setCurrentTheme] = useState('default');

  const themes = [
    { id: 'default', name: 'Classic', class: 'theme-default', preview: '#a67c52' },
    { id: 'forest', name: 'Forest', class: 'theme-forest', preview: '#059669' },
    { id: 'royal', name: 'Royal', class: 'theme-royal', preview: '#7c3aed' },
    { id: 'sunset', name: 'Sunset', class: 'theme-sunset', preview: '#ea580c' }
  ];

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('znr-theme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    // Remove all theme attributes first
    document.documentElement.removeAttribute('data-theme');
    
    // Apply new theme if not default
    if (themeId !== 'default') {
      document.documentElement.setAttribute('data-theme', themeId);
    }
    
    // Save to localStorage
    localStorage.setItem('znr-theme', themeId);
    
    // Force a repaint to ensure CSS changes are applied
    document.documentElement.style.display = 'none';
    document.documentElement.offsetHeight; // Trigger reflow
    document.documentElement.style.display = '';
  };

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-znr-secondary border border-znr-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-znr-border ">
          <div className="mx-auto">
            <h2 className="text-lg font-semibold text-znr-text ml-8">zonr</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-znr-tertiary rounded-lg flex items-center justify-center text-znr-text-muted hover:text-znr-text hover:bg-znr-elevated transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-znr-border">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'about'
                ? 'text-znr-text bg-znr-tertiary'
                : 'text-znr-text-muted hover:text-znr-accent hover:bg-znr-tertiary/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Info size={14} />
              About
            </div>
            {activeTab === 'about' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-znr-accent" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'settings'
                ? 'text-znr-text bg-znr-tertiary'
                : 'text-znr-text-muted hover:text-znr-accent hover:bg-znr-tertiary/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings size={14} />
              Settings
            </div>
            {activeTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-znr-accent" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)] znr-scroll-enhanced">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* App Info */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-znr-accent-alt to-znr-accent rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🏰</span>
                </div>
                {/* <h3 className="text-xl font-semibold text-znr-text mb-2">zonr</h3> */}
                <p className="text-sm text-znr-text-muted leading-relaxed">
                  A simple score tracking app for the board game Carcassonne. 
                  Track multiple players, edit scores, and enjoy!
                </p>
              </div>

            
              {/* Version & Credits */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-znr-text uppercase tracking-wide">About</h4>
                <div className="space-y-2 text-sm text-znr-text-muted">
                  <div className="flex justify-between items-center">
                    <span>Version</span>
                    <span className="text-znr-text">1.0.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Built with</span>
                    <span className="text-znr-text">React + TypeScript</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Created by</span>
                    <span className="text-znr-text">Jacob Krch</span>
                  </div>
                </div>
                <div className="text-xs text-znr-text-muted text-center pt-2">
                  © 2025 Jacob Krch. All rights reserved.
                </div>
              </div>

              {/* Links */}
              <div className="pt-4 border-t border-znr-border">
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open('https://github.com/jekrch/zonr', '_blank')}
                    className="flex-1 bg-znr-tertiary hover:bg-znr-elevated rounded-lg px-3 py-2 text-sm text-znr-text transition-colors flex items-center justify-center gap-2"
                  >
                    <Github size={14} />
                    View Source
                  </button>
                  <button 
                    onClick={() => window.open('https://jacobkrch.com', '_blank')}
                    className="flex-1 bg-znr-tertiary hover:bg-znr-elevated rounded-lg px-3 py-2 text-sm text-znr-text transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} />
                    jacobkrch.com
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-znr-text-dim" />
                  <h4 className="text-sm font-semibold text-znr-text uppercase tracking-wide">Theme</h4>
                </div>
                <div className="space-y-2">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => changeTheme(theme.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        currentTheme === theme.id 
                          ? 'bg-znr-elevated border border-znr-accent shadow-sm' 
                          : 'bg-znr-tertiary hover:bg-znr-elevated border border-transparent'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded-lg shadow-inner border border-white/20"
                        style={{ backgroundColor: theme.preview }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-znr-text">{theme.name}</div>
                        <div className="text-xs text-znr-text-muted">
                          {theme.id === 'default' && 'Clean and classic'}
                          {theme.id === 'forest' && 'Nature inspired'}
                          {theme.id === 'royal' && 'Rich and elegant'}
                          {theme.id === 'sunset' && 'Warm and vibrant'}
                        </div>
                      </div>
                      {currentTheme === theme.id && (
                        <div className="w-5 h-5 bg-znr-accent rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Settings */}

              {/* <div className="space-y-3">
                <h4 className="text-sm font-semibold text-znr-text uppercase tracking-wide">Game Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 bg-znr-tertiary rounded-xl">
                    <div>
                      <div className="text-sm font-medium text-znr-text">Animations</div>
                      <div className="text-xs text-znr-text-muted">Enable score animations</div>
                    </div>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="w-4 h-4 text-znr-accent bg-znr-elevated border-znr-border rounded focus:ring-znr-accent"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 bg-znr-tertiary rounded-xl">
                    <div>
                      <div className="text-sm font-medium text-znr-text">Sound Effects</div>
                      <div className="text-xs text-znr-text-muted">Play sounds on score changes</div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-znr-accent bg-znr-elevated border-znr-border rounded focus:ring-znr-accent"
                    />
                  </label>
                </div>
              </div> */}

              {/* Reset */}
              {/* <div className="pt-4 border-t border-znr-border">
                <button className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors">
                  Reset All Settings
                </button>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Updated Settings Button Component
export const SettingsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-[100]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 bg-znr-secondary border border-znr-border rounded-full flex items-center justify-center text-znr-text-dim hover:text-znr-text transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Settings size={18} />
        </button>
      </div>
      
      <SettingsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};