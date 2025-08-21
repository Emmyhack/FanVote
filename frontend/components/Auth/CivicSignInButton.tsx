import React from 'react';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';

interface CivicSignInButtonProps {
	size?: 'sm' | 'md' | 'lg';
	fullWidth?: boolean;
}

const CivicSignInButton: React.FC<CivicSignInButtonProps> = ({ size = 'md', fullWidth = false }) => {
	const { gatewayStatus, requestGatewayToken } = useGateway();

	const handleVerify = async () => {
		try {
			await requestGatewayToken?.();
		} catch (error) {
			console.error('Civic verification failed', error);
		}
	};

	const sizeClasses = size === 'lg'
		? 'px-6 py-3 text-base'
		: size === 'sm'
			? 'px-3 py-2 text-sm'
			: 'px-4 py-2 text-sm';

	const baseClasses = `bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 ${sizeClasses}`;

	if (gatewayStatus === GatewayStatus.ACTIVE) {
		return (
			<button disabled className={`${baseClasses} ${fullWidth ? 'w-full' : ''} opacity-80 cursor-default`}>
				Verified with Civic
			</button>
		);
	}

	const isProcessing = [
		GatewayStatus.CHECKING,
		GatewayStatus.COLLECTING_USER_INFORMATION,
		GatewayStatus.PROOF_OF_WALLET_OWNERSHIP,
		GatewayStatus.VALIDATING_USER_INFORMATION,
		GatewayStatus.USER_INFORMATION_VALIDATED,
		GatewayStatus.REFRESH_TOKEN_REQUIRED,
	].includes(gatewayStatus);

	if (isProcessing) {
		return (
			<button disabled className={`${baseClasses} ${fullWidth ? 'w-full' : ''}`}>
				Verifying...
			</button>
		);
	}

	return (
		<button onClick={handleVerify} className={`${baseClasses} ${fullWidth ? 'w-full' : ''}`}>
			Verify with Civic
		</button>
	);
};

export default CivicSignInButton;