import { Wallet, ethers } from 'ethers';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as config from '../config';
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";

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

export async function transferToken(chainId: number, tokenName: string) {
  try {
    console.log('rpc:', config.rpc[chainId]);
    // ethers.js initialization
    const provider = new ethers.providers.JsonRpcProvider(config.rpc[chainId]);
    // Collect private keys
    const wallets: Wallet[] = [];
    for (let i = 0; keysConfig[`PRIVATE_KEY_${i}`] !== undefined; i++) {
      const privateKey = keysConfig[`PRIVATE_KEY_${i}`];
      wallets.push(new ethers.Wallet(privateKey, provider));
    }

    // Fetch current gas price
    const gasPrice = await provider.getGasPrice();
    console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

    // Create a new contract instance
    const token = config.TOKENS[chainId][tokenName]
    const contract = new ethers.Contract(token.address, ERC20.abi, provider);
    const contractWithSigner = contract.connect(wallets[0]);

    // Estimate gas once for the first transaction
    const gasEstimate = await contractWithSigner.estimateGas.transfer(wallets[1].address, ethers.utils.parseUnits(token.amountToSend, token.decimals));
    const gasLimit = gasEstimate.mul(102).div(100); // Increase by 2%


    for (let i = 0; i < NUMBER_OF_KEYS; i++) {
      if (i < CONTINUE_FROM) {
        console.error(`skipped PRIVATE_KEY_${i}`);
        continue
      }
      const wallet = wallets[i];
      const nextWallet = wallets[(i + 1) % NUMBER_OF_KEYS];
      try {
        console.log(`------------------------------------------------------------`);
        console.log(i);
        console.log(`Sending ${token.amountToSend} ${tokenName}`);
        console.log(`From: ${wallet.address}`);
        console.log(`To: ${nextWallet.address}`);

        const contractWithSigner = contract.connect(wallet);
        const tx = await contractWithSigner.transfer(nextWallet.address, ethers.utils.parseUnits(token.amountToSend, token.decimals), { gasLimit, gasPrice });

        console.log(`Transaction hash: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block number: ${receipt.blockNumber}`);
      } catch (error) {
        throw Error(`Index:${i} failed to send ${tokenName} from address ${wallet.address}: ${error}`)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const chainId = process.env.CHAIN_ID && process.env.CHAIN_ID !== '' ? Number(process.env.CHAIN_ID) : 324
const tokenName = 'USDT'
transferToken(chainId, tokenName).catch(error => {
  console.error('Error in transferToken function:', error);
});
