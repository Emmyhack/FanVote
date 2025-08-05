import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../../components/Shared/Layout";
import { WalletContextProvider } from "../contexts/WalletContextProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletContextProvider>
  );
}
