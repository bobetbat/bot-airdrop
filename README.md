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

### Generate private keys
Uses seed from `.env.seed` to generate and save `NUMBER_OF_KEYS` amount of private keys to `.env.keys` file
```
yarn generate:keys
// or
npm run generate:keys
```

### Distribute native token to addresses
- requires native token on first address
- `CHAIN_ID` can be specified, default `324` (check supported chains in `config.ts`)
- `NUMBER_OF_KEYS` can be specified, default `1`
- in case of broken cycle `CONTINUE_FROM` can be specified in `.env` file to continue from required index

Sends native token from first address to rest accounts.
```
yarn send:native
// or
npm run send:native
```

### Send token through number addresses
- requires desired token on first address
- requires native token on all addresses in list
- `CHAIN_ID` can be specified, default `324` (check supported chains in `config.ts`)
- `NUMBER_OF_KEYS` can be specified, default `1`
- `TOKEN_NAME` can be specified, default `USDT` (check supported tokens in `config.ts`)
- in case of broken cycle `CONTINUE_FROM` can be specified in `.env` file to continue from required index

Sends token from first address to next forming a loop
```
yarn send:loop
// or
npm run send:loop
```

### Send all tokens through number addresses
- requires all tokens configured on selected chain to exist on first address
- requires native token on all addresses in list
- `CHAIN_ID` can be specified, default `324` (check supported chains in `config.ts`)
- `NUMBER_OF_KEYS` can be specified, default `1`

Calls `send:loop` for all configured tokens
```
yarn send:multiloop
// or
npm run send:multiloop
```
