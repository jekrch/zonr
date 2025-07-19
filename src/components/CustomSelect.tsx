import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  component: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  trigger: React.ReactNode;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  onValueChange,
  options,
  trigger,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 p-1 bg-znr-tertiary border border-znr-border rounded-xl hover:bg-znr-hover flex items-center justify-center focus:outline-none focus:border-znr-accent"
      >
        {trigger}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-znr-secondary border border-znr-border rounded-xl shadow-xl z-[100] min-w-[180px] overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-znr-hover focus:bg-znr-hover focus:outline-none flex items-center gap-2 text-znr-text"
            >
              {option.component}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};