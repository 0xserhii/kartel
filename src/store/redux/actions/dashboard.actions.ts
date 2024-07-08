import { DashboardType } from "@/types/dashboard";
import { EDashboardSocketAction } from "../reducers/dashboard.type";

export function getDashboardboardHistory(dashboardHistory: DashboardType) {
  return {
    type: EDashboardSocketAction.GET_DASHBOARD_HISTORY,
    payload: dashboardHistory,
  };
}

export function getTopPlayersHistory(topPlayers: any) {
  return {
    type: EDashboardSocketAction.GET_TOP_PLAYERS,
    payload: topPlayers,
  };
}

export function subscribeDashboardServer() {
  return {
    type: EDashboardSocketAction.SUBSCRIBE_DASHBOARD,
    payload: null,
  };
}

export function disconnectDashboardServer() {
  return {
    type: EDashboardSocketAction.DISCONNECT_DASHBOARD,
    payload: null,
  };
}
