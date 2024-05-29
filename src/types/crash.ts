import {
    FormattedGameHistoryType,
    PendingBetType,
    FormattedPlayerBetType
} from './crashGame';

export interface ICrashClientToServerEvents {
    'game-bets': (bets: PendingBetType[]) => void;
    'game-starting': (data: {
        _id: string | null;
        privateHash: string | null;
        timeUntilStart?: number;
    }) => void;
    'game-start': (data: { publicSeed: string }) => void;
    'bet-cashout': (data: {
        playerID: string;
        status: number;
        stoppedAt: number | undefined;
        winningAmount: number;
    }) => void;
    'game-end': (data: { game: FormattedGameHistoryType }) => void;
    'game-tick': (data: number) => void;
    'crashgame-join-success': (data: FormattedPlayerBetType) => void;
    'bet-cashout-error': (data: string) => void;
    'bet-cashout-success': (result: any) => void;
}

export interface ICrashServerToClientEvents {
    auth: (token: string) => void;
    'join-crash-game': (target: number, betAmount: number) => void;
    'bet-cashout': () => void;
}
