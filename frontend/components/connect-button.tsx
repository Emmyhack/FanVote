import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import React, { useEffect } from "react";

type Props = {};

const ConnectWallet = (props: Props) => {
  const { connected, publicKey } = useWallet();
  useEffect(() => {
    const handleWalletChange = async () => {
      // Update wallet address state
      const newAddress = connected && publicKey ? publicKey.toBase58() : null;
      try {
        console.log("Wallet address updated successfully");
      } catch (error) {
        console.error("Failed to update wallet address:", error);
      }
    };

    handleWalletChange();
  }, [connected, publicKey]);

  return (
    <div>
      <WalletMultiButton />
    </div>
  );
};

export default ConnectWallet;
