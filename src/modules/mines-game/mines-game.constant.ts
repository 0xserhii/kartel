export enum EXAMPLE_ENUM {
  EXAMPLE_FIRST = "EXAMPLE_FIRST",
  EXAMPLE_TWO = "EXAMPLE_TWO",
}

export const CMinesConfig = {
  minBetAmount: 0.1, // Min bet amount (in coins)
  maxBetAmount: 300, // Max bet amount (in coins)
  feePercentage: 0.05, // House fee percentage
  minBetMinesCount: 2, // Min bet mines count
  maxBetMinesCount: 24, // Max bet mines count
};

export enum EMinesGameEvents {
  auth = "auth",
  createMinesGame = "create-new-minesgame",
  minesRolling = "mines-rolling",
  minesCashout = "mines-cashout",
  notifyError = "notify-error",
  gameCreationError = "game-creation-error",
  updateWallet = "update-wallet",
  createdMinesGame = "created-mines-game",
  minesGameRolled = "mines-game-rolled",
  minesGameEnded = "mines-game-ended",
  disconnect = "disconnect",
}
