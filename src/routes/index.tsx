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
const CrashGames = lazy(() => import('@/pages/games/crash'));

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
          element: <CrashGames />
        },
        {
          path: '/coin-flip',
          element: <CrashGames />
        },
        {
          path: '/mines',
          element: <CrashGames />
        },
        {
          path: '/slots',
          element: <CrashGames />
        },
        {
          path: '/coin-flip-mini',
          element: <CrashGames />
        },
        {
          path: '/roulette',
          element: <CrashGames />
        },
        {
          path: '/hourse-racing',
          element: <CrashGames />
        },
        {
          path: '/settings',
          element: <CrashGames />
        },
        {
          path: '/help-support',
          element: <CrashGames />
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
