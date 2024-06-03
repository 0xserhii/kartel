import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import CrashBoard from './car-board';
import { Socket, io } from 'socket.io-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { BetType, FormattedPlayerBetType } from '@/types';
import { ICrashClientToServerEvents, ICrashServerToClientEvents } from '@/types/crash';
import { ECrashStatus } from '@/constants/status';
import { getAccessToken } from '@/lib/axios';
import useToast from '@/routes/hooks/use-toast';
import BetBoard from './bet-board';
import { multiplerArray, betMode, roundArray } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';

export interface IToken {
  name: string;
  src: string;
  denom: string;
}

export const token: Array<IToken> = [
  { name: 'kuji', src: '/assets/tokens/kuji.png', denom: 'ukuji' },
  {
    name: 'usk',
    src: '/assets/tokens/usk.png',
    denom: 'factory/kujira1sr9xfmzc8yy5gz00epspscxl0zu7ny02gv94rx/kartelUSk'
  }
];

export default function CrashGameSection() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const toast = useToast();
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [betData, setBetData] = useState<BetType[]>([]);
  const [betAmount, setBetAmount] = useState(0);
  const [autoCashoutPoint, setAutoCashoutPoint] = useState(1.05);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [betCashout, setBetCashout] = useState<BetType[]>([]);
  const [avaliableBet, setAvaliableBet] = useState(false);
  const [autoBet, setAutoBet] = useState(true);
  const [autoCashoutAmount, setAutoCashoutAmount] = useState(1);
  const [crashStatus, setCrashStatus] = useState<ECrashStatus>(
    ECrashStatus.PREPARE
  );
  const [totalAmount, setTotalAmount] = useState<any>();
  const [round, setRound] = useState(roundArray[0]);
  const [selectMode, setSelectMode] = useState(betMode[0]);
  const [avaliableAutoCashout, setAvaliableAutoCashout] = useState<boolean>(false);
  const isAutoMode = selectMode === 'auto';

  const handleBetAmountChange = (event) => {
    const inputValue = event.target.value;
    const reqTest = new RegExp(`^\\d*\\.?\\d{0,2}$`);
    if (reqTest.test(inputValue) && inputValue !== '') {
      const updateValue =
        parseFloat(inputValue) >= 1
          ? inputValue.replace(/^0+/, '')
          : inputValue;
      setBetAmount(updateValue);
    } else if (inputValue === '') {
      setBetAmount(0);
    }
  };

  const handleAutoCashoutPointChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue === '') {
      setAutoCashoutPoint(0);
    } else setAutoCashoutPoint(inputValue);
  };

  const handleMultiplierClick = (multiplier) => {
    const newValue = betAmount * multiplier;
    setBetAmount(newValue);
  };

  const handleStartBet = async () => {
    if (betAmount > 0 && !avaliableBet) {
      const joinParams = {
        target: 100000,
        betAmount: Number(betAmount).valueOf(),
        denom: selectedToken.name
      };
      socket?.emit('join-crash-game', joinParams);
    }
    if (avaliableBet) {
      setAvaliableBet(false);
      socket?.emit('bet-cashout');
    }
  };

  const handleAutoBet = async () => {
    if (autoBet) {
      if (betAmount > 0) {
        const joinParams = {
          cashoutPoint: Number(autoCashoutPoint).valueOf() * 100,
          count: Number(round).valueOf(),
          betAmount: Number(betAmount).valueOf(),
          denom: selectedToken.name
        };
        socket?.emit('auto-crashgame-bet', joinParams);
      } else {
        setAutoBet(false);
      }
    } else {
      setAutoBet(true);
      socket?.emit('cancel-auto-bet');
    }
  };

  useEffect(() => {
    const handleJoinSuccess = (data) => {
      toast.success(data);
      console.log(data)
      if (data === "Autobet has been canceled. This will be applied on next bet.") {
        setAutoBet(true);
      } else {
        setAutoBet(false);
      }
    };
    socket?.on('auto-crashgame-join-success', handleJoinSuccess);
    return () => {
      socket?.off('auto-crashgame-join-success', handleJoinSuccess);
    }
  }, [socket, toast]);

  useEffect(() => {
    const crashSocket: Socket<
      ICrashServerToClientEvents,
      ICrashClientToServerEvents
    > = io(`${SERVER_URL}/crash`);

    crashSocket.on('game-bets', (bets: FormattedPlayerBetType[]) => {
      setBetData((prev: BetType[]) => [...bets, ...prev]);

      const totalUsk = bets
        .filter((bet) => bet.denom === 'usk')
        .reduce((acc, item) => acc + item.betAmount, 0);

      const totalKuji = bets
        .filter((bet) => bet.denom === 'kuji')
        .reduce((acc, item) => acc + item.betAmount, 0);

      setTotalAmount((prevAmounts) => ({
        usk: (prevAmounts?.usk || 0) + totalUsk,
        kuji: (prevAmounts?.kuji || 0) + totalKuji
      }));
    });

    crashSocket.on('game-tick', (tick) => {
      setCrashStatus(ECrashStatus.PROGRESS);
    });

    crashSocket.on('game-starting', (data) => {
      setCrashStatus(ECrashStatus.PREPARE);
      setBetData([]);
      setBetCashout([]);
      setTotalAmount({
        usk: 0,
        kuji: 0
      });
    });

    crashSocket.on('game-join-error', (data) => {
      toast.error(data);
    });

    crashSocket.on('game-start', (data) => {
      setCrashStatus(ECrashStatus.PROGRESS);
    });

    crashSocket.on('game-end', (data) => {
      setCrashStatus(ECrashStatus.END);
      setAvaliableBet(false);
    });

    crashSocket.on('crashgame-join-success', (data) => {
      setAvaliableBet(true);
    });

    crashSocket.on('bet-cashout', (data) => {
      setBetCashout((prev) => [...prev, data?.userdata]);
    });

    crashSocket.emit('auth', getAccessToken());

    setSocket(crashSocket);
    return () => {
      crashSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('auth', getAccessToken());
    }
  }, [getAccessToken()]);

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex flex-col items-stretch gap-8">
        <div className="flex flex-col items-stretch gap-6">
          <div className="flex h-full w-full flex-row justify-between gap-6">
            <div className="w-full">
              <CrashBoard />
              <div className="flex w-full flex-col gap-7 p-8 md:flex-row">
                <div className="flex h-full w-full flex-col gap-5 md:w-5/12">
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-lg uppercase text-gray-400">
                      bet mode
                    </span>
                    <div className="flex flex-row items-center gap-3">
                      {betMode.map((item, index) => (
                        <Button
                          className={cn(
                            'min-h-full rounded-lg border border-[#1D1776] bg-[#151245] px-6 py-5 font-semibold uppercase text-gray500 hover:bg-[#151245] hover:text-white',
                            selectMode === item &&
                            'border-[#A326D4] bg-[#A326D4] text-white hover:bg-[#A326D4]'
                          )}
                          key={index}
                          onClick={() => setSelectMode(item)}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Card className=" border-purple-0.15  bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">
                    <div className="flex h-full w-full flex-col gap-2 rounded-lg bg-[#0D0B32CC] px-8 py-5">
                      <div className='flex flex-row items-center justify-end'>
                        <Button
                          className="h-12 bg-[#A326D4] py-3 px-3 w-6/12 uppercase hover:bg-[#A326D4]"
                          disabled={
                            isAutoMode ? false : (
                              (crashStatus !== ECrashStatus.PREPARE &&
                                !avaliableBet) ||
                              (crashStatus !== ECrashStatus.PROGRESS &&
                                avaliableBet))
                          }
                          onClick={isAutoMode ? handleAutoBet : handleStartBet}
                        >
                          {isAutoMode
                            ? autoBet
                              ? 'Auto Bet'
                              : 'Cancel'
                            : avaliableBet
                              ? 'Cash Out'
                              : 'Place Bet'}
                        </Button>
                      </div>
                      <div className="flex flex-col gap-4">
                        <p className="text-sm uppercase text-[#556987] w-6/12">
                          bet amount
                        </p>
                        <div className="relative">
                          <Input
                            type='number'
                            value={betAmount}
                            onChange={handleBetAmountChange}
                            className="border border-purple-0.5 text-white placeholder:text-gray-700"
                          />
                          <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div className="flex cursor-pointer items-center gap-2 uppercase">
                                  <img
                                    src={selectedToken.src}
                                    className="h-4 w-4"
                                  />
                                  {selectedToken.name}
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-12 border-purple-0.5 bg-[#0D0B32CC]">
                                <DropdownMenuRadioGroup
                                  value={selectedToken.name}
                                  onValueChange={(value) => {
                                    const newToken = token.find(
                                      (t) => t.name === value
                                    );
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
                        <div className="grid grid-cols-4 space-x-3">
                          {multiplerArray.map((item, index) => (
                            <Button
                              className="rounded-lg border border-[#1D1776] bg-[#151245] font-semibold uppercase text-gray500 hover:bg-[#151245] hover:text-white"
                              key={index}
                              onClick={() => handleMultiplierClick(item)}
                            >
                              {item + 'x'}
                            </Button>
                          ))}
                        </div>
                        {!isAutoMode && (
                          <div className="flex flex-col justify-between gap-2">
                            <div className="flex flex-row items-center justify-start gap-2">
                              <Checkbox id="terms" className="text-[#049DD9]" checked={avaliableAutoCashout} onClick={() => setAvaliableAutoCashout(!avaliableAutoCashout)} />
                              <span className="text-white">
                                Auto Cashout
                              </span>
                            </div>
                            <div className="flex w-full items-center justify-center gap-1">
                              <Slider
                                className={`w-10/12 ${!avaliableAutoCashout && 'opacity-35'}`}
                                disabled={!avaliableAutoCashout}
                                step={0.01}
                                max={100}
                                min={1}
                                defaultValue={[autoCashoutAmount]}
                                onValueChange={(value) =>
                                  setAutoCashoutAmount(value[0])
                                }
                              />
                              <span className="w-2/12 text-end text-white">
                                {autoCashoutAmount + "x"}
                              </span>
                            </div>
                          </div>
                        )}
                        {isAutoMode && (
                          <>
                            <div className="flex w-full">
                              <div className="relative w-full">
                                <Input
                                  type='number'
                                  value={autoCashoutPoint}
                                  onChange={handleAutoCashoutPointChange}
                                  min={1.05}
                                  max={1000}
                                  className="w-full border border-purple-0.5 text-white placeholder:text-gray-700"
                                />
                                <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                                  Cashout
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-5 space-x-3">
                              {roundArray.map((item, index) => (
                                <Button
                                  className={`rounded-lg border border-[#1D1776] bg-[#151245] font-semibold uppercase text-gray500 hover:bg-[#151245] hover:text-white ${round === item ? 'bg-[#A326D4] text-white' : ''}`}
                                  key={index}
                                  onClick={() => setRound(item)}
                                >
                                  {item === 10000 ? '∞' : item}
                                </Button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
                <BetBoard
                  betData={betData}
                  betCashout={betCashout}
                  totalAmount={totalAmount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
