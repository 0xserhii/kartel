export enum EXAMPLE_ENUM {
  EXAMPLE_FIRST = "EXAMPLE_FIRST",
  EXAMPLE_TWO = "EXAMPLE_TWO",
}

export const CCoinFlip_Config = {
  minBetAmount: 0.1, // Min bet amount (in coins)
  maxBetAmount: 100000, // Max bet amount (in coins)
  feePercentage: 0.05, // House fee percentage
  minBetCoinsCount: 1, // Min bet coins count
  maxBetCoinsCount: 10, // Max bet coins count
};

export enum ECoinflipGameEvents {
  auth = "auth",
  createCoinflipGame = "create-new-coinflipgame",
  newConflipGame = 'new-coinflip-game',
  coinflipGameRolling = 'conflip-game-rolling',
  coinflipRolled = 'conflip-game-rolled',
  autoCoinflipBet = "auto-coinflipgame-bet",
  cancelAutoBet = "cancel-auto-bet",
  notifyError = 'notify-error',
  gameCreationError = 'game-create-error',
  updateWallet = 'update-wallet',
  disconnect = "disconnect",
};