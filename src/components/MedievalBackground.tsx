import React from 'react';

export const MedievalBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none medieval-background">
      {/* Only show on larger screens */}
      <div className="hidden min-[70em]:block absolute inset-0">
        
        {/* Base Sky Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              var(--znr-secondary) 0%, 
              var(--znr-tertiary) 40%, 
              var(--znr-elevated) 100%)`
          }}
        />
        
        {/* Distant Mountains */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, var(--znr-secondary) 60%, var(--znr-tertiary) 100%)`,
            clipPath: 'polygon(0% 70%, 15% 65%, 25% 68%, 40% 60%, 55% 65%, 70% 58%, 85% 62%, 100% 55%, 100% 100%, 0% 100%)'
          }}
        />

        {/* Rolling Hills - Layer 3 (Furthest) */}
        <div 
          className="absolute inset-0 opacity-30 hills-layer"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, var(--znr-tertiary) 40%, var(--znr-secondary) 100%)`,
            clipPath: 'polygon(0% 75%, 12% 72%, 28% 78%, 45% 70%, 62% 76%, 78% 68%, 95% 74%, 100% 72%, 100% 100%, 0% 100%)',
            animationDelay: '0s'
          }}
        />

        {/* Rolling Hills - Layer 2 (Middle) */}
        <div 
          className="absolute inset-0 opacity-40 hills-layer"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, var(--znr-secondary) 30%, var(--znr-primary) 100%)`,
            clipPath: 'polygon(0% 82%, 18% 78%, 35% 85%, 52% 80%, 68% 88%, 82% 82%, 100% 86%, 100% 100%, 0% 100%)',
            animationDelay: '5s',
            animationDirection: 'reverse'
          }}
        />

        {/* Rolling Hills - Layer 1 (Closest) */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, var(--znr-elevated) 20%, var(--znr-secondary) 100%)`,
            clipPath: 'polygon(0% 90%, 20% 87%, 38% 92%, 55% 88%, 72% 94%, 88% 90%, 100% 93%, 100% 100%, 0% 100%)'
          }}
        />

        {/* Mystical Mist Layers */}
        <div className="absolute inset-0 medieval-mist opacity-20">
          <div 
            className="absolute top-1/3 left-0 w-full h-32 mystical-glow"
            style={{
              background: `radial-gradient(ellipse at center, var(--znr-border-accent) 0%, transparent 70%)`
            }}
          />
          <div 
            className="absolute top-2/3 right-0 w-2/3 h-24 mystical-glow"
            style={{
              background: `radial-gradient(ellipse at center, var(--znr-border-accent) 0%, transparent 70%)`,
              animationDelay: '3s'
            }}
          />
        </div>

        {/* Scattered Trees */}
        <div className="absolute top-[68%] left-[10%] opacity-15">
          <div className="w-1 h-8 opacity-40" style={{ backgroundColor: 'var(--znr-text-muted)' }} />
          <div 
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full opacity-30" 
            style={{ backgroundColor: 'var(--znr-text-muted)' }} 
          />
        </div>

        <div className="absolute top-[72%] right-[35%] opacity-12">
          <div className="w-1 h-6 opacity-40" style={{ backgroundColor: 'var(--znr-text-muted)' }} />
          <div 
            className="absolute -top-1 -left-1 w-3 h-3 rounded-full opacity-30" 
            style={{ backgroundColor: 'var(--znr-text-muted)' }} 
          />
        </div>

        <div className="absolute top-[65%] left-[60%] opacity-18">
          <div className="w-1 h-10 opacity-40" style={{ backgroundColor: 'var(--znr-text-muted)' }} />
          <div 
            className="absolute -top-3 -left-2 w-6 h-6 rounded-full opacity-30" 
            style={{ backgroundColor: 'var(--znr-text-muted)' }} 
          />
        </div>

        {/* Floating Particles/Dust */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-10 medieval-float mystical-glow"
              style={{ 
                backgroundColor: 'var(--znr-text-muted)',
                left: `${Math.random() * 100}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Subtle Sky Gradient */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(to bottom, 
              var(--znr-accent) 0%, 
              transparent 30%, 
              transparent 70%, 
              var(--znr-secondary) 100%)`
          }}
        />

      </div>
    </div>
  );
};