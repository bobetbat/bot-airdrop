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
const CONTINUE_FROM = Number(process.env.CONTINUE_FROM || 0);

async function distributeEth(chainId: number) {
  // ethers.js initialization
  const provider = new ethers.providers.JsonRpcProvider(config.rpc[chainId]);
  console.log('rpc:', config.rpc[chainId]);
  console.log(`Number of accounts: ${NUMBER_OF_KEYS}`);

  if (NUMBER_OF_KEYS < 1) {
    throw new Error(`At least 1 wallet is required.`);
  }

  const amountEth = '0.0001'; // ETH amount to send
  const amountToSend = ethers.utils.parseEther(amountEth);

  // Fetch current gas price
  const gasPrice = await provider.getGasPrice();
  console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

  // Initialize sender wallet
  const senderWallet = new ethers.Wallet(keysConfig['PRIVATE_KEY_0'], provider);
  // console.log(`Sender wallet address: ${senderWallet.address}`);

  for (let i = 1; i < NUMBER_OF_KEYS; i++) {
    const privateKey = keysConfig[`PRIVATE_KEY_${i}`];
    if (!privateKey) {
      console.error(`No private key found for PRIVATE_KEY_${i}`);
      continue;
    }
    if (i < CONTINUE_FROM) {
      console.error(`skipped PRIVATE_KEY_${i}`);
      continue;
    }

    const receiverWallet = new ethers.Wallet(privateKey, provider);

    try {
      console.log(`------------------------------------------------------------`);
      console.log(i);
      console.log(`Sending ${amountEth} ETH`);
      console.log(`From: ${senderWallet.address}`);
      console.log(`To: ${receiverWallet.address}`);
      // TODO: solve zksync network requires senderWallet.estimateGas rest networks provider.estimateGas
      const gasEstimate = await (chainId === 324 ? senderWallet : provider).estimateGas({
        to: receiverWallet.address,
        value: amountToSend,
      });

      const gasLimit = gasEstimate.mul(103).div(100); // Increase by 5%

      const tx = await senderWallet.sendTransaction({
        to: receiverWallet.address,
        value: amountToSend,
        gasLimit,
        gasPrice,
      });

      console.log(`Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block number: ${receipt.blockNumber}`);
    } catch (error) {
      console.error(`Failed to send ETH to address ${receiverWallet.address}:`, error);
      break; // Stop the loop if an error occurs
    }
  }
}

const chainId = process.env.CHAIN_ID && process.env.CHAIN_ID !== '' ? Number(process.env.CHAIN_ID) : 324
distributeEth(chainId).catch(error => {
  console.error('Error in distributeEth function:', error);
});
