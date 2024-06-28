import Heading from './heading';
import UserNav from './user-nav';
import { MessageSquareMore } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import authBtn from '/assets/auth-btn.svg';
import useModal from '@/hooks/use-modal';
import { ModalType } from '@/types/modal';
import { useOpen } from '@/provider/chat-provider';
import { useAppSelector } from '@/store/redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { initialBalance, token } from '@/constants/data';
import { useWallet } from '@/provider/crypto/wallet';

export default function Header() {
  const modal = useModal();
  const { open, setOpen } = useOpen();
  const userData = useAppSelector((store: any) => store.user.userData);
  const siteBalanceStatus = useAppSelector((store: any) => store.user.siteBalanceStatus);
  const { account } = useWallet();
  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };
  const [walletData, setWalletData] = useState(initialBalance);

  const getSiteBalance = async (type: string, txHash?: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/users/${userData._id}/balance`,
        {
          balanceType: token[0].name,
          actionType: type,
          amount: 0,
          txHash,
          address: account?.address
        }
      );
      if (response.status === 200) {
        const walletDataRes = {
          usk: response.data?.responseObject.wallet.usk ?? 0,
          kart: response.data?.responseObject.wallet.kart ?? 0
        }
        setWalletData(walletDataRes);
      }
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  useEffect(() => {
    getSiteBalance('get');
  }, [siteBalanceStatus]);

  return (
    <div className="flex flex-1 items-center justify-between bg-dark bg-opacity-30 bg-blend-multiply">
      <Heading />
      <div className='flex flex-row gap-5'>
        <div className='flex flex-row gap-5'>
          <div className='flex flex-row items-center gap-2'>
            <img
              src={`/assets/tokens/usk.png`}
              className="h-7 w-7"
            />
            <span className="w-4/12 text-center text-gray-300">
              {Number(walletData.usk).toFixed(2) ?? 0}
            </span>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <img
              src={`/assets/tokens/kart.png`}
              className="h-7 w-7"
            />
            <span className="w-4/12 text-center text-gray-300">
              {Number(walletData.kart).toFixed(2) ?? 0}
            </span>
          </div>
        </div>
        <div className="ml-4 mr-8 flex items-center gap-10 md:ml-6">
          {userData?.username !== '' ? (
            <div className="flex items-center gap-4">
              <Button
                className="hidden bg-transparent px-0 hover:bg-transparent lg:block"
                onClick={() => setOpen(!open)}
              >
                <MessageSquareMore
                  className={`text-${open ? 'purple' : 'white'}`}
                />
              </Button>
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
    </div>
  );
}
