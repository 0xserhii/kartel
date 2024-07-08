import mongoose, { Document } from "mongoose";

export declare interface IDashboardModel {
    revenueType: number;
    gameId: mongoose.Types.ObjectId;
    denom: string;
    lastBalance: number;
    insertDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
