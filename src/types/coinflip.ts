import { ICoinPlayer } from "./coinflipGame";

export interface ICoinflipServerToClientEvents {
    'coinflip-probability': (data: number) => void;
    'game-creation-error': (message: string) => void;
    'new-coinflip-game': (gameData: any) => void;
    'coinflipgame-join-success': () => void;
    'coinflipgame-joined': (data: { _id: string; newPlayer: ICoinPlayer }) => void;
    'coinflipgame-rolling': (data: { game_id: string, animation_time: number }) => void;
    'coinflipgame-rolled': ({
        _id,
        randomModule,
        coinflipResult,
        isEarn,
    }: {
        _id: string;
        randomModule: number;
        coinflipResult: boolean[];
        isEarn: boolean;
    }) => void;
}

export interface ICoinflipClientToServerEvents {
    auth: (token: string) => void;
    'coinflip-probability': (data: { betCoinsCount: number; betSideCount: number; }) => void;
    'create-new-coinflipgame': (data: { betAmount: number; denom: string; betCoinsCount: number; betSideCount: number, betSide: boolean }) => void;
}

