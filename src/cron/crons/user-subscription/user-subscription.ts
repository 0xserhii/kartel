import Cron, { ScheduleOptions } from "node-cron";

import { BaseCron } from "@/cron/crons/base.cron";

export class UserSubscription extends BaseCron {
  constructor(cronExpression: string, option = <ScheduleOptions>{}) {
    super(cronExpression, option);
  }

  public start = () => {
    this.initCron();
  };

  private initCron = () => {
    this.task = Cron.schedule(
      this.cronExpression,
      async () => {
        await this.catchWrapper(
          this.updateUserSubscriptionStatus,
          "updateUserSubscriptionStatus"
        );
      },
      this.option
    );
  };

  private updateUserSubscriptionStatus = async () => {
    console.log("Start updateUserSubscriptionStatus");
  };
}
