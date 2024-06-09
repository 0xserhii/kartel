import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const Home = lazy(() => import('@/pages/main/home'));
const Leaderboard = lazy(() => import('@/pages/main/leader-board'));
const SignUpPage = lazy(() => import('@/pages/auth/signup'));
const CrashGame = lazy(() => import('@/pages/games/crash'));
const CoinFlipGame = lazy(() => import('@/pages/games/coin-flip'));

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
          element: <CoinFlipGame />
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
      path: '/login',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/register',
      element: <SignUpPage />,
      index: true
    },
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
