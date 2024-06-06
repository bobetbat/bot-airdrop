import * as dotenv from 'dotenv';

dotenv.config();

export const USDT_ADDRESS: Record<number, string> = {
  //sepolia
  11155111: '0x7169d38820dfd117c3fa1f22a697dba58d90ba06',
  //linea
  59144: '0xa219439258ca9da29e9cc4ce5596924745e12b93',
  //zksync era
  324: "0x493257fd37edb34451f62edf8d2a0c418852ba4c"
}

export const USDC_ADDRESS: Record<number, string> = {
  //zksync era
  324: "0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4"
}


export const rpc: Record<number, string> = {
  //sepolia
  11155111: 'https://eth-sepolia.g.alchemy.com/v2/' + (process.env.ALCHEMY_API_KEY || ''),
  //linea
  59144: 'https://linea.blockpi.network/v1/rpc/public',
  324: "https://1rpc.io/zksync2-era"
}
