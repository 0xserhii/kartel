import Heading from './heading';
import UserNav from './user-nav';
import { MessageSquareMore, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import authBtn from '/assets/auth-btn.svg';
import useModal from '@/hooks/use-modal';
import { ModalType } from '@/types/modal';
import { useOpen } from '@/provider/chat-provider';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { useEffect, useState } from 'react';
import { initialBalance, token } from '@/constants/data';
import { subscribeUserServer } from '@/store/redux/actions/user.action';
import { settingsActions } from '@/store/redux/actions';
import useSound from 'use-sound';
import axios from 'axios';
import { useWallet } from '@/provider/crypto/wallet';

export default function Header() {
  const modal = useModal();
  const { open, setOpen } = useOpen();
  const userData = useAppSelector((store: any) => store.user.userData);
  const siteBalance = useAppSelector((store: any) => store.user.wallet);
  const settings = useAppSelector((store: any) => store.settings);
  const dispatch = useAppDispatch();
  const { account } = useWallet();
  const [walletData, setWalletData] = useState(initialBalance);
  const [play, { stop }] = useSound('/assets/audio/background_audio.mp3', { volume: 0.5, loop: true });

  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };

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


  const handleAudio = () => {
    dispatch(settingsActions.audioPlay(!settings.isAudioPlay))
  }

  useEffect(() => {
    if (userData?.username !== '') {
      getSiteBalance('get');
    }
  }, [siteBalance]);

  useEffect(() => {
    dispatch(subscribeUserServer());
  }, []);

  useEffect(() => {
    if (settings.isAudioPlay) {
      play();
    } else {
      stop();
    }
  }, [settings.isAudioPlay])

  return (
    <div className="flex flex-1 items-center justify-between bg-dark bg-opacity-30 bg-blend-multiply">
      <Heading />
      <div className='flex flex-row gap-5'>
        {userData?.username && (
          <div className='flex flex-row gap-5'>
            {['usk', 'kart'].map((token) => (
              <div key={token} className='flex flex-row items-center gap-2'>
                <img
                  src={`/assets/tokens/${token}.png`}
                  className="h-7 w-7"
                />
                <span className="w-4/12 text-center text-gray-300">
                  {Number(siteBalance?.denom === token ? siteBalance.value : walletData[token]).toFixed(2) ?? 0}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="ml-4 mr-8 flex items-center gap-10 md:ml-6">
          {
            settings.isAudioPlay ? <Volume2 className='text-purple cursor-pointer' onClick={handleAudio} /> : <VolumeX className='text-white cursor-pointer' onClick={handleAudio} />
          }
          {userData?.username !== '' ? (
            <div className="flex flex-row items-center gap-8">
              <Button
                className="hidden bg-transparent px-0 hover:bg-transparent lg:block"
                onClick={() => setOpen(!open)}
              >
                <MessageSquareMore
                  className={`text-${open ? 'purple' : 'white'}`}
                />
              </Button>
              <UserNav />
            </div>
          ) : (
            <Button
              className="gap-2 rounded-lg bg-[#049DD9] text-white hover:bg-[#049DD9]"
              onClick={handleSignIn}
            >
              <img src={authBtn} />
              <span className="uppercase">Log in</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
