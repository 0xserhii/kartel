import { Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import DashboardLayout from "@/components/layout/dashboard-layout";
import MinesGame from "@/pages/games/mines";
import Home from "@/pages/main/home";
import CrashGame from "@/pages/games/crash";
import CoinFlipGame from "@/pages/games/coin-flip";
import Leaderboard from "@/pages/main/leader-board";
import Dashboard from "@/pages/main/dashboard";
import NotFound from "@/pages/not-found";
import SlotsGames from "@/pages/games/slots";
import BlackJackGames from "@/pages/games/blackjack";
import RouletteGames from "@/pages/games/roulette";
import HorseRacingGames from "@/pages/games/horse-race";
import HelpSupport from "@/pages/help-support";

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: "/",
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/leader-board",
          element: <Leaderboard />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/crash",
          element: <CrashGame />,
        },
        {
          path: "/coin-flip",
          element: <CoinFlipGame />,
        },
        {
          path: "/mines",
          element: <MinesGame />,
        },
        {
          path: "/slots",
          element: <SlotsGames />,
        },
        {
          path: "/black-jack",
          element: <BlackJackGames />,
        },
        {
          path: "/roulette",
          element: <RouletteGames />,
        },
        {
          path: "/horse-racing",
          element: <HorseRacingGames />,
        },
        {
          path: "/help-support",
          element: <HelpSupport />,
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  const protectedRoutes = [

  ]
  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
