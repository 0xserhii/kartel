import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useRootStore from '@/store/zustand/root';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { Input } from '@/components/ui/input';
import { BigNumber } from '@ethersproject/bignumber';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePersistStore } from '@/store/zustand/persist';
import useToast from '@/hooks/use-toast';
import { useWallet } from '@/provider/crypto/wallet';
import { fromHumanString, msg, toHuman } from 'kujira.js';
import { token } from '@/constants/data';

interface TokenBalances {
  usk: number;
  kuji: number;
}

const financial = ['Deposit', 'Withdraw'];
const walletList = { kuji: 0, usk: 0 };

const denoms = {
  kuji: 'ukuji',
  usk: 'factory/kujira1sr9xfmzc8yy5gz00epspscxl0zu7ny02gv94rx/kartelUSk'
};

const SmallLoading = (
  <div className="small-loading">
    <svg viewBox="10 10 20 20">
      <circle r="7" cy="20" cx="20"></circle>
    </svg>
  </div>
);

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
  const [selectedFinancial, setSelectedFinancial] = useState('Deposit');

  const [loading, setLoading] = useState(false);

  const {
    signAndBroadcast,
    account,
    balances,
    broadcastWithPK,
    refreshBalances
  } = useWallet();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.DEPOSIT);
    }
  };

  const handleBetAmountChange = (event) => {
    const inputValue = event.target.value;
    setDepositAmount(inputValue);
  };

  const handleWithdraw = async () => {
    if (Number(depositAmount) > Number(walletData[selectedToken.name] ?? 0)) {
      toast.error(`Insufficient token`);
      return;
    }
    if (account) {
      try {
        setLoading(true);
        await broadcastWithPK(
          [
            msg.bank.msgSend({
              fromAddress: 'kujira158m5u3na7d6ksr07a6yctphjjrhdcuxu0wmy2h',
              toAddress: account.address,
              amount: [
                {
                  denom: selectedToken.denom,
                  amount: fromHumanString(depositAmount, 6).toString()
                }
              ]
            })
          ],
          'Withdraw from Kartel'
        );
        refreshBalances();
        await updateBalance('withdraw');
      } catch (err) {
        console.log(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateBalance = async (type: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/users/${userData._id}/balance`,
        {
          balanceType: selectedToken.name,
          actionType: type,
          amount: Number(depositAmount)
        }
      );
      if (response.status === 200) {
        setWalletData(response.data?.responseObject.wallet);
        if (type === 'deposit') {
          toast.success(`Deposit Successful`);
        } else if (type === 'withdraw') {
          toast.success(`Withdraw Successful`);
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

  const handleDeposit = async () => {
    if (
      Number(depositAmount) >
      Number(
        toHuman(
          BigNumber.from(
            balances.find((item) => item.denom === selectedToken.denom)
              ?.amount ?? 0
          ),
          6
        )
      )
    ) {
      toast.error(`Insufficient token in wallet`);
      return;
    }
    if (account) {
      try {
        setLoading(true);
        await signAndBroadcast(
          [
            msg.bank.msgSend({
              fromAddress: account?.address,
              toAddress: 'kujira158m5u3na7d6ksr07a6yctphjjrhdcuxu0wmy2h',
              amount: [
                {
                  denom: selectedToken.denom,
                  amount: fromHumanString(depositAmount, 6).toString()
                }
              ]
            })
          ],
          'Deposit to Kartel'
        );
        refreshBalances();
        await updateBalance('deposit');
      } catch (err) {
        console.log(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-5 rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-sm">
        <DialogHeader className="flex flex-row">
          <div className="flex w-full flex-row items-center justify-center">
            <img src="/assets/logo.svg" className="h-24 w-24" />
          </div>
        </DialogHeader>
        <div className="flex flex-row items-center justify-center gap-5">
          {financial.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedFinancial(item)}
              className={`${selectedFinancial === item ? ' border-white' : 'border-transparent'} border-b-2 p-2 text-white transition-all duration-300 ease-out`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex w-full flex-col justify-between gap-3">
          <div className="flex w-full flex-row items-center justify-between">
            <span className="w-4/12 pl-3 text-start text-xs text-gray-500">
              Assets
            </span>
            <span className="w-4/12 text-center text-xs text-gray-500">
              Site Balance
            </span>
            <span className="w-4/12 text-center text-xs text-gray-500">
              Wallet Balance
            </span>
          </div>
          {walletData &&
            Object.entries(walletData).map(([tokenName, balance], index) => (
              <div
                key={index}
                className="flex w-full flex-row items-center justify-between"
              >
                <span className="flex w-4/12 flex-row items-center gap-3 uppercase text-gray-300">
                  <img
                    src={`/assets/tokens/${tokenName}.png`}
                    className="h-5 w-5"
                  />
                  {tokenName}
                </span>
                <span className="w-4/12 text-center text-gray-300">
                  {Number(balance).toFixed(2) ?? 0}
                </span>
                <span className="w-4/12 text-center text-white">
                  {toHuman(
                    BigNumber.from(
                      balances.find((item) => item.denom === denoms[tokenName])
                        ?.amount ?? 0
                    ),
                    6
                  ).toFixed(2)}
                </span>
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-white">Token Amount</span>
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
          {selectedFinancial === 'Withdraw' && (
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-xs text-white">Wallet Address</span>
              <Input
                value={account?.address}
                type="text"
                onChange={() => { }}
                placeholder="e.g. kujira158m5u3na7d6ksr07a6yctphjjrhdcuxu0wmy2h"
                className="border border-purple-0.5 text-white placeholder:text-gray-700"
              />
            </div>
          )}
        </div>
        <Button
          className="w-full gap-2 bg-purple py-5 hover:bg-purple"
          type="submit"
          onClick={
            selectedFinancial === 'Withdraw' ? handleWithdraw : handleDeposit
          }
          disabled={loading}
        >
          {selectedFinancial}
          {loading && SmallLoading}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
