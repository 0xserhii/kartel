import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import useToast from '@/hooks/use-toast';
import { useWallet } from '@/provider/crypto/wallet';
import { fromHumanString, msg, toHuman } from 'kujira.js';
import AESWrapper from '@/lib/encryption/aes-wrapper';
import {
  TokenBalances,
  denoms,
  finance,
  initialBalance,
  token
} from '@/constants/data';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import LoadingIcon from '../loading-icon';
import { axiosGet, axiosPost } from '@/utils/axios';
import { userActions } from '@/store/redux/actions';

type TWalletData = {
  usk: number;
  kart: number;
}

const DepositModal = () => {
  const modal = useModal();
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state: any) => state.modal);
  const isOpen = modalState.open && modalState.type === ModalType.DEPOSIT;
  const toast = useToast();
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [walletData, setWalletData] = useState<TokenBalances>(initialBalance);
  const [selectedFinance, setSelectedFinance] = useState('Deposit');

  const [loading, setLoading] = useState(false);

  const aesWrapper = AESWrapper.getInstance();

  const { signAndBroadcast, account, balances, refreshBalances } = useWallet();

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
        await withdrawBalance();
        refreshBalances();
      } catch (err) {
        console.log(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeposit = async () => {
    const encryptedAddressRes: any = (
      await axiosGet(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/admin-wallet`
      )
    );

    const walletAddress = await aesWrapper.decryptMessage(
      encryptedAddressRes.aesKey,
      encryptedAddressRes.encryptedAddress
    );
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
        const kujiraBalance = balances.filter(item => item.denom === denoms.usk)?.[0]?.amount ?? 0;
        if (Number(toHuman(BigNumber.from(kujiraBalance), 6)).valueOf() < 0.00055) {
          toast.error(`Insufficient Kujira balance for Fee`);
          return;
        }
        const hashTx = await signAndBroadcast(
          [
            msg.bank.msgSend({
              fromAddress: account?.address,
              toAddress: walletAddress,
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
        console.log({ hashTx })
        await updateBalance(hashTx.transactionHash);
        refreshBalances();
      } catch (err) {
        console.warn("tx_error", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateBalance = async (txHash?: string) => {
    try {
      const response = await axiosPost([
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/deposit`,
        {
          data: {
            currency: selectedToken.name,
            amount: Number(depositAmount),
            txHash,
            address: account?.address
          }
        }
      ]);
      if (response.status === "success") {
        const walletDataRes: TWalletData = {
          usk: response.data?.usk ?? 0,
          kart: response.data?.kart ?? 0
        }
        setWalletData(walletDataRes);
        dispatch(userActions.siteBalanceUpdate({
          value: walletDataRes.usk,
          denom: denoms.usk
        }));
        dispatch(userActions.siteBalanceUpdate({
          value: walletDataRes.kart,
          denom: denoms.kart
        }));
        toast.success(`Deposit Successful`);
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const withdrawBalance = async () => {
    try {
      const response = await axiosPost([
        `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/withdraw`,
        {
          data: {
            currency: selectedToken.name,
            amount: Number(depositAmount),
            address: account?.address
          }
        }
      ]);
      if (response.status === "success") {
        const walletDataRes: TWalletData = {
          usk: response.data?.usk ?? 0,
          kart: response.data?.kart ?? 0
        }
        setWalletData(walletDataRes);
        dispatch(userActions.siteBalanceUpdate({
          value: walletDataRes.usk,
          denom: denoms.usk
        }));
        dispatch(userActions.siteBalanceUpdate({
          value: walletDataRes.kart,
          denom: denoms.kart
        }));
        toast.success(`Withdraw Successful`);
      }
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const getSiteBalance = async () => {
    try {
      const response = await axiosGet(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/balance`,)
      const walletDataRes = {
        usk: response?.balance?.usk ?? 0,
        kart: response?.balance?.kart ?? 0
      }
      setWalletData(walletDataRes);
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getSiteBalance();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-6 rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-sm">
        <DialogHeader className="flex flex-row mb-[-25px]">
          <div className="flex w-full flex-row items-center justify-center">
            <img src="/assets/logo.png" className="h-32 w-36" />
          </div>
        </DialogHeader>
        <div className="flex flex-row items-center justify-center gap-5">
          {finance.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedFinance(item)}
              className={`${selectedFinance === item ? ' border-white' : 'border-transparent'} border-b-2 p-2 text-white transition-all duration-300 ease-out`}
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
          {selectedFinance === 'Withdraw' && (
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
            selectedFinance === 'Withdraw' ? handleWithdraw : handleDeposit
          }
          disabled={loading}
        >
          {selectedFinance}
          {loading && <LoadingIcon />}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
