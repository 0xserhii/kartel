import {
    FormattedGameHistoryType,
    FormattedPlayerBetType,
    BetType,
    CrashHistoryData
} from './crashGame';

export interface ICrashClientToServerEvents {
    'game-bets': (bets: FormattedPlayerBetType[]) => void;
    'game-starting': (data: {
        _id: string | null;
        privateHash: string | null;
        timeUntilStart?: number;
    }) => void;
    'game-start': (data: { publicSeed: string }) => void;
    'bet-cashout': (data: {
        userdata: BetType;
        status: number;
        stoppedAt: number | undefined;
        winningAmount: number;
    }) => void;
    'game-end': (data: { game: FormattedGameHistoryType }) => void;
    'game-tick': (data: number) => void;
    'crashgame-join-success': (data: FormattedPlayerBetType) => void;
    'bet-cashout-error': (data: string) => void;
    'bet-cashout-success': (result: any) => void;
    'previous-crashgame-history': (count: number) => void;
    'game-join-error': (data: string) => void;
}



export interface ICrashServerToClientEvents {
    auth: (token: string) => void;
    'join-crash-game': (target: number, betAmount: number) => void;
    'bet-cashout': () => void;
    'previous-crashgame-history': (historyData: CrashHistoryData[]) => void;
}
