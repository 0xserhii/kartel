import { useEffect, useState } from "react";
import "./coinflip-section.css";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { token } from "@/constants/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { coinFlipPresets, coinSide, multiplerArray } from "@/constants/data";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/utils/axios";
import useToast from "@/hooks/use-toast";
import { useWindowSize } from "@/hooks";
import Confetti from "react-confetti";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { coinflipActions, userActions } from "@/store/redux/actions";
import { probabilityXOrMoreHeads } from "@/utils/utils";

const CoinFlipSection = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const coinflipState = useAppSelector((state: any) => state.coinflip);
  const [betAmount, setBetAmount] = useState(0);
  const [selectedToken, setSelectedToken] = useState(token[0]);
  const [selectedSide, setSelectedSide] = useState(true);
  const [coinAmount, setCoinAmount] = useState(1);
  const [autobetAmount, setAutobetAmount] = useState(0);
  const [coins, setCoins] = useState<boolean[]>([]);
  const [selectedHeads, setSelectedHeads] = useState(1);
  const [probability, setProbability] = useState(0);
  const [isEarned, setIsEarned] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const { width, height } = useWindowSize();
  const [calculatedProbability, setCalculatedProbability] = useState(0);

  const resetGameState = () => {
    setBetAmount(0);
    setCoinAmount(1);
    setSelectedHeads(1);
    setSelectedSide(true);
    setSelectedToken(token[0]);
    setAutobetAmount(0);
    setIsRolling(false);
    setIsEarned(false);
    setProbability(0);
    dispatch(coinflipActions.resetGameState());
    setIsEarned(false);
  };

  const handleBetAmountChange = (event) => {
    const inputValue = event.target.value;
    const reqTest = new RegExp(`^\\d*\\.?\\d{0,2}$`);
    if (reqTest.test(inputValue) && inputValue !== "") {
      const updateValue =
        parseFloat(inputValue) >= 1
          ? inputValue.replace(/^0+/, "")
          : inputValue;
      setBetAmount(updateValue);
    } else if (inputValue === "") {
      setBetAmount(0);
    }
  };

  useEffect(() => {
    probabilityXOrMoreHeads(selectedHeads, betAmount).then((probability) => {
      setCalculatedProbability(probability);
    });
  }, [selectedHeads, betAmount]);

  const handleMultiplierClick = (multiplier) => {
    const newValue = betAmount * multiplier;
    setBetAmount(newValue);
  };

  const handlePresetSelection = (value) => {
    const [totalCoins, heads] = value.split(":").map(Number);
    setCoinAmount(totalCoins);
    setSelectedHeads(heads);
  };

  const startCoinflip = () => {
    if (betAmount > 0 && betAmount < 10000) {
      if (coinflipState.msg) {
        toast.error(coinflipState.msg);
        resetGameState();
      } else {
        dispatch(coinflipActions.updategameState());
        dispatch(
          coinflipActions.startCoinflipgame({
            betAmount: Number(betAmount) ?? 0.1,
            denom: selectedToken.name,
            betCoinsCount: coinAmount,
            betSideCount: selectedHeads,
            betSide: selectedSide,
          })
        );
        setIsRolling(true);
        setIsEarned(false);
      }
    } else {
      toast.error("Bet Amount should be between 0.1 and 10000");
    }
  };

  const handleChangeCoinAmount = (value) => {
    if (selectedHeads > value[0]) {
      setSelectedHeads(value[0]);
    }
    if (value[0] < 6) {
      setSelectedHeads(1);
    } else if (value[0] <= 8) {
      setSelectedHeads(2);
    } else if (value[0] <= 10) {
      setSelectedHeads(3);
    }
    setCoinAmount(value[0]);
  };

  const handleHeadsAmounts = (value) => {
    if (value[0] > coinAmount) {
      setCoinAmount(value[0]);
    }
    setSelectedHeads(value[0]);
  };

  useEffect(() => {
    const newCoins = Array.from({ length: coinAmount }, (_, index) =>
      index < selectedHeads ? selectedSide : !selectedSide
    );
    setCoins(newCoins);
  }, [selectedHeads, coinAmount, selectedSide]);

  useEffect(() => {
    if (coinflipState.msg) {
      toast.error(coinflipState.msg);
      resetGameState();
    }
  }, [coinflipState.msg]);

  useEffect(() => {
    dispatch(coinflipActions.loginCoinflipServer());
  }, [getAccessToken()]);

  useEffect(() => {
    dispatch(coinflipActions.subscribeCoinflipServer());
    dispatch(userActions.siteBalanceUpdate({ value: 0, denom: "" }));
  }, []);

  useEffect(() => {
    setIsRolling(false);
    setIsEarned(coinflipState.gameData.isEarn);
    setCoins(coinflipState.gameData.coinflipResult);
  }, [coinflipState.gameData]);

  useEffect(() => {
    probabilityXOrMoreHeads(selectedHeads, coinAmount).then((probability) => {
      setProbability(probability * 100);
    });
  }, [coinAmount, selectedHeads]);

  useEffect(() => {
    if (!isRolling && coinflipState.gameStatus) {
      const timer = setTimeout(() => {
        resetGameState();
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [isRolling, coinflipState.gameStatus]);

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      {isEarned && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={2000}
          gravity={0.1}
          recycle={false}
        />
      )}
      <div className="mt-9 flex w-full flex-col items-center justify-center">
        <div className="flex flex-col">
          <div className="flex h-64 flex-col items-center justify-around">
            {coinflipState.gameStatus && (
              <span className="absolute top-3 text-xl font-bold uppercase text-[#df8002]">
                {isEarned
                  ? `You Won ${((betAmount / calculatedProbability) * (1 - 0.05)).toFixed(2)}`
                  : `You Lost`}
              </span>
            )}
            <div
              className="mt-10 grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${Math.min(coins.length, 5)}, 1fr)`,
              }}
            >
              {coins.map((coin, index) => {
                return (
                  <div
                    key={index}
                    id="coin"
                    className={`coin ${isRolling ? "flipping" : `${coin ? "coin-front" : "coin-back"}`}`}
                    style={{
                      animation: isRolling
                        ? `${Math.random() * 0.2 + 0.5}s flip infinite`
                        : undefined,
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
          <div className="2xl:px-30 px-30 flex flex-col items-center justify-center gap-5 py-7 lg:px-28">
            <span className="mt-2 text-sm text-white ">
              {probability}% Chance
            </span>
            <div className="flex w-full flex-row justify-center gap-10">
              <div className="flex w-6/12 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray200">Coins</span>
                  <div className="flex w-full flex-row items-center justify-between rounded-lg border border-purple-0.5 px-5 py-3">
                    <Slider
                      className={`w-10/12 cursor-pointer ${isRolling && "opacity-25"}`}
                      step={1}
                      min={1}
                      max={10}
                      value={[coinAmount]}
                      onValueChange={handleChangeCoinAmount}
                      disabled={isRolling}
                    />
                    <span className="text-sm text-white">{coinAmount}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray200">Auto Bet</span>
                  <div className="flex w-full flex-row items-center justify-between rounded-lg border border-purple-0.5 px-5 py-3">
                    <Slider
                      className={`w-10/12 cursor-pointer opacity-25`}
                      value={[autobetAmount]}
                      onValueChange={(value) => setAutobetAmount(value[0])}
                      disabled
                    />
                    <span className="text-sm text-white">{autobetAmount}</span>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4">
                  <p className="w-6/12 text-sm uppercase text-[#556987]">
                    bet amount
                  </p>
                  <div className="relative">
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={handleBetAmountChange}
                      disabled={isRolling}
                      className="border border-purple-0.5 text-white placeholder:text-gray-700"
                    />
                    <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={isRolling}>
                          <div className="flex cursor-pointer items-center gap-2 uppercase">
                            <img src={selectedToken.src} className="h-4 w-4" />
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
                  <div className="grid grid-cols-4 gap-5">
                    {multiplerArray.map((item, index) => (
                      <Button
                        className="rounded-lg border border-[#1D1776] bg-dark-blue font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white"
                        key={index}
                        disabled={isRolling}
                        onClick={() => handleMultiplierClick(item)}
                      >
                        {item + "x"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex w-6/12 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray200">Heads / Tails</span>
                  <div className="flex w-full flex-row items-center justify-between rounded-lg border border-purple-0.5 px-5 py-3">
                    <Slider
                      className={`w-10/12 cursor-pointer ${isRolling && "opacity-25"}`}
                      max={10}
                      min={coinAmount < 6 ? 1 : coinAmount < 8 ? 2 : 3}
                      step={1}
                      value={[selectedHeads]}
                      onValueChange={handleHeadsAmounts}
                      disabled={isRolling}
                    />
                    <span className="text-sm text-white">{selectedHeads}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray200">Presets</span>
                  <div className="flex w-full flex-row items-center justify-between rounded-lg border border-purple-0.5 px-1 py-1">
                    <Select onValueChange={handlePresetSelection}>
                      <SelectTrigger
                        className="w-full py-4 !text-gray200"
                        disabled={isRolling}
                      >
                        <SelectValue
                          placeholder="custom"
                          className="!text-white"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {coinFlipPresets.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-gray200"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="my-auto flex items-center justify-center gap-10">
                  <div className="flex flex-row gap-10">
                    {coinSide.map((side, index) => (
                      <div key={index}>
                        <div
                          className={`flex h-full cursor-pointer flex-col items-center justify-center rounded-full border-2 ${selectedSide === side ? "border-[#f4b205]" : "border-transparent opacity-80"} transition-transform duration-150 ${isRolling && "opacity-25"}`}
                          onClick={() => setSelectedSide(!selectedSide)}
                        >
                          <img
                            src={
                              side
                                ? "/assets/games/coin-flip/coin-head.svg"
                                : "/assets/games/coin-flip/coin-tail.svg"
                            }
                            alt={side ? "head" : "tail"}
                            className="h-24 w-24 p-0.5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-10">
              <Button
                className="text-md rounded-lg bg-purple px-36 py-6 font-light text-white hover:bg-purple"
                onClick={startCoinflip}
              >
                {isRolling ? "Rolling..." : "Flip coins"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default CoinFlipSection;
