import * as dotenv from 'dotenv';

dotenv.config();

export interface IToken {
  decimals: number;
  address: string;
  amountToSend: string;
}
const STABLE_COIN_AMOUNT = '1'
const ETH_TOKEN_AMOUNT = '0.0004' // about 3$

export const TOKENS: Record<number, Record<string, IToken>> = {
  11155111: {
    USDT: {
      address: "0x7169d38820dfd117c3fa1f22a697dba58d90ba06",
      decimals: 6,
      amountToSend: STABLE_COIN_AMOUNT,
    }
  },
  //zksync era
  324: {
    USDC: {
      address: "0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4",
      decimals: 6,
      amountToSend: STABLE_COIN_AMOUNT
    },
    USDT: {
      address: "0x493257fd37edb34451f62edf8d2a0c418852ba4c",
      decimals: 6,
      amountToSend: STABLE_COIN_AMOUNT,
    }
  },
  //linea
  59144: {
    WETH: {
      address: "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
      decimals: 18,
      amountToSend: ETH_TOKEN_AMOUNT,
    },
    wstETH: {
      address: "0xb5bedd42000b71fdde22d3ee8a79bd49a568fc8f",
      decimals: 18,
      amountToSend: ETH_TOKEN_AMOUNT,
    },
    wrsETH: {
      address: "0xd2671165570f41bbb3b0097893300b6eb6101e6c",
      decimals: 18,
      amountToSend: ETH_TOKEN_AMOUNT,
    },
    ezETH: {
      address: "0x2416092f143378750bb29b79ed961ab195cceea5",
      decimals: 18,
      amountToSend: ETH_TOKEN_AMOUNT,
    },
    uniETH: {
      address: "0x15eefe5b297136b8712291b632404b66a8ef4d25",
      decimals: 18,
      amountToSend: ETH_TOKEN_AMOUNT,
    },
    axlUSDC: {
      address: "0xeb466342c4d449bc9f53a865d5cb90586f405215",
      decimals: 6,
      amountToSend: STABLE_COIN_AMOUNT,
    },
    ceBUSD: {
      address: "0x7d43aabc515c356145049227cee54b608342c0ad",
      decimals: 18,
      amountToSend: STABLE_COIN_AMOUNT,
    },
    DAI: {
      address: "0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5",
      decimals: 18,
      amountToSend: STABLE_COIN_AMOUNT,
    },
    USDC: {
      address: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
      decimals: 6,
      amountToSend: STABLE_COIN_AMOUNT,
    },
    USDT: {
      address: "0xa219439258ca9da29e9cc4ce5596924745e12b93",
      decimals: 6,
      amountToSend: STABLE_COIN_AMOUNT,
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
