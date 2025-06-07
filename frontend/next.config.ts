import type { NextConfig } from "next";
import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID || "",
});

export default withCivicAuth(nextConfig)

