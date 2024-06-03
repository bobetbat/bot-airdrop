// Import the necessary libraries
import { EvmWalletProvider } from '@tatumio/evm-wallet-provider';
import { TatumSDK, Network, Ethereum } from '@tatumio/tatum';
import fs from 'fs';
import path from 'path';

async function generateMnemonic() {
    // Initialize the Tatum SDK
    const tatumSdk = await TatumSDK.init<Ethereum>({
        network: Network.ETHEREUM,
        configureWalletProviders: [
            EvmWalletProvider,
        ]
    });

    // Generate mnemonic using the EVM Wallet Provider submodule
    const mnemonic = tatumSdk.walletProvider.use(EvmWalletProvider).generateMnemonic();

    // Define the path to the .env.seed file in the root directory
    const envSeedFilePath = path.join(__dirname, '..', '.env.seed');

    // Check if the .env.seed file exists
    if (fs.existsSync(envSeedFilePath)) {
        // File exists, update the MNEMONIC value
        let fileContent = fs.readFileSync(envSeedFilePath, 'utf8');
        const mnemonicRegex = /^MNEMONIC=.*$/m;
        if (mnemonicRegex.test(fileContent)) {
            // Update existing MNEMONIC value
            fileContent = fileContent.replace(mnemonicRegex, `MNEMONIC=${mnemonic}`);
        } else {
            // Append MNEMONIC if it doesn't exist in the file
            fileContent += `\nMNEMONIC=${mnemonic}`;
        }
        fs.writeFileSync(envSeedFilePath, fileContent, 'utf8');
    } else {
        // File does not exist, create it and write MNEMONIC value
        fs.writeFileSync(envSeedFilePath, `MNEMONIC=${mnemonic}`, 'utf8');
    }

    console.log('Mnemonic saved to .env.seed');

    // Destroy the Tatum SDK instance
    await tatumSdk.destroy();
}

// Call the generateMnemonic function
generateMnemonic().catch(error => {
    console.error('Error generating mnemonic:', error);
});
