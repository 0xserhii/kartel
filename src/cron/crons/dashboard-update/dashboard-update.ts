import Cron, { ScheduleOptions } from "node-cron";
import { BaseCron } from "@/cron/crons/base.cron";
import { DashboardService } from "@/modules/dashboard";
import { RevenueLogService } from "@/modules/revenue-log";

export class DashboardUpdate extends BaseCron {
    private dashboardService = new DashboardService();
    private revenuelogService = new RevenueLogService();

    constructor(cronExpression: string, option = <ScheduleOptions>{}) {
        super(cronExpression, option);
        this.start();
    }

    public start = () => {
        this.initCron();
    };

    private initCron = () => {
        this.task = Cron.schedule(
            this.cronExpression,
            async () => {
                await this.catchWrapper(
                    this.updateDashboardStatus,
                    "updateDashboardStatus"
                );
            },
            this.option
        );
    };

    private updateDashboardStatus = async () => {
        try {
            console.log("Start updateDashboardStatus");
            await this.fetchAndSaveRevenulogData();
        } catch (error) {
            console.error("Error in updateDashboardStatus:", error);
        }
    };

    private fetchAndSaveRevenulogData = async () => {
        try {
            const insertDate = new Date()
            const revenueLogs = await this.revenuelogService.getLatest();
            console.log(revenueLogs);
            await this.dashboardService.saveRevenulogData(revenueLogs, insertDate);
            console.log("Revenulog data saved successfully");
        } catch (error) {
            console.error("Error fetching or saving revenulog data:", error);
        }
    };
}