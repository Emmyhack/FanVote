import React from 'react';
import { useCivicAuthContext } from '@civic/auth/react';

const CivicAuthButtons: React.FC = () => {
  const { signIn, signOut, user, authStatus, isLoading } = useCivicAuthContext();
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  if (isLoading) {
    return (
      <button disabled className="bg-slate-700 text-white px-4 py-2 rounded-xl opacity-70">
        Loading...
      </button>
    );
  }

  if (authStatus === 'authenticated') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-300 text-sm hidden sm:inline">{user?.email || 'Signed in'}</span>
        <button onClick={() => void signOut()} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-700">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => void signIn()} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-700">
      Sign in
    </button>
  );
};

export default CivicAuthButtons;