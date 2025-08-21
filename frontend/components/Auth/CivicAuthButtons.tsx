import React from 'react';
// These types are inferred from Civic Auth React SDK; fall back to any if types are unavailable
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useCivicAuth } from '@civic/auth/react';

const CivicAuthButtons: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { signIn, signOut, user, isAuthenticated, isLoading } = useCivicAuth?.() || {};

  if (isLoading) {
    return (
      <button disabled className="bg-slate-700 text-white px-4 py-2 rounded-xl opacity-70">
        Loading...
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-300 text-sm hidden sm:inline">{user?.email || 'Signed in'}</span>
        <button onClick={() => signOut?.()} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-700">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn?.()} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-700">
      Sign in
    </button>
  );
};

export default CivicAuthButtons;