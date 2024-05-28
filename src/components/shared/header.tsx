import Heading from './heading';
import UserNav from './user-nav';
import Coin from '@/assets/coin-icon.svg';
import { Plus, Bell } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import authBtn from '@/assets/auth-btn.svg'
import useModal from '@/routes/hooks/use-modal';
import { ModalType } from '@/types/modal';

export default function Header() {

  const modal = useModal()

  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN)
  }

  return (
    <div className="flex flex-1 items-center justify-between bg-dark bg-opacity-30 bg-blend-multiply">
      <Heading />
      <div className="ml-4 mr-8 flex items-center md:ml-6 gap-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-40 items-center justify-end rounded-full border-[1.5px] border-blue2 px-[5px]">
              <div className="flex flex-grow items-center gap-2 pl-[15px] text-blue2">
                <img src={Coin} alt="Coin-icon" />
                <span>12,000</span>
              </div>
              <Button className="h-[30px] max-h-[30px] min-h-[30px] w-[30px] min-w-[30px] max-w-[30px] rounded-full border-none !bg-blue2 p-0 text-gray50 outline-none">
                <Plus />
              </Button>
            </div>
            <Bell className="text-gray50" />
          </div>
          <Separator orientation={'vertical'} className="h-6" />
          <UserNav />
        </div>
        <Button className='bg-[#049DD9] hover:bg-[#049DD9] rounded-lg gap-2 text-white' onClick={handleSignIn}>
          <img src={authBtn} />
          <span className='uppercase'>
            Sign In
          </span>
        </Button>
      </div>
    </div>
  );
}
