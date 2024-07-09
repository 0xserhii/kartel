import Deposit from "/assets/deposit-icon.svg";
import DashboardNav from "@/components/shared/dashboard-nav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { navItems } from "@/constants/data";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import Logo from "/assets/logo.png";
import { ModalType } from "@/types/modal";
import { useAppSelector } from "@/store/redux";
import { useWallet } from "@/provider/crypto/wallet";
import useModal from "@/hooks/use-modal";
import useToast from "@/hooks/use-toast";

type TMobileSidebarProps = {
  className?: string;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
};
export default function MobileSidebar({
  setSidebarOpen,
  sidebarOpen,
}: TMobileSidebarProps) {
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
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 border-none bg-dark !px-0 flex flex-col items-center">
          <div className="flex w-full flex-col items-center gap-8 px-5">
            <Link to="/" className="py-2 text-2xl font-bold text-white ">
              <img src={Logo} alt="Logo" className="h-32 w-36" />
            </Link>
            <div className="w-full space-y-1 px-2">
              <DashboardNav items={navItems} setOpen={setSidebarOpen} />
            </div>
          </div>
          <div className="mt-2 flex">
            <button
              className="flex items-center gap-2 rounded-lg bg-blue1 px-5 py-3 text-white"
              onClick={handleDeposit}
            >
              <img src={Deposit} />
              <div className="flex flex-col items-stretch gap-1">
                <span className="text-base font-semibold text-gray50">
                  Deposit Now
                </span>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
