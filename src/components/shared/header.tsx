import Heading from "./heading";
import UserNav from "./user-nav";
import { MessageSquareMore } from "lucide-react";
import { Button } from "../ui/button";
import authBtn from "/assets/auth-btn.svg";
import useModal from "@/hooks/use-modal";
import { ModalType } from "@/types/modal";
import { useOpen } from "@/provider/chat-provider";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { useEffect, useState } from "react";
import { initialBalance } from "@/constants/data";
import { subscribeUserServer } from "@/store/redux/actions/user.action";
import { axiosGet, getAccessToken } from "@/utils/axios";
import useSound from "use-sound";
import ToggleButton from "./toggle-button";

export default function Header() {
  const modal = useModal();
  const { open, setOpen } = useOpen();
  const userData = useAppSelector((store: any) => store.user.userData);
  const siteBalance = useAppSelector((store: any) => store.user.wallet);
  const settings = useAppSelector((store: any) => store.settings);
  const dispatch = useAppDispatch();
  const [walletData, setWalletData] = useState(initialBalance);
  const [play, { stop }] = useSound("/assets/audio/background_audio.mp3", {
    volume: 0.25,
    loop: true,
  });

  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };

  const getSiteBalance = async () => {
    try {
      const response = await axiosGet(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/balance`
      );
      const walletDataRes = {
        usk: response?.balance?.usk ?? 0,
        kart: response?.balance?.kart ?? 0,
      };
      setWalletData(walletDataRes);
    } catch (error) {
      console.error("Failed to get balance:", error);
    }
  };

  useEffect(() => {
    if (userData?.username !== "") {
      getSiteBalance();
    }
  }, [siteBalance, getAccessToken()]);

  useEffect(() => {
    dispatch(subscribeUserServer());
  }, []);

  useEffect(() => {
    if (settings.isMusicPlay) {
      play();
    } else {
      stop();
    }
  }, [settings.isMusicPlay]);

  return (
    <div className="flex flex-1 items-center justify-between bg-dark bg-opacity-30 bg-blend-multiply">
      <Heading />
      <div className="flex flex-row gap-5">
        {userData?.username && (
          <div className="flex flex-row gap-5">
            {["usk", "kart"].map((token) => (
              <div key={token} className="flex flex-row items-center gap-2">
                <img src={`/assets/tokens/${token}.png`} className="h-7 w-7" />
                <span className="w-4/12 text-center text-gray-300">
                  {Number(
                    siteBalance?.denom === token
                      ? siteBalance.value
                      : walletData[token]
                  ).toFixed(2) ?? 0}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="ml-4 mr-8 flex items-center gap-3 md:ml-6">
          <ToggleButton />
          {getAccessToken() ? (
            <div className="flex flex-row items-center gap-4">
              <Button
                className="hidden bg-transparent px-0 hover:bg-transparent lg:block"
                onClick={() => setOpen(!open)}
              >
                <MessageSquareMore
                  className={`text-${open ? "purple" : "white"}`}
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
              <span className="uppercase">Log In</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
