import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useRootStore from '@/store/root';
import { ModalType } from '@/types/modal';
import useModal from '@/routes/hooks/use-modal';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { token } from '@/section/games/crash';
import axios from 'axios';
import { usePersistStore } from '@/store/persist';
import useToast from '@/routes/hooks/use-toast';

interface TokenBalances {
  usk: number;
  kuji: number;
}

const walletList = { kuji: 0, usk: 0 };

const DepositModal = () => {
  const modal = useModal();
  const userData = usePersistStore((store) => store.app.userData);
  const toast = useToast();
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [openModal, type] = useRootStore((store) => [
    store.state.modal.open,
    store.state.modal.type
  ]);
  const [walletData, setWalletData] = useState<TokenBalances>(walletList);
  const isOpen = openModal && type === ModalType.DEPOSIT;

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.DEPOSIT);
    }
  };

  const handleBetAmountChange = (event) => {
    const inputValue = event.target.value;
    setDepositAmount(inputValue);
  };

  const updateBalance = async (type: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/users/${userData._id}/balance`,
        {
          balanceType: selectedToken.name,
          actionType: 'deposit',
          amount: Number(depositAmount)
        }
      );
      if (response.status === 200) {
        setWalletData(response.data?.responseObject.wallet);
        if (type === 'update') {
          toast.success(`Deposit Successful`);
        }
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateBalance('get');
    }
  }, [isOpen]);

  const handleDeposit = () => {
    updateBalance('update');
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-6 rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-sm">
        <DialogHeader className="flex flex-row">
          <div className="flex w-full flex-row items-center justify-center">
            <img src="/assets/logo.svg" className="h-24 w-24" />
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {walletData &&
              Object.entries(walletData).map(([tokenName, balance], index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between"
                >
                  <span className="flex flex-row items-center gap-3 uppercase text-gray-300">
                    <img
                      src={`/assets/tokens/${tokenName}.png`}
                      className="h-5 w-5"
                    />
                    {tokenName}
                  </span>
                  <span className="text-gray-300">{balance ?? 0}</span>
                </div>
              ))}
          </div>
          <div className="relative">
            <Input
              value={depositAmount}
              onChange={handleBetAmountChange}
              type="number"
              className="border border-purple-0.5 text-white placeholder:text-gray-700"
            />
            <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-2 uppercase">
                    <img src={selectedToken.src} className="h-4 w-4" />
                    {selectedToken.name}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-12 border-purple-0.5 bg-[#0D0B32CC]">
                  <DropdownMenuRadioGroup
                    value={selectedToken.name}
                    onValueChange={(value) => {
                      const newToken = token.find((t) => t.name === value);
                      if (newToken) {
                        setSelectedToken(newToken);
                      }
                    }}
                  >
                    {token.map((t, index) => (
                      <DropdownMenuRadioItem
                        key={index}
                        value={t.name}
                        className="gap-5 uppercase text-white hover:bg-transparent"
                      >
                        <img src={t.src} className="h-4 w-4" />
                        {t.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
        <Button
          className="w-full bg-[#A326D4] py-5 hover:bg-[#A326D4]"
          type="submit"
          onClick={handleDeposit}
        >
          Deposit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
