import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, PublicKey, Connection } from '@solana/web3.js';
import { GatewayProvider } from '@civic/solana-gateway-react';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
    children: React.ReactNode;
}

const DEFAULT_DEVNET_GATEKEEPER = 'tibePmPaoTgrs929rWPUrH4QyYqJE7xVJ9mfjTthM7g';

const GatewayWrapper: React.FC<{ children: React.ReactNode; network: WalletAdapterNetwork; endpoint: string }> = ({ children, network, endpoint }) => {
    // We must call useWallet inside the WalletProvider tree
    const wallet = useWallet();

    const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [endpoint]);

    const gatekeeperNetworkEnv: string | undefined = process.env.NEXT_PUBLIC_CIVIC_GATEKEEPER_NETWORK;
    const gatekeeperNetworkKey = useMemo(() => {
        const source = gatekeeperNetworkEnv && gatekeeperNetworkEnv.trim().length > 0
            ? gatekeeperNetworkEnv
            : DEFAULT_DEVNET_GATEKEEPER;
        try {
            return new PublicKey(source);
        } catch {
            return new PublicKey(DEFAULT_DEVNET_GATEKEEPER);
        }
    }, [gatekeeperNetworkEnv]);

    return (
        <GatewayProvider wallet={wallet} gatekeeperNetwork={gatekeeperNetworkKey} cluster={network} connection={connection}>
            {children}
        </GatewayProvider>
    );
};

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <GatewayWrapper network={network} endpoint={endpoint}>
                    <WalletModalProvider>
                        {children}
                    </WalletModalProvider>
                </GatewayWrapper>
            </WalletProvider>
        </ConnectionProvider>
    );
};