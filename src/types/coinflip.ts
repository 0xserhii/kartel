export interface ICoinflipServerToClientEvents {
    'coinflip-probability': (data: number) => void;
}

export interface ICoinflipClientToServerEvents {
    auth: (token: string) => void;
    'coinflip-probability': (data: { betCoinsCount: number; betSideCount: number; }) => void;
}

