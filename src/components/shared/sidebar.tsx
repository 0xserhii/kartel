import { navItems } from "@/constants/data";
import DashboardNav from "./dashboard-nav";
import { Link } from "react-router-dom";
import Logo from "/assets/logo.png";
import Deposit from "/assets/deposit.png";
import { ScrollArea } from "../ui/scroll-area";
import useModal from "@/hooks/use-modal";
import { ModalType } from "@/types/modal";
import { useAppSelector } from "@/store/redux";
import useToast from "@/hooks/use-toast";
import { useWallet } from "@/provider/crypto/wallet";

export default function Sidebar() {
  const modal = useModal();
  const toast = useToast();
  const { account } = useWallet();
  const userData = useAppSelector((store: any) => store.user.userData);

  const handleDeposit = async () => {
    if (userData?.username === "") {
      toast.error("Please login to deposit");
      return;
    }
    if (!account?.address || account?.address === "") {
      modal.open(ModalType.WALLETCONNECT);
      return;
    }
    modal.open(ModalType.DEPOSIT);
  };

  return (
    <aside className="hidden h-screen w-72 flex-col items-center justify-between gap-2 overflow-x-hidden overflow-y-hidden bg-dark bg-opacity-70 bg-blend-multiply xl:flex">
      <ScrollArea className="h-screen w-full p-5">
        <div className="flex w-full flex-col items-center justify-between">
          <div className="flex w-full flex-col items-center gap-4">
            <Link to="/" className="pt-1">
              <img src={Logo} alt="Logo" className="h-32 w-32" />
            </Link>
            <DashboardNav items={navItems} />
          </div>
          <div className="mt-10 flex">
            <button
              className="flex justify-center items-center gap-2 rounded-lg bg-blue1 px-4 py-2 text-white"
              onClick={handleDeposit}
            >
              <img src={Deposit} className="w-10 h-10" />
              <span className="text-3xl text-gray50 font-secondary uppercase leading-normal tracking-wide">
                Deposit
              </span>
            </button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
