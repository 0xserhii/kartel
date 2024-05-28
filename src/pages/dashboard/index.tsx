import { ScrollArea } from '@/components/ui/scroll-area';
import Home from './components/home.component';
import { useTab } from '@/providers/tab-provider';
import Leaderboard from './components/leaderboard.component';

export default function DashboardPage() {
  const { tab } = useTab();

  if (tab === 'home')
    return (
      <ScrollArea className="h-[calc(100vh-64px)]">
        <Home />
      </ScrollArea>
    );

  if (tab === 'leader board')
    return (
      <ScrollArea className="h-[calc(100vh-64px)]">
        <Leaderboard />
      </ScrollArea>
    );
}
