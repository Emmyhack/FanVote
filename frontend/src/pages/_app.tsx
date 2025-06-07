import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../../components/Shared/Layout";
import { SolanaProvider } from "../../components/counter/provider/SolanaProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SolanaProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SolanaProvider>
    </>
  );
}
