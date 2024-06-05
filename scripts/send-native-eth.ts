import { Wallet, ethers } from 'ethers';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as config from '../config';

// Load the main .env file
dotenv.config();

// Load the .env.keys file
const envKeysFilePath = path.join(__dirname, '..', '.env.keys');
if (!fs.existsSync(envKeysFilePath)) {
  throw new Error('.env.keys file not found');
}

const envKeysContent = fs.readFileSync(envKeysFilePath, 'utf8');
const keysConfig = dotenv.parse(envKeysContent);
const NUMBER_OF_KEYS = Number(process.env.NUMBER_OF_KEYS || 1);

async function distributeEth(chainId: number) {
  // ethers.js initialization
  const provider = new ethers.providers.JsonRpcProvider(config.rpc[chainId]);
  console.log('rpc:', config.rpc[chainId]);
  console.log(`Number of accounts: ${NUMBER_OF_KEYS}`);

  // Collect private keys
  const wallets: Wallet[] = [];
  for (let i = 0; keysConfig[`PRIVATE_KEY_${i}`] !== undefined; i++) {
    const privateKey = keysConfig[`PRIVATE_KEY_${i}`];
    wallets.push(new ethers.Wallet(privateKey, provider));
  }

  if (wallets.length < NUMBER_OF_KEYS) {
    throw new Error(`At least ${NUMBER_OF_KEYS} wallets (1 sender and rest receivers) are required.`);
  }

  const senderWallet = wallets[0]; // The first wallet will send ETH
  const receiverWallets = wallets.slice(1, NUMBER_OF_KEYS); // The next NUMBER_OF_KEYS wallets will receive ETH
  const amountEth = '0.0001'; // ETH amount to send
  const amountToSend = ethers.utils.parseEther(amountEth);

  // Fetch current gas price
  const gasPrice = await provider.getGasPrice();
  console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

  // Estimate gas once for the first transaction
  const gasEstimate = await provider.estimateGas({
    to: receiverWallets[0].address,
    value: amountToSend,
  });
  const gasLimit = gasEstimate.mul(105).div(100); // Increase by 5%

  for (const wallet of receiverWallets) {
    try {
      console.log(`------------------------------------------------------------`);
      console.log(`Sending ${amountEth} ETH`);
      console.log(`From: ${senderWallet.address}`);
      console.log(`To: ${wallet.address}`);

      const tx = await senderWallet.sendTransaction({
        to: wallet.address,
        value: amountToSend,
        gasLimit,
        gasPrice,
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

distributeEth(324).catch(error => {
  console.error('Error in distributeEth function:', error);
});
