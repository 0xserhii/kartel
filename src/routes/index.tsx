import { Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import DashboardLayout from '@/components/layout/dashboard-layout';
import MinesGame from '@/pages/games/mines';
import Home from '@/pages/main/home';
import CrashGame from '@/pages/games/crash';
import CoinFlipGame from '@/pages/games/coin-flip';
import Leaderboard from '@/pages/main/leader-board';
import NotFound from '@/pages/not-found';

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/leader-board',
          element: <Leaderboard />
        },
        {
          path: '/dashboard',
          element: ''
        },
        {
          path: '/crash',
          element: <CrashGame />
        },
        {
          path: '/coin-flip',
          element: <CoinFlipGame />
        },
        {
          path: '/mines',
          element: <MinesGame />
        },
        {
          path: '/slots',
          element: <CoinFlipGame />
        },
        {
          path: '/black-jack',
          element: <CoinFlipGame />
        },
        {
          path: '/roulette',
          element: <CoinFlipGame />
        },
        {
          path: '/hourse-racing',
          element: <CoinFlipGame />
        },
        {
          path: '/settings',
          element: <CoinFlipGame />
        },
        {
          path: '/help-support',
          element: <CoinFlipGame />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];
  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
