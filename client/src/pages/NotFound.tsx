import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.js';
import { Film, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="py-24 text-center space-y-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center mx-auto">
        <Film className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-200">Scene Missing</h2>
      <p className="text-xs text-slate-400">
        The page you are looking for has been cut from the final edit. Return to our home theatre.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
