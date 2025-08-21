import React from 'react';
import { useCivicAuthContext } from '@civic/auth/react';

interface Props {
  children: React.ReactNode;
  compact?: boolean;
}

const CivicAuthGate: React.FC<Props> = ({ children, compact = false }) => {
  const { authStatus, isLoading, signIn } = useCivicAuthContext();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-xl">Checking sign-in...</div>
      </div>
    );
  }

  if (authStatus !== 'authenticated') {
    return (
      <div className={compact ? '' : 'text-center py-8'}>
        {!compact && (
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"></div>
        )}
        <p className="text-gray-400 mb-4">Sign in to continue</p>
        <button onClick={() => void signIn()} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold border border-slate-700">
          Sign in with Civic
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default CivicAuthGate;