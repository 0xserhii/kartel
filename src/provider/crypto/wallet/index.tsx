import { AccountData, EncodeObject } from "@cosmjs/proto-signing";
import {
  Coin,
  DeliverTxResponse,
  assertIsDeliverTxSuccess,
} from "@cosmjs/stargate";
import { ChainInfo } from "@keplr-wallet/types";
import { DelegationResponse } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import { Any } from "cosmjs-types/google/protobuf/any";
import { BigNumber } from "ethers";
import {
  AuthnWebSigner,
  CHAIN_INFO,
  Denom,
  Keplr,
  Leap,
  LeapSnap,
  NETWORK,
  ReadOnly,
  Sonar,
  Station,
  Xfi,
} from "kujira.js";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { PageRequest } from "cosmjs-types/cosmos/base/query/v1beta1/pagination";
import { WalletI } from "kujira.js/lib/cjs/wallets/interface";
import { useNetwork } from "../network";
import { usePasskeys } from "../passkey";
import { Passkey } from "./passkey-class";
import { useLocalStorage } from "@/hooks";
import SonarModal from "@/components/shared/modal/sonar-modal";
import { QR } from "react-qr-rounded";
import { IconAngleRight, IconSonar } from "@/components/icons";
import { Link } from "react-router-dom";

export enum Adapter {
  Sonar = "sonar",
  Passkey = "passkey",
  ReadOnly = "readOnly",
  Keplr = "keplr",
  Station = "station",
  Leap = "leap",
  LeapSnap = "leapSnap",
  Xfi = "xfi",
  DaoDao = "daodao",
}

export type IWallet = {
  connect: (adapter: Adapter, chain?: NETWORK) => Promise<void>;
  disconnect: () => void;
  account: (AccountData & { label?: string }) | null;
  kujiraAccount: Any | null;
  balances: Coin[];
  getBalance: (denom: Denom, refresh?: boolean) => Promise<BigNumber | null>;
  balance: (denom: Denom) => BigNumber;
  signAndBroadcast: (
    msgs: EncodeObject[],
    memo?: string
  ) => Promise<DeliverTxResponse>;
  delegations: null | DelegationResponse[];
  refreshBalances: () => void;
  refreshDelegations: () => void;
  feeDenom: string;
  setFeeDenom: (denom: string) => void;
  chainInfo: ChainInfo;
  adapter: null | Adapter;
  signer: AuthnWebSigner | undefined;
};

const Context = createContext<IWallet>({
  account: null,
  getBalance: async () => BigNumber.from(0),
  balance: () => BigNumber.from(0),
  connect: async () => { },
  disconnect: () => { },
  kujiraAccount: null,
  balances: [],
  signAndBroadcast: async () => {
    throw new Error("Not Implemented");
  },
  delegations: null,
  refreshBalances: () => { },
  refreshDelegations: () => { },
  feeDenom: "ukuji",
  setFeeDenom: () => { },
  chainInfo: {} as ChainInfo,
  adapter: null,
  signer: undefined,
});

const toAdapter = (wallet: any) => {
  return wallet instanceof Keplr
    ? Adapter.Keplr
    : wallet instanceof Leap
      ? Adapter.Leap
      : wallet instanceof LeapSnap
        ? Adapter.LeapSnap
        : wallet instanceof Xfi
          ? Adapter.Xfi
          : wallet instanceof Sonar
            ? Adapter.Sonar
            : wallet instanceof Passkey
              ? Adapter.Passkey
              : wallet instanceof Station
                ? Adapter.Station
                : wallet instanceof ReadOnly
                  ? Adapter.ReadOnly
                  : null;
};

export const WalletContext: FC<PropsWithChildren> = ({ children }) => {
  const [stored, setStored] = useLocalStorage("wallet", "");
  const [wallet, setWallet] = useState<WalletI | null>(null);
  const { signer, selectSigner } = usePasskeys();

  const adapter = toAdapter(wallet);

  const [feeDenom, setFeeDenom] = useLocalStorage("feeDenom", "ukuji");
  const [balances, setBalances] = useState<Record<string, BigNumber>>({});
  const [modal, setModal] = useState(false);
  const [link, setLink] = useState("");
  const [kujiraBalances, setKujiraBalances] = useState<Coin[]>([]);

  const [{ network, chainInfo, query, rpc }] = useNetwork();

  const [kujiraAccount, setKujiraAccount] = useState<null | Any>(null);

  const [delegations, setDelegations] = useState<null | DelegationResponse[]>(
    null
  );

  useEffect(() => {
    stored && connect(stored, network, true);
  }, []);

  useEffect(() => {
    wallet && connect(stored, network);
  }, [network]);

  const refreshBalances = () => {
    if (!wallet) return;
    query?.bank
      .allBalances(
        wallet.account.address,
        PageRequest.fromPartial({ limit: BigInt(300) })
      )
      .then((x) => {
        x && setKujiraBalances(x);
        x?.map((b) => {
          setBalances((prev) =>
            b.denom
              ? {
                ...prev,
                [b.denom]: BigNumber.from(b.amount),
              }
              : prev
          );
        });
      });
  };

  useEffect(() => {
    setKujiraBalances([]);
    setBalances({});
    refreshBalances();
    wallet &&
      query?.auth
        .account(wallet.account.address)
        .then((account) => account && setKujiraAccount(account));
    wallet && wallet.onChange(setWallet);
  }, [wallet, query]);

  const refreshDelegations = () => {
    if (!wallet) return;
    setDelegations(null);
    query?.staking
      .delegatorDelegations(wallet.account.address)
      .then(
        ({ delegationResponses }) =>
          delegationResponses && setDelegations(delegationResponses)
      );
  };

  const balance = (denom: Denom): BigNumber =>
    balances[denom.reference] || BigNumber.from(0);

  const fetchBalance = async (denom: Denom): Promise<BigNumber> => {
    if (!wallet) return BigNumber.from(0);
    if (!query) return BigNumber.from(0);
    return query.bank
      .balance(wallet.account.address, denom.reference)
      .then((resp) => BigNumber.from(resp?.amount || 0))
      .then((balance) => {
        setBalances((prev) => ({
          ...prev,
          [denom.reference]: balance,
        }));
        return balance;
      });
  };

  const getBalance = async (denom: Denom, refresh = true) =>
    balances[denom.reference] || refresh
      ? fetchBalance(denom)
      : BigNumber.from(0);

  const signAndBroadcast = async (
    rpc: string,
    msgs: EncodeObject[],
    memo?: string
  ): Promise<DeliverTxResponse> => {
    if (!wallet) throw new Error("No Wallet Connected");
    const res = await wallet.signAndBroadcast(rpc, msgs, feeDenom, memo);
    assertIsDeliverTxSuccess(res);
    return res;
  };

  const sonarRequest = (uri: string) => {
    setLink(uri);
    setModal(true);
  };

  const connect = async (adapter: Adapter, chain?: NETWORK, auto?: boolean) => {
    const chainInfo: ChainInfo = {
      ...CHAIN_INFO[chain || network],
    };

    let connectedWalletAddress: any = null;

    switch (adapter) {
      case Adapter.Passkey:
        if (!signer) {
          console.error("No Signer Available");
          return;
        }
        Passkey.connect({ ...chainInfo, rpc }, signer)
          .then((passkey) => {
            setStored(adapter);
            setWallet(passkey);
          })
          .catch((err) => {
            setStored("");
            console.error(err.message);
          });
        break;
      case Adapter.Keplr:
        connectedWalletAddress = await Keplr.connect(
          { ...chainInfo, rpc },
          { feeDenom }
        );
        setStored(adapter);
        setWallet(connectedWalletAddress);
        break;

      case Adapter.Leap:
        connectedWalletAddress = await Leap.connect(
          { ...chainInfo, rpc },
          { feeDenom }
        );
        setStored(adapter);
        setWallet(connectedWalletAddress);
        break;

      case Adapter.LeapSnap:
        LeapSnap.connect({ ...chainInfo, rpc }, { feeDenom })
          .then((x) => {
            setStored(adapter);
            setWallet(x);
          })
          .catch((err) => {
            setStored("");
            console.error(err.message);
          });

        break;

      case Adapter.Xfi:
        Xfi.connect({ ...chainInfo, rpc }, { feeDenom })
          .then((x) => {
            setStored(adapter);
            setWallet(x);
          })
          .catch((err) => {
            setStored("");
            console.error(err.message);
          });

        break;

      case Adapter.Sonar:
        Sonar.connect(network, {
          request: sonarRequest,
          auto: !!auto,
        }).then((x) => {
          setStored(adapter);
          setWallet(x);
        });
        break;
      case Adapter.Station:
        connectedWalletAddress = await Station.connect(chainInfo);
        setStored(adapter);
        setWallet(connectedWalletAddress);
        break;
      case Adapter.ReadOnly:
        break;
    }
  };

  const disconnect = () => {
    stored === Adapter.Passkey && selectSigner("");
    setStored("");
    setWallet(null);
    wallet?.disconnect();
  };
  const value: IWallet = {
    adapter,
    account: wallet?.account || null,
    delegations,
    connect,
    disconnect,
    kujiraAccount,
    balances: kujiraBalances,
    getBalance,
    balance,
    signAndBroadcast: (msgs, memo) => signAndBroadcast(rpc, msgs, memo),
    refreshBalances,
    refreshDelegations,
    feeDenom,
    setFeeDenom,
    chainInfo,
    signer,
  };
  return (
    <Context.Provider key={network + wallet?.account.address} value={value}>
      {children}
      <SonarModal
        open={modal}
        setOpen={setModal}
        close={() => {
          setStored("");
          setModal(false);
        }}
      >
        <div className="flex items-center justify-center">
          <QR
            height={230}
            width={230}
            color="#000"
            backgroundColor="transparent"
            rounding={50}
            errorCorrectionLevel="M">
            {link}
          </QR>
        </div>
        <div className="flex flex-col">
          <IconSonar
            className="h-32 w-56 text-primary/50"
          />
          <h3 className="text-start text-lg">Scan this code using the Sonar Mobile App.</h3>
          <Link
            to="https://sonar.kujira.network"
            target="_blank"
            className="mt-2 flex w-fit items-center gap-x-2 rounded-sm bg-[#D1F5FC] px-4 py-2 outline-none">
            <span>Download Sonar</span>
            <IconAngleRight className="w-3" />
          </Link>
        </div>
      </SonarModal>
    </Context.Provider>
  );
};

export function useWallet() {
  return useContext(Context);
}
