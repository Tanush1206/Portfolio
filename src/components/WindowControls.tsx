import React from 'react';

interface WindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  title?: string;
}

const WindowControls: React.FC<WindowControlsProps> = ({ onClose, onMinimize, onMaximize, title }) => {
  return (
    <div className="bg-black px-4 py-2 flex items-center justify-between border-b border-white/5 select-none w-full min-h-[38px]">
      {/* Left: macOS Dots */}
      <div className="flex gap-2 flex-shrink-0">
        <button 
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 transition-all flex-shrink-0"
          aria-label="Close"
        />
        <button 
          onClick={onMinimize}
          className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-110 transition-all flex-shrink-0"
          aria-label="Minimize"
        />
        <button 
          onClick={onMaximize}
          className="w-3 h-3 rounded-full bg-[#28C840] hover:brightness-110 transition-all flex-shrink-0"
          aria-label="Maximize"
        />
      </div>

      {/* Center: Title */}
      {title && (
        <div className="flex-1 text-center truncate px-4">
          <span className="text-[10px] font-code-snippet opacity-40 text-white uppercase tracking-widest">
            {title}
          </span>
        </div>
      )}

      {/* Right: Spacer for balance (matches dots width) */}
      <div className="w-12 flex-shrink-0 hidden md:block" />
    </div>
  );
};

export default WindowControls;
