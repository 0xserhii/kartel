import { navItems } from '@/constants/data';
import DashboardNav from './dashboard-nav';
import { Link } from 'react-router-dom';
import Logo from '/assets/logo.svg';
import Deposit from '/assets/deposit-icon.svg';
import { ScrollArea } from '../ui/scroll-area';
import useModal from '@/routes/hooks/use-modal';
import { ModalType } from '@/types/modal';

export default function Sidebar() {

  const modal = useModal()

  const handleDeposit = async () => {
    modal.open(ModalType.DEPOSIT)
  }

  return (
    <ScrollArea>
      <aside className="hidden h-screen w-72 flex-col items-center gap-2 justify-between overflow-y-auto overflow-x-hidden bg-dark bg-opacity-70 p-5 bg-blend-multiply xl:flex">
        <div className="flex w-full flex-col items-center gap-8">
          <Link to="/" className="pt-1">
            <img src={Logo} />
          </Link>
          <DashboardNav items={navItems} />
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-blue1 px-5 py-3 text-white mb-5"
          onClick={handleDeposit}
        >
          <img src={Deposit} />
          <div className="flex flex-col items-stretch gap-1">
            <span className="text-base font-semibold text-gray50">
              Deposit Now
            </span>
            <span className="text-sm text-gray300">Get $100 bonus</span>
          </div>
        </button>
      </aside>
    </ScrollArea>
  );
}
