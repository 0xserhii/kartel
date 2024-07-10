import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import { Input } from "@/components/ui/input";
import { BigNumber } from "@ethersproject/bignumber";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import useToast from "@/hooks/use-toast";
import { Adapter, useWallet } from "@/provider/crypto/wallet";
import { fromHumanString, msg, toHuman } from "kujira.js";
import AESWrapper from "@/lib/encryption/aes-wrapper";
import {
  TokenBalances,
  denoms,
  finance,
  initialBalance,
  token,
} from "@/constants/data";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import LoadingIcon from "../loading-icon";
import { axiosGet } from "@/utils/axios";
import { paymentActions } from "@/store/redux/actions";
import { StdSignature } from "@keplr-wallet/types";

const DepositModal = () => {
  const modal = useModal();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const modalState = useAppSelector((state) => state.modal);
  const paymentState = useAppSelector((state) => state.payment);
  const isOpen = modalState.open && modalState.type === ModalType.DEPOSIT;
  const toast = useToast();
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [walletData, setWalletData] = useState<TokenBalances>(initialBalance);
  const [selectedFinance, setSelectedFinance] = useState("Deposit");

  const aesWrapper = AESWrapper.getInstance();
  const {
    signAndBroadcast,
    account,
    balances,
    refreshBalances,
    adapter,
    chainInfo,
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
      dispatch(paymentActions.paymentFailed("Insufficient token"));
      return;
    }
    dispatch(paymentActions.setTxProgress(true));
    dispatch(paymentActions.paymentFailed(""));
    if (account) {
      try {
        const withdrawParam = {
          currency: selectedToken.name,
          amount: Number(depositAmount),
          address: account?.address,
        };
        const encryptedParam = await aesWrapper.encryptMessage(
          paymentState.admin.address1,
          JSON.stringify(withdrawParam)
        );
        dispatch(paymentActions.withDraw(encryptedParam));
      } catch (err) {
        dispatch(paymentActions.paymentFailed("Withdraw rejected"));
        console.log(err);
      }
    }
  };

  const handleDeposit = async () => {
    try {
      dispatch(paymentActions.paymentFailed(""));
      dispatch(paymentActions.setTxProgress(true));

      const walletAddress = await aesWrapper.decryptMessage(
        paymentState.admin.address1,
        paymentState.admin.address2
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
        dispatch(paymentActions.paymentFailed("Insufficient token in wallet"));
        dispatch(paymentActions.setTxProgress(false));
        return;
      }
      if (account) {
        try {
          const kujiraBalance =
            balances.filter((item) => item.denom === denoms.kuji)?.[0]?.amount ??
            0;
          if (
            Number(toHuman(BigNumber.from(kujiraBalance), 6)).valueOf() <
            0.00055
          ) {
            dispatch(
              paymentActions.paymentFailed(
                "Insufficient KUJI balance for Fee"
              )
            );
            return;
          }


          let signedTx: StdSignature | undefined = undefined;
          if (adapter === Adapter.Keplr) {
            const chainId = chainInfo.chainId;
            const signed = await window.keplr?.signArbitrary(
              chainId,
              account?.address ?? "",
              `Deposit ${selectedToken.name} ${depositAmount} to Kartel`
            );
            if (signed) {
              signedTx = signed;
            }
          } else if (adapter === Adapter.Leap) {
            const chainId = chainInfo.chainId;
            const signed = await window.leap?.signArbitrary(
              chainId,
              account?.address ?? "",
              `Deposit ${selectedToken.name} ${depositAmount} to Kartel`
            );
            if (signed) {
              signedTx = signed;
            }
          }
          if (!signedTx) {
            dispatch(paymentActions.paymentFailed("Reject deposit"));
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
                    amount: fromHumanString(depositAmount, 6).toString(),
                  },
                ],
              }),
            ],
            "Deposit to Kartel"
          );
          const depositParam = {
            currency: selectedToken.name,
            amount: Number(depositAmount),
            txHash: hashTx.transactionHash,
            address: account?.address,
            signedTx,
          };
          const encryptedData = await aesWrapper.encryptMessage(
            paymentState.admin.address1,
            JSON.stringify(depositParam)
          );
          dispatch(paymentActions.deposit(encryptedData));
        } catch (err) {
          dispatch(paymentActions.paymentFailed("Reject deposit"));
          console.warn("tx_error", err);
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(paymentActions.paymentFailed("Reject deposit"));
    }
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
    refreshBalances();
  }, [paymentState.txProgress]);

  useEffect(() => {
    if (isOpen) {
      getSiteBalance();
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentState.error === "Withdraw Success") {
      toast.success("Withdraw Success");
    } else if (paymentState.error === "Deposit Success") {
      toast.success("Deposit Success");
    } else if (paymentState.error !== "") {
      toast.error(paymentState.error);
    }
  }, [paymentState.error]);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="gap-6 rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-sm">
        <DialogHeader className="mb-[-25px] flex flex-row">
          <div className="flex w-full flex-row items-center justify-center">
            <img src="/assets/logo.png" className="h-32 w-36" />
          </div>
        </DialogHeader>
        <div className="flex flex-row items-center justify-center gap-5">
          {finance.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedFinance(item)}
              className={`${selectedFinance === item ? " border-white" : "border-transparent"} border-b-2 p-2 text-white transition-all duration-300 ease-out`}
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
            Object.entries(walletData).map(([tokenName], index) => (
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
                  {Number(
                    userState?.wallet?.denom === tokenName
                      ? userState?.wallet?.value
                      : walletData[tokenName]
                  ).toFixed(2) ?? 0}
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
          {selectedFinance === "Withdraw" && (
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
            selectedFinance === "Withdraw" ? handleWithdraw : handleDeposit
          }
          disabled={paymentState.txProgress}
        >
          {selectedFinance}
          {paymentState.txProgress && <LoadingIcon />}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
