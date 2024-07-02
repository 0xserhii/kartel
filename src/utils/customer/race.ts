// Require Dependencies

import { RaceEntryService } from "@/modules/race-entry";
import { RaceGameService } from "@/modules/race-game";
import UserBotService from "@/modules/user-bot/user-bot.service";
import { getVipLevelFromWager } from "./vip";
import mongoose from "mongoose";
import UserService from "@/modules/user/user.service";

// Enter an active race (if there is currently one active)
async function checkAndEnterRace(
  userId: string,
  amount: number
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const raceService = new RaceGameService();
      const raceEntryService = new RaceEntryService();
      const userBotService = new UserBotService();
      const userService = new UserService();
      // Get active race
      const activeRace = await raceService.getItem({ active: true });

      // If there is an active race
      if (activeRace) {
        // Find the user in the fakeUsers array
        const botUser = await userBotService.getItemById(userId);

        if (botUser) {
          // If user is not in the fakeUsers array, query the database

          if (!botUser || botUser.rank > 1) {
            // If user doesn't exist or isn't allowed to participate
            // Resolve to successfully continue
            return resolve();
          }
          const existingEntry = await raceEntryService.getItem({
            _user: userId,
            _race: activeRace.id,
          });

          if (existingEntry) {
            await raceEntryService.updateById(existingEntry.id, {
              $inc: { value: amount },
              $set: {
                user_level: getVipLevelFromWager(botUser.wager).name,
                user_levelColor: getVipLevelFromWager(botUser.wager).levelColor,
                username: botUser.username,
                avatar: botUser.avatar,
              },
            });
          } else {
            const newEntryPayload = {
              value: amount,
              _user: new mongoose.Types.ObjectId(userId),
              user_level: getVipLevelFromWager(botUser.wager).name,
              user_levelColor: getVipLevelFromWager(botUser.wager).levelColor,
              _race: activeRace.id,
              username: botUser.username,
              avatar: botUser.avatar,
            };
            await raceEntryService.create(newEntryPayload);
          }
        } else {
          // If user is not in the fakeUsers array, query the database
          const user = await userService.getItemById(userId);

          if (!user || user.rank > 1) {
            // If user doesn't exist or isn't allowed to participate
            // Resolve to successfully continue
            return resolve();
          }

          const existingEntry = await raceEntryService.getItem({
            _user: userId,
            _race: activeRace.id,
          });

          if (existingEntry) {
            await raceEntryService.updateById(existingEntry.id, {
              $inc: { value: amount },
              $set: {
                user_level: getVipLevelFromWager(user?.wager as any).name,
                user_levelColor: getVipLevelFromWager(user?.wager as any)
                  .levelColor,
                username: user.username,
                avatar: user.avatar,
              },
            });
          } else {
            const newEntryPayload = {
              value: amount,
              _user: new mongoose.Types.ObjectId(userId),
              user_level: getVipLevelFromWager(user.wager as any).name,
              user_levelColor: getVipLevelFromWager(user.wager as any)
                .levelColor,
              _race: activeRace.id,
              username: user.username,
              avatar: user.avatar,
            };

            await raceEntryService.create(newEntryPayload);
          }
        }

        // Resolve to successfully continue
        resolve();
      } else {
        // If there is no active race
        // Resolve to successfully continue
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Increment active race prize by rake% (if there is currently one active)
async function checkAndApplyRakeToRace(rakeValue: number) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // Get active race
      const raceGameService = new RaceGameService();
      const activeRace = await raceGameService.getItem({ active: true });

      // If there is an active race
      if (activeRace) {
        // Update and increment race prize | here was something changed from the original
        await raceGameService.updateById(activeRace.id, { $inc: { prize: 0 } });
        // Resolve to successfully continue
        resolve();
      } else {
        // Resolve to successfully continue
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Export functions
export { checkAndApplyRakeToRace, checkAndEnterRace };
