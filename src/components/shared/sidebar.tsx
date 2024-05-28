import { navItems } from '@/constants/data';
import DashboardNav from './dashboard-nav';
import { Link } from 'react-router-dom';
import Logo from '/assets/logo.svg';
import Deposit from '/assets/deposit-icon.svg';
import { ScrollArea } from '../ui/scroll-area';

export default function Sidebar() {
  return (
    <ScrollArea>
      <aside className="hidden h-screen w-72 flex-col items-center gap-2 justify-between overflow-y-auto overflow-x-hidden bg-dark bg-opacity-70 p-5 bg-blend-multiply xl:flex">
        <div className="flex w-full flex-col items-center gap-8">
          <Link to="/" className="pt-1">
            <img src={Logo} />
          </Link>
          <DashboardNav items={navItems} />
        </div>
        <div className="w-full">
          <Link
            to="/deposit"
            className="flex items-center gap-2 rounded-lg bg-blue1 px-6 py-4 text-white"
          >
            <img src={Deposit} />
            <div className="flex flex-col items-stretch gap-1">
              <span className="text-base font-semibold text-gray50">
                Deposit Now
              </span>
              <span className="text-sm text-gray300">Get $100 bonus</span>
            </div>
          </Link>
        </div>
      </aside>
    </ScrollArea>
  );
}
