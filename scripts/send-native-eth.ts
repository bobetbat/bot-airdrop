import { Wallet, ethers } from 'ethers';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as config from '../config'
// Load the main .env file
dotenv.config();

// Load the .env.keys file
const envKeysFilePath = path.join(__dirname, '..', '.env.keys');
if (!fs.existsSync(envKeysFilePath)) {
  throw new Error('.env.keys file not found');
}

const envKeysContent = fs.readFileSync(envKeysFilePath, 'utf8');
const keysConfig = dotenv.parse(envKeysContent);


async function distributeEth(chainId: number) {
  // ethers.js initialization
  const provider = new ethers.providers.JsonRpcProvider(config.rpc[chainId]);
  console.log('rpc:', config.rpc[chainId])
  // Collect private keys
  const wallets: Wallet[] = [];
  for (let i = 0; keysConfig[`PRIVATE_KEY_${i}`] !== undefined; i++) {
    const privateKey = keysConfig[`PRIVATE_KEY_${i}`];
    wallets.push(new ethers.Wallet(privateKey, provider));
  }

  if (wallets.length < 100) {
    throw new Error('At least 100 wallets (1 sender and 99 receivers) are required.');
  }

  const senderWallet = wallets[0]; // The first wallet will send ETH
  const receiverWallets = wallets.slice(1, 100); // The next 100 wallets will receive ETH
  const amountToSend = ethers.utils.parseEther('0.0001'); // 1 ETH divided by 100 accounts

  for (const wallet of receiverWallets) {
    try {
      console.log(`Sending 0.01 ETH from address ${senderWallet.address} to address ${wallet.address}`);

      const tx = await senderWallet.sendTransaction({
        to: wallet.address,
        value: amountToSend,
      });

      console.log(`Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block number: ${receipt.blockNumber}`);
    } catch (error) {
      console.error(`Failed to send ETH to address ${wallet.address}:`, error);
      break; // Stop the loop if an error occurs
    }
  }
}

distributeEth(59144).catch(error => {
  console.error('Error in distributeEth function:', error);
});
