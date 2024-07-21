import * as dotenv from 'dotenv';

dotenv.config();

export interface IToken {
  decimals: number;
  address: string;
  amountToSend: string;
}

export const TOKENS: Record<number, Record<string, IToken>> = {
  11155111: {
    USDT: {
      address: "0x7169d38820dfd117c3fa1f22a697dba58d90ba06",
      decimals: 6,
      amountToSend: '1',
    }
  },
  //zksync era
  324: {
    USDC: {
      address: "0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4",
      decimals: 6,
      amountToSend: '1'
    },
    USDT: {
      address: "0x493257fd37edb34451f62edf8d2a0c418852ba4c",
      decimals: 6,
      amountToSend: '1',
    }
  },
  //linea
  59144: {
    USDT: {
      address: "0xa219439258ca9da29e9cc4ce5596924745e12b93",
      decimals: 6,
      amountToSend: '1',
    }
  }
}

export const rpc: Record<number, string> = {
  //sepolia
  11155111: 'https://eth-sepolia.g.alchemy.com/v2/' + (process.env.ALCHEMY_API_KEY || ''),
  //linea
  59144: 'https://linea.blockpi.network/v1/rpc/public',
  //zksync era
  324: "https://1rpc.io/zksync2-era"
}
