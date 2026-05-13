import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-safe text-center">
      <div className="font-code-snippet text-error mb-8 animate-pulse text-display-lg uppercase">
        Error_404: Node_Not_Found
      </div>
      <p className="font-body-lg text-on-surface-variant max-w-xl mb-12 uppercase">
        The requested pathway has been deprecated or does not exist within the current system architecture.
      </p>
      <Link 
        to="/" 
        className="px-8 py-4 border border-primary text-primary font-code-snippet hover:bg-primary hover:text-background transition-all uppercase"
      >
        Re-Route_To_Home.exe
      </Link>
    </div>
  );
};

export default NotFound;
