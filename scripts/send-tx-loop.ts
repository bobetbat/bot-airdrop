import { Wallet, ethers } from 'ethers';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import usdtAbi from '../abis/usdt.json'
// Load the main .env file
dotenv.config();

// Load the .env.keys file
const envKeysFilePath = path.join(__dirname, '..', '.env.keys');
if (!fs.existsSync(envKeysFilePath)) {
  throw new Error('.env.keys file not found');
}

const envKeysContent = fs.readFileSync(envKeysFilePath, 'utf8');
const keysConfig = dotenv.parse(envKeysContent);

// USDT Contract address on the Ethereum mainnet
const USDT_ADDRESS = '0x7169d38820dfd117c3fa1f22a697dba58d90ba06';
const AMOUNT_OF_USDT = process.env.AMOUNT_OF_USDT || '0';

// ethers.js initialization
const sepoliaAlchemyKey = 'https://eth-sepolia.g.alchemy.com/v2/' + (process.env.ALCHEMY_API_KEY || '');
const provider = new ethers.providers.JsonRpcProvider(sepoliaAlchemyKey);

// Collect private keys
const wallets: Wallet[] = [];
for (let i = 0; keysConfig[`PRIVATE_KEY_${i}`] !== undefined; i++) {
  const privateKey = keysConfig[`PRIVATE_KEY_${i}`];
  wallets.push(new ethers.Wallet(privateKey, provider));
}

// Create a new contract instance
const usdtContract = new ethers.Contract(USDT_ADDRESS, usdtAbi, provider);

async function transferUsdt() {
  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    const nextWallet = wallets[(i + 1) % wallets.length];

    try {
      console.log(`Sending USDT from address ${wallet.address} to address ${nextWallet.address}`);

      const contractWithSigner = usdtContract.connect(wallet);
      const tx = await contractWithSigner.transfer(nextWallet.address, ethers.utils.parseUnits(AMOUNT_OF_USDT, 6));

      console.log(`Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block number: ${receipt.blockNumber}`);
    } catch (error) {
      console.error(`Failed to send USDT from address ${wallet.address}:`, error);
      break; // Stop the loop if an error occurs
    }
  }
}

transferUsdt().catch(error => {
  console.error('Error in transferUsdt function:', error);
});
