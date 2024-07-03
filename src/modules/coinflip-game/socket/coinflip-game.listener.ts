import jwt, { JwtPayload } from "jsonwebtoken";
import { Event as SocketEvent, Namespace, Server, Socket } from "socket.io";

import { TOKEN_SECRET } from "@/config";
import { ESOCKET_NAMESPACE } from "@/constant/enum";
import { IUserModel } from "@/modules/user/user.interface";
import UserService from "@/modules/user/user.service";

import { ECoinflipGameEvents } from "../coinflip-game.constant";

class CoinflipGameSocketListener {
  private socketServer: Namespace;
  private loggedIn = false;
  private user: IUserModel | null = null;
  private userService: UserService;

  constructor(socketServer: Server) {
    this.socketServer = socketServer.of(ESOCKET_NAMESPACE.coinflip);
    this.initializeListener();
    this.subscribeListener();
  }

  private subscribeListener(): void {
    this.socketServer.on("connection", (socket: Socket) => {
      this.initializeSubscribe(socket);
      // Auth handler
      socket.on(ECoinflipGameEvents.auth, async (token: string) => {
        this.authHandler(token, socket);
      });
      // Create Coinflip Game handler
      socket.on(
        ECoinflipGameEvents.createCoinflipGame,
        async (_data: {
          betAmount: number;
          denom: string;
          betCoinsCount: number;
          betSide: boolean;
          betSideCount: number;
        }) => {
          // this.createCoinflipGame(data, socket);
        }
      );
      // // Disconnect Handler
      // socket.on(ECoinflipGameEvents.disconnect, async () => {
      //   this.disconnect(socket);
      // });

      // Check for users ban status
      socket.use((packet: SocketEvent, next: (err?: any) => void) =>
        this.banStatusCheckMiddleware(packet, next, socket)
      );
    });
  }

  private initializeListener = async () => {};

  private initializeSubscribe = async (socket: Socket) => {};

  private banStatusCheckMiddleware = async (
    _packet: SocketEvent,
    next: (err?: any) => void,
    socket: Socket
  ) => {
    if (this.loggedIn && this.user) {
      try {
        const dbUser = await this.userService.getItem({ _id: this.user._id });

        // Check if user is banned
        if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
          return socket.emit("user banned");
        } else {
          return next();
        }
      } catch (error) {
        return socket.emit("user banned");
      }
    } else {
      return next();
    }
  };

  private authHandler = async (token: string, socket: Socket) => {
    if (!token) {
      this.loggedIn = false;
      this.user = null;
      return socket.emit(
        "error",
        "No authentication token provided, authorization declined"
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
      const user = await this.userService.getItem({ _id: decoded.userId });

      if (user) {
        if (parseInt(user.banExpires) > new Date().getTime()) {
          this.loggedIn = false;
          this.user = null;
          return socket.emit("user banned");
        } else {
          this.loggedIn = true;
          socket.join(String(user._id));
        }
      }
    } catch (error) {
      this.loggedIn = false;
      console.log("error handle", error);
      this.user = null;
      return socket.emit("notify-error", "Authentication token is not valid");
    }
  };

  // private createCoinflipGame = async (
  //   data: {
  //     betAmount: number;
  //     denom: string;
  //     betCoinsCount: number;
  //     betSide: boolean;
  //     betSideCount: number;
  //   },
  //   socket: Socket
  // ) => {
  //   // Get coinflip enabled status
  //   const isEnabled = getCoinflipState();
  //   const { betAmount, denom, betCoinsCount, betSide, betSideCount } = data;
  //   // If coinflip are disabled
  //   if (!isEnabled) {
  //     return socket.emit("game-creation-error", "Please login first.");
  //   }
  //   // More validation on the bet value
  //   if (
  //     parseFloat(betAmount.toFixed(2)) < CCoinFlipConfig.minBetAmount ||
  //     parseFloat(betAmount.toFixed(2)) > CCoinFlipConfig.maxBetAmount
  //   ) {
  //     return socket.emit(
  //       "game-creation-error",
  //       `Your bet must be a minimum of ${CCoinFlipConfig.minBetAmount} credits and a maximum of ${CCoinFlipConfig.maxBetAmount} credits!`
  //     );
  //   }

  //   if (
  //     betSideCount < CCoinFlipConfig.minBetCoinsCount ||
  //     betSideCount > CCoinFlipConfig.maxBetCoinsCount
  //   ) {
  //     return socket.emit(
  //       "game-creation-error",
  //       `Invalid bet Coin Count! Must be between ${CCoinFlipConfig.minBetCoinsCount} and ${CCoinFlipConfig.maxBetCoinsCount}`
  //     );
  //   }

  //   if (
  //     (betCoinsCount > 8 && betSideCount < 3) ||
  //     (betCoinsCount > 5 && betSideCount < 2) ||
  //     betSideCount < 1
  //   ) {
  //     return socket.emit("game-creation-error", `Invalid bet Coin Side Count!`);
  //   }

  //   try {
  //     if (!this.user) {
  //       return socket.emit(
  //         "game-creation-error",
  //         "Your account has an betting restriction."
  //       );
  //     }
  //     // Get user from database
  //     let dbUser = await this.userService.getItem({ _id: this.user!._id });
  //     const userId = this.user!._id.toString();
  //     // If user is self-excluded
  //     if (dbUser && dbUser.selfExcludes.coinflip > Date.now()) {
  //       return socket.emit(
  //         "game-creation-error",
  //         `You have self-excluded yourself for another ${((dbUser.selfExcludes.coinflip - Date.now()) / 3600000).toFixed(1)} hours.`
  //       );
  //     }

  //     // If user has restricted bets
  //     if (dbUser && dbUser.betsLocked) {
  //       return socket.emit(
  //         "game-creation-error",
  //         "Your account has an betting restriction."
  //       );
  //     }

  //     // If user can afford this bet
  //     if ((dbUser!.wallet.get(denom) || 0) < parseFloat(betAmount.toFixed(2))) {
  //       console.log(
  //         typeof dbUser!.wallet.get(denom),
  //         typeof parseFloat(betAmount.toFixed(2))
  //       );
  //       return socket.emit("game-creation-error", "You can't afford this bet!");
  //     }

  //     const newGame = new CoinflipGame();

  //     const newWalletValue =
  //       (dbUser!.wallet?.get(denom) || 0) -
  //       Math.abs(parseFloat(betAmount.toFixed(2)));
  //     const newWagerValue =
  //       (dbUser!.wager?.get(denom) || 0) +
  //       Math.abs(parseFloat(betAmount.toFixed(2)));
  //     const newWagerNeededForWithdrawValue =
  //       (dbUser!.wagerNeededForWithdraw?.get(denom) || 0) +
  //       Math.abs(parseFloat(betAmount.toFixed(2)));
  //     const newLeaderboardValue =
  //       (dbUser!.leaderboard?.get("coinflip")?.get(denom)?.betAmount || 0) +
  //       Math.abs(parseFloat(betAmount.toFixed(2)));
  //     // Remove bet amount from user's balance
  //     await this.userService.updateById(userId, {
  //       $set: {
  //         [`wallet.${denom}`]: newWalletValue,
  //         [`wagar.${denom}`]: newWagerValue,
  //         [`wagerNeededForWithdraw.${denom}`]: newWagerNeededForWithdrawValue,
  //         [`leaderboard.coinflip.${denom}.betAmount`]: newLeaderboardValue,
  //       },
  //     });
  //     const newWalletTxData = {
  //       userId,
  //       amount: -Math.abs(parseFloat(betAmount.toFixed(2))),
  //       type: "Coinflip game creation",
  //       coinflipGameId: newGame._id,
  //     };
  //     await this.walletTransactionService.create(newWalletTxData);

  //     // Update local wallet
  //     socket.emit("update-wallet", newWalletValue, denom);

  //     // Update user's race progress if there is an active race
  //     // await checkAndEnterRace(userId, Math.abs(parseFloat(betAmount.toFixed(2))));

  //     // Calculate house edge
  //     // const houseEdge = parseFloat(betAmount.toFixed(2)) * CCoinFlipConfig.feePercentage;

  //     // Apply user's rakeback if eligible
  //     // await checkAndApplyRakeback(userId, houseEdge);

  //     // Apply cut of house edge to user's affiliator
  //     // await checkAndApplyAffiliatorCut(userId, houseEdge);

  //     // Generate pre-roll provably fair data
  //     const provablyData = await generatePrivateSeedHashPair();

  //     // Basic fields
  //     newGame.betAmount = parseFloat(betAmount.toFixed(2));
  //     newGame.betCoinsCount = betCoinsCount; // How many percentage of the joining cost does the creator pay (only for private games)
  //     newGame.betSide = betSide; // Custom invite link (only for private games)
  //     newGame.betSideCount = betSideCount; // Total Bet amount of all players

  //     // Provably Fair fields
  //     newGame.privateSeed = provablyData.seed;
  //     newGame.privateHash = provablyData.hash;

  //     // UserID of who created this game
  //     newGame.user = this.user!._id;

  //     // Save the document
  //     await newGame.save();

  //     // Construct a object without seed
  //     const parsedGame = { ...newGame.toObject() };
  //     delete parsedGame.privateSeed;

  //     // Notify clients
  //     io.of("/coinflip").emit("new-coinflip-game", parsedGame);
  //     //socket.emit("notify-success", "Successfully created a new game!");

  //     console.log(
  //       colors.cyan("Coinflip >> Created a new game"),
  //       newGame._id,
  //       colors.cyan("worth"),
  //       `$${parseFloat(betAmount.toFixed(2))}.`,
  //       colors.cyan("Coins Count:"),
  //       betCoinsCount
  //     );

  //     // conflip game-rolling and generate random data
  //     io.of("/coinflip").emit("coinflipgame-rolling", {
  //       game_id: newGame._id.toString(),
  //       animation_time: CLIENT_ANIMATION_LENGTH,
  //     });
  //     console.log(colors.cyan("Coinflip >> Rolling game"), newGame._id);

  //     // Wait for the animation
  //     setTimeout(async () => {
  //       // Generate random data
  //       const randomData = await generateCoinflipRandom(
  //         newGame._id.toString(),
  //         newGame.privateSeed!,
  //         newGame.betCoinsCount
  //       );

  //       // Calculate winner
  //       const { isEarn, randomResultArray } = await CalculateWon(
  //         newGame.betCoinsCount,
  //         newGame.betSide,
  //         newGame.betSideCount,
  //         randomData.module
  //       );

  //       // Update document
  //       newGame.isEarn = isEarn;
  //       newGame.randomModule = randomData.module;

  //       // Calculate profit
  //       const probability = await probabilityXOrMoreHeads(
  //         newGame.betSideCount,
  //         newGame.betCoinsCount
  //       );
  //       const profit = newGame.betAmount / probability;
  //       const houseRake = profit * feePercentage;
  //       const feeMultiplier = 1 - feePercentage;
  //       const wonAmount = profit * feeMultiplier;

  //       console.log(
  //         colors.cyan("Coinflip >> Game"),
  //         newGame._id,
  //         colors.cyan("rolled, winner:"),
  //         user!.username,
  //         `(${probability * 100}%, profit: ${wonAmount}, house edge amount: ${houseRake})`
  //       );

  //       dbUser = await User.findById(userId);

  //       // Payout winner
  //       if (isEarn) {
  //         const newWalletValue =
  //           (dbUser!.wallet?.get(denom) || 0) +
  //           Math.abs(parseFloat(wonAmount.toFixed(2)));
  //         // const newLeaderboardBetValue =
  //         //   (dbUser!.leaderboard?.get('coinflip')?.get(denom)?.betAmount || 0) +
  //         //   Math.abs(parseFloat(betAmount.toFixed(2)));
  //         const newLeaderboardValue =
  //           (dbUser!.leaderboard?.get("coinflip")?.get(denom)?.winAmount || 0) +
  //           Math.abs(parseFloat(wonAmount.toFixed(2)));
  //         await User.updateOne(
  //           { _id: userId },
  //           {
  //             $set: {
  //               [`wallet.${denom}`]: newWalletValue,
  //               [`leaderboard.coinflip.${denom}.winAmount`]:
  //                 newLeaderboardValue,
  //             },
  //           }
  //         );
  //         insertNewWalletTransaction(
  //           userId,
  //           Math.abs(wonAmount),
  //           "Coinflip game win",
  //           {
  //             coinflipGameId: newGame._id,
  //           }
  //         );
  //         io.of("/coinflip")
  //           .to(dbUser!._id.toString())
  //           .emit("update-wallet", newWalletValue, denom);
  //       }

  //       // Add revenue to the site wallet
  //       const revenueId = process.env.REVENUE_ID || authentication.revenueId;
  //       const siteuser = await User.findById(revenueId);
  //       const newSiteWalletValue =
  //         (siteuser!.wallet?.get(denom) || 0) +
  //         Math.abs(
  //           parseFloat(isEarn ? houseRake.toFixed(2) : betAmount.toFixed(2))
  //         );
  //       await User.updateOne(
  //         { _id: revenueId },
  //         {
  //           $set: {
  //             [`wallet.${denom}`]: newSiteWalletValue,
  //           },
  //         }
  //       );

  //       // revenue log
  //       const newLog = new RevenueLog({
  //         userid: userId,
  //         // Revenue type 1: coinflip,  2: crash
  //         revenueType: 1,
  //         // Balance
  //         revenue: houseRake,
  //         denom: denom,
  //         lastBalance: siteuser!.wallet.get(denom),
  //       });

  //       await newLog.save();

  //       // Apply 0.5% rake to current race prize pool
  //       await checkAndApplyRakeToRace(houseRake * 0.005);

  //       // Notify clients
  //       io.of("/coinflip").emit("coinflipgame-rolled", {
  //         _id: String(newGame._id),
  //         randomModule: randomData.module,
  //         coinflipResult: randomResultArray,
  //         isEarn: isEarn,
  //       });
  //       // Update local wallet
  //     }, CLIENT_ANIMATION_LENGTH);
  //   } catch (error) {
  //     console.log("Error while creating Coinflip game:", error);
  //     return socket.emit(
  //       "game-creation-error",
  //       "Your bet couldn't be placed: Internal server error, please try again later!"
  //     );
  //   }
  // };

  // private disconnect = async (socket: Socket) => { };
}

export default CoinflipGameSocketListener;
