import { EDashboardSocketAction } from "./dashboard.type";
import { DashboardType } from "@/types/dashboard";

export interface IDashboardType {
  _id: string;
  username: string;
  rank: number;
  hasVerifiedAccount: boolean;
  createdAt: string;
  leaderboard: DashboardType;
}

type TDashboardHistory = {
  crash: IDashboardType[];
  coinflip: IDashboardType[];
};

interface IDashboardState {
  dashboardHistory: TDashboardHistory;
  topPlayers: any;
}

const initialState: IDashboardState = {
  dashboardHistory: {
    crash: [],
    coinflip: [],
  },
  topPlayers: {}
};

export default function dashboardReducer(
  state = initialState,
  action
): IDashboardState {
  switch (action.type) {
    case EDashboardSocketAction.GET_DASHBOARD_HISTORY:
      return {
        ...state,
        dashboardHistory: action.payload as TDashboardHistory,
      };

    case EDashboardSocketAction.GET_TOP_PLAYERS:
      return {
        ...state,
        topPlayers: action.payload as any
      };

    case EDashboardSocketAction.DISCONNECT_DASHBOARD:
      return initialState;

    default:
      return state;
  }
}
