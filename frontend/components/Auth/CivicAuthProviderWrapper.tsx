import React from 'react';
import { CivicAuthProvider } from '@civic/auth/react';

interface Props {
  children: React.ReactNode;
  clientId?: string;
}

const CivicAuthProviderWrapper: React.FC<Props> = ({ children, clientId }) => {
  if (clientId) {
    return (
      <CivicAuthProvider clientId={clientId}>
        {children}
      </CivicAuthProvider>
    );
  }

  return <>{children}</>;
};

export default CivicAuthProviderWrapper;