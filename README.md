# bot-airdrop

### Install dependencies
```
yarn
// or
npm i
```

### Generate seed phrase
Seed phrase will be saved to `.env.seed` file
```
yarn generate:mnemonic
// or
npm run generate:mnemonic
```

### Generate 100 private keys
Uses seed from `.env.seed` to generate and save 100 private keys to `.env.keys` file
```
yarn generate:keys
// or
npm run generate:keys
```

### Distribute native token to addresses
- requires native token on first address from `.env.keys`

Sends native token from first address(`.env.keys`) to rest accounts (number can be specified as `NUMBER_OF_KEYS` in `.env`).
```
yarn send:native
// or
npm run send:native
```

### Send USDT through number addresses
- requires USDT token on first address from `.env.keys`

number can be specified as `NUMBER_OF_KEYS` in `.env`
```
yarn send:loop
// or
npm run send:loop
```
