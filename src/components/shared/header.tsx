import Heading from './heading';
import UserNav from './user-nav';
// import Coin from '/assets/coin-icon.svg';
import { MessageSquareMore } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import authBtn from '/assets/auth-btn.svg';
import useModal from '@/routes/hooks/use-modal';
import { ModalType } from '@/types/modal';
import { usePersistStore } from '@/store/zustand/persist';
import { useOpen } from '@/provider/chat-provider';

export default function Header() {
  const modal = useModal();
  const { open, setOpen } = useOpen();
  const userData = usePersistStore((store) => store.app.userData);

  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };

  // const handleAddGold = async () => {
  //   modal.open(ModalType.ADDGOLD)
  // }

  return (
    <div className="flex flex-1 items-center justify-between bg-dark bg-opacity-30 bg-blend-multiply">
      <Heading />
      <div className="ml-4 mr-8 flex items-center gap-10 md:ml-6">
        {userData?.username !== '' ? (
          <div className="flex items-center gap-2">
            {/* <div className="flex items-center gap-3"> */}
            {/* <div className="flex h-10 w-36 items-center justify-end rounded-full border-[1.5px] border-blue2 px-[5px]">
                  <div className="flex flex-grow items-center gap-1 pl-[15px] text-blue2">
                    <img src={Coin} alt="Coin-icon" />
                    <span>12,000</span>
                  </div>
                  <Button className="h-[30px] max-h-[30px] min-h-[30px] w-[30px] min-w-[30px] max-w-[30px] rounded-full border-none !bg-blue2 p-0 text-gray50 outline-none" onClick={handleAddGold}>
                    <Plus />
                  </Button>
                </div> */}
            <Button
              className="hidden bg-transparent hover:bg-transparent lg:block px-0"
              onClick={() => setOpen(!open)}
            >
              <MessageSquareMore
                className={`text-[${open ? '#A326D4' : '#fff'}]`}
              />
            </Button>
            {/* <Bell className="text-gray50" /> */}
            {/* </div> */}
            <Separator orientation={'vertical'} className="h-6" />
            <UserNav />
          </div>
        ) : (
          <Button
            className="gap-2 rounded-lg bg-[#049DD9] text-white hover:bg-[#049DD9]"
            onClick={handleSignIn}
          >
            <img src={authBtn} />
            <span className="uppercase">Sign In</span>
          </Button>
        )}
      </div>
    </div>
  );
}
