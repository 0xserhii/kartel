import { UserSubscription } from "./crons";

// Cron Jobs
/**
 * Cron expression:
 * 1. Minute (0 - 59)
 * 2. Hour (0 - 23)
 * 3. Day of the month (1 - 31)
 * 4. Month (1 - 12)
 * 5. Day of the week (0 - 6) (Sunday to Saturday, or use names)
 * 6. Year (optional)
 */

// User Subscription Daily Cron Job
// Executes every day at 00:01 AM
const userSubscriptionCron = new UserSubscription("1 0 * * *", {
  scheduled: true,
});

export const CronJobs = {
  userSubscriptionCron,
};
