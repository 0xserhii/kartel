import mongoose from "mongoose";

// Declare RaceEntry interface
export interface IRaceEntry extends Document {
    value: number;
    _user: mongoose.Types.ObjectId;
    user_level: string;
    user_levelColor: string;
    username: string;
    avatar: string;
    _race: mongoose.Types.ObjectId;
    created: Date;
}