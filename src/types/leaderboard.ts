export interface LeaderboardType {
    _id: string;
    username: string;
    userEmail: string;
    avatar: string;
    hasVerifiedAccount: boolean;
    createAt: Date;
    rank: number;
    leaderboard: any;
}