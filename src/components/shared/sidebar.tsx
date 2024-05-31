import { navItems } from '@/constants/data';
import DashboardNav from './dashboard-nav';
import { Link } from 'react-router-dom';
import Logo from '/assets/logo.svg';
import Deposit from '/assets/deposit-icon.svg';
import { ScrollArea } from '../ui/scroll-area';
import useModal from '@/routes/hooks/use-modal';
import { ModalType } from '@/types/modal';
import { useWallet } from '@/provider/crypto/wallet';

export default function Sidebar() {
  const modal = useModal();
  const { account } = useWallet();

  console.log(account)

  const handleDeposit = async () => {
    if (account) modal.open(ModalType.DEPOSIT);
    else modal.open(ModalType.WALLETCONNECT);
  };

  return (
    <aside className="hidden h-screen w-72 flex-col items-center justify-between gap-2 overflow-x-hidden overflow-y-hidden bg-dark bg-opacity-70 bg-blend-multiply xl:flex">
      <ScrollArea className="h-screen w-full p-5">
        <div className="flex w-full flex-col items-center justify-between">
          <div className="flex w-full flex-col items-center gap-8">
            <Link to="/" className="pt-1">
              <img src={Logo} />
            </Link>
            <DashboardNav items={navItems} />
          </div>
          <div className='flex mt-16'>
            <button
              className="flex items-center gap-2 rounded-lg bg-blue1 px-5 py-3 text-white"
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
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
