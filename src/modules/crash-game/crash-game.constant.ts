export const CCrash_Config = {
  minBetAmount: 0.1, // Min bet amount (in coins)
  maxBetAmount: 100, // Max bet amount (in coins)
  maxProfit: 500, // Max profit on crash, forces auto cashout
  houseEdge: 0.05, // House edge percentage
};

export enum ECrashGameEvents {
  auth = "auth",
  getHistory = "previous-crashgame-history",
  autoCrashBet = "auto-crashgame-bet",
  cancelAutoBet = "cancel-auto-bet",
  joinGame = "join-crash-game",
  betCashout = "bet-cashout",
  disconnect = "disconnect",
}

export const CGAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

export const CBET_STATES = {
  Playing: 1,
  CashedOut: 2,
};

export const CTime = {
  tick_rate: 100,
  start_wait_time: 4000,
  restart_wait_time: 9000,
};
