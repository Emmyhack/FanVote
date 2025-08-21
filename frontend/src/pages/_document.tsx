import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="description" content="VoteStream - Secure, transparent blockchain voting for entertainment shows." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
