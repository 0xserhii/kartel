import mongoose, { FilterQuery, ObjectId } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";
import { CrashGameService } from "../crash-game.service";
import { ICrashGameDocument } from "../crash-game.interface";
import { CBET_STATES, CGAME_STATES } from "../crash-game.constant";
import logger from "@/utils/logger";
import UserService from "@/modules/user/user.service";
import { WalletTransactionService } from "@/modules/wallet-transaction";
import { Namespace } from "socket.io";


export class CrashGameSocketController {
    // Services
    private crashGameService: CrashGameService;
    private userServices: UserService;
    private walletTransactionService: WalletTransactionService;

    // Diff services
    private localizations: ILocalization;

    // Logger config
    private logoPrefix: string = "CrashGameSocketController::: ";

    // Socket setting
    private crashSocketNamespace: Namespace;

    constructor() {
        this.crashGameService = new CrashGameService();
        this.userServices = new UserService();
        this.walletTransactionService = new WalletTransactionService();

        this.localizations = localizations["en"];
    }

    public getAll = async () => {
        const crashGameFilter = <FilterQuery<ICrashGameDocument>>{};
        const [item, count] = await Promise.all([
            this.crashGameService.get(crashGameFilter),
            this.crashGameService.getCount(crashGameFilter),
        ]);

        return {
            item,
            count,
        };
    };

    public getByName = async (name) => {
        const crashGame = await this.crashGameService.getItem({ name });

        // need add to localizations
        if (!crashGame) {
            throw new CustomError(404, "Crash game not found");
        }

        return crashGame;
    };

    public getById = async (crashGameId) => {
        const crashGame = await this.crashGameService.getItemById(crashGameId);

        // need add to localizations
        if (!crashGame) {
            throw new CustomError(404, "Crash game not found");
        }

        return crashGame;
    };

    public create = async (crashGame) => {
        try {
            return await this.crashGameService.create(crashGame);
        } catch (error) {
            if (error.code === 11000) {
                throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
            }

            throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
        }
    };

    public update = async ({ id }, crashGameData) => {
        try {
            const crashGame = await this.crashGameService.updateById(id, crashGameData);

            // need add to localizations
            if (!crashGame) {
                throw new CustomError(404, "Crash game not found");
            }

            return crashGame;
        } catch (error) {
            if (error.code === 11000) {
                throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
            } else if (error.status) {
                throw new CustomError(error.status, error.message);
            } else {
                throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
            }
        }
    };

    public delete = async ({ id }) => {
        const crashGame = await this.crashGameService.deleteById(id);

        // need add to localizations
        if (!crashGame) {
            throw new CustomError(404, "Crash game not found");
        }

        return crashGame;
    };

    public getUnfinishedGames = async () => {
        return this.crashGameService.getUnfinishedGames();
    }

    public refundGame = async (gameId: ObjectId) => {
        const game = await this.crashGameService.getItemById(gameId);
        if (!game) {
            return null
        }
        const refundedPlayers = [];

        for (const playerID in game.players) {
            const bet = game.players[playerID];

            if (bet.status == CBET_STATES.Playing) {
                // Push Player ID to the refunded players
                refundedPlayers.push(playerID);

                logger.info(this.logoPrefix + `Refunding player ${playerID} for ${bet.betAmount}`);

                // Refund player
                await this.userServices.updateById(playerID, {
                    $inc: {
                        [`wallet.${bet.denom}`]: Math.abs(bet.betAmount),
                    },
                })
                const newWalletTxData = { _user: new mongoose.Types.ObjectId(playerID), amount: Math.abs(bet.betAmount), reason: 'Crash refund', extraData: { crashGameId: game._id } };
                await this.walletTransactionService.create(newWalletTxData);
            }
        }

        // Update game status
        const updatePayload = {
            refundedPlayers,
            status: CGAME_STATES.Refunded
        }
        const updatedGame = await this.crashGameService.updateById(gameId, updatePayload);

        return updatedGame;
    }

    public getRandomBetAmount = () => {
        const randomNumber = Math.random();
        let betAmount;

        if (randomNumber <= 0.95) {
            // 95% chance for bets between 0.1 and 8
            if (Math.random() <= 0.65) {
                // 65% chance for bets without decimals (full numbers)
                betAmount = Math.floor(Math.random() * 8) + 1; // Generates a random integer between 1 and 8 (inclusive)
            } else {
                // 35% chance for bets with decimals
                betAmount = Math.random() * (8 - 0.1) + 0.1; // Generates a random decimal number between 0.1 and 8
            }
        } else {
            // 5% chance for bets between 8 and 120.2
            if (Math.random() <= 0.65) {
                // 65% chance for bets without decimals (full numbers)
                betAmount = Math.floor(Math.random() * (120.2 - 8)) + 8; // Generates a random integer number between 8 and 120.2
            } else {
                // 35% chance for bets with decimals
                betAmount = Math.random() * (120.2 - 8) + 8; // Generates a random decimal number between 8 and 120.2
            }
        }

        return parseFloat(betAmount.toFixed(2));
    }

}
