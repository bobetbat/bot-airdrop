// Import the necessary libraries
import { EvmWalletProvider } from '@tatumio/evm-wallet-provider';
import { TatumSDK, Network, Ethereum } from '@tatumio/tatum';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

async function generateKeys() {
	// Define the path to the .env.seed file in the root directory
	const envSeedFilePath = path.join(__dirname, '..', '.env.seed');

	// Load the mnemonic from the .env.seed file
	if (!fs.existsSync(envSeedFilePath)) {
		throw new Error('.env.seed file not found');
	}

	dotenv.config({ path: envSeedFilePath });
	const mnemonic = process.env.MNEMONIC;

	if (!mnemonic) {
		throw new Error('MNEMONIC not found in .env.seed file');
	}

	// Initialize the Tatum SDK
	const tatumSdk = await TatumSDK.init<Ethereum>({
		network: Network.ETHEREUM,
		configureWalletProviders: [
			EvmWalletProvider,
		]
	});

	// Generate private keys from mnemonic
	const keys: string[] = [];
	for (let i = 0; i < 100; i++) {  // Generate 10 private keys
		const privateKey = await tatumSdk.walletProvider.use(EvmWalletProvider)
			.generatePrivateKeyFromMnemonic(mnemonic, i);
		keys.push(`PRIVATE_KEY_${i}=${privateKey}`);
	}

	// Define the path to the .env.keys file in the root directory
	const envKeysFilePath = path.join(__dirname, '..', '.env.keys');

	// Write the private keys to the .env.keys file
	fs.writeFileSync(envKeysFilePath, keys.join('\n'), 'utf8');

	console.log('Private keys saved to .env.keys');

	// Destroy the Tatum SDK instance
	await tatumSdk.destroy();
}

// Call the generateKeys function
generateKeys().catch(error => {
	console.error('Error generating private keys:', error);
});
