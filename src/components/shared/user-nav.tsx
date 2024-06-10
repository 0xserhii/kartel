import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { removeAllTokens } from '@/lib/axios';
import { useWallet } from '@/provider/crypto/wallet';
import useToast from '@/hooks/use-toast';
import useModal from '@/hooks/use-modal';
import { usePersistStore } from '@/store/zustand/persist';
import { ModalType } from '@/types/modal';

export default function UserNav() {
  const modal = useModal();
  const toast = useToast();
  const userData = usePersistStore((store) => store.app.userData);
  const initUserData = usePersistStore((store) => store.actions.init);
  const { disconnect, account } = useWallet();

  const handleLogout = async () => {
    await initUserData();
    disconnect();
    removeAllTokens();
    toast.success('Logout Successfully');
  };

  const toggleWalletConnection = async () => {
    if (account) {
      disconnect();
      toast.success('Wallet Disconnected');
    } else {
      modal.open(ModalType.WALLETCONNECT);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 border-2 border-[#4a278da1] bg-transparent p-2 !outline-none !ring-0 !ring-offset-0 hover:bg-transparent"
        >
          <Avatar className="h-5 w-5">
            <AvatarImage src={'/assets/icons/gold-avatar.png'} alt={''} />
          </Avatar>
          <p className="text-white">{userData?.username}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-none bg-dark bg-opacity-90 text-gray50"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-lg leading-none text-white">
              {userData?.username}
            </p>
            <p className="text-xs leading-none text-white">
              {userData?.userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={toggleWalletConnection}>
            {account ? 'Disconnect Wallet' : 'Connect Wallet'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
