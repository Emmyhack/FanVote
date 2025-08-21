import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../../components/Shared/Layout";
import { WalletContextProvider } from "../contexts/WalletContextProvider";
import { CivicAuthProvider } from "@civic/auth/react";

export default function App({ Component, pageProps }: AppProps) {
  const civicClientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;
  const AppTree = (
    <WalletContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletContextProvider>
  );

  return civicClientId ? (
    <CivicAuthProvider clientId={civicClientId}>
      {AppTree}
    </CivicAuthProvider>
  ) : AppTree;
}
