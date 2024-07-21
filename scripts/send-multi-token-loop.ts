import * as dotenv from 'dotenv';
import * as config from '../config';
import { transferToken } from './send-token-loop';

// Load the main .env file
dotenv.config();

async function transferAllTokens(chainId: number) {
  const tokensOnChain = Object.keys(config.TOKENS[chainId])
  Promise.allSettled(tokensOnChain.map((tokenName) => transferToken(chainId, tokenName)))
}

const chainId = process.env.CHAIN_ID && process.env.CHAIN_ID !== '' ? Number(process.env.CHAIN_ID) : 324
transferAllTokens(chainId).catch(error => {
  console.error('Error in transferToken function:', error);
});
