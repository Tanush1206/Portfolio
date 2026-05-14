import React from 'react';

interface WindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  title?: string;
}

const WindowControls: React.FC<WindowControlsProps> = ({ onClose, onMinimize, onMaximize, title }) => {
  return (
    <div className="bg-surface-container-low px-4 py-2 flex items-center border-b border-white/10 select-none">
      <div className="flex gap-1.5">
        <button 
          onClick={onClose}
          className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:brightness-125 transition-all shadow-[0_0_5px_rgba(255,95,86,0.3)]"
          title="Close"
        />
        <button 
          onClick={onMinimize}
          className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] hover:brightness-125 transition-all shadow-[0_0_5px_rgba(255,189,46,0.3)]"
          title="Minimize"
        />
        <button 
          onClick={onMaximize}
          className="w-2.5 h-2.5 rounded-full bg-[#27c93f] hover:brightness-125 transition-all shadow-[0_0_5px_rgba(39,201,63,0.3)]"
          title="Maximize"
        />
      </div>
      {title && (
        <div className="mx-auto text-[10px] font-code-snippet opacity-40 uppercase tracking-widest pl-2 truncate max-w-[150px] md:max-w-none">
          {title}
        </div>
      )}
    </div>
  );
};

export default WindowControls;
