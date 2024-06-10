import { useEffect, useState } from "react";
import "./coinflip-section.css";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { token } from "@/constants/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { coinFlipPresets, coinSide, multiplerArray } from "@/constants/data";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/axios";
import useToast from '@/hooks/use-toast';
import { useWindowSize } from "@/hooks";
import Confetti from "react-confetti";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { coinflipActions } from "@/store/redux/actions";

const probabilityXOrMoreHeads = async (x: number, n: number): Promise<number> => {
    const factorial = (n: number): number => {
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };
    const binomialCoefficient = (n: number, k: number): number => {
        return factorial(n) / (factorial(k) * factorial(n - k));
    };
    const binomialProbability = (n: number, k: number, p: number): number => {
        return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    };
    let probability = 0;
    for (let k = x; k <= n; k++) {
        probability += binomialProbability(n, k, 0.5);
    }
    return probability;
};

const CoinFlipSection = () => {
    const toast = useToast();
    const dispatch = useAppDispatch();
    const coinflipState = useAppSelector((state) => state.coinflip)
    const [betAmount, setBetAmount] = useState(0);
    const [selectedToken, setSelectedToken] = useState(token[0]);
    const [selectedSide, setSelectedSide] = useState(true)
    const [coinAmount, setCoinAmount] = useState(1);
    const [autobetAmount, setAutobetAmount] = useState(0);
    const [coins, setCoins] = useState<boolean[]>([]);
    const [selectedHeads, setSelectedHeads] = useState(1);
    const [probability, setProbability] = useState(0);
    const [isEarned, setIsEarned] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const { width, height } = useWindowSize();

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

    const handleMultiplierClick = (multiplier) => {
        const newValue = betAmount * multiplier;
        setBetAmount(newValue);
    };

    const handlePresetSelection = (value) => {
        const [totalCoins, heads] = value.split(':').map(Number);
        setCoinAmount(totalCoins);
        setSelectedHeads(heads);
    };

    const startCoinflip = () => {
        if (betAmount > 0 && betAmount < 10000) {
            if (coinflipState.msg) {
                toast.error(coinflipState.msg)
                setIsRolling(false);
            } else {
                dispatch(coinflipActions.updategameState());
                dispatch(coinflipActions.startCoinflipgame({
                    betAmount: Number(betAmount) ?? 0.1,
                    denom: selectedToken.name,
                    betCoinsCount: coinAmount,
                    betSideCount: selectedHeads,
                    betSide: selectedSide
                }));
                setIsRolling(true);
                setIsEarned(false);
            }
        } else {
            toast.error("Bet Amount should be between 0.1 and 10000");
        }
    };

    const handleChangeCoinAmount = (value) => {
        if (selectedHeads > value[0]) {
            setSelectedHeads(value[0])
        }
        if (value[0] < 6) {
            setSelectedHeads(1)
        }
        else if (value[0] <= 8) {
            setSelectedHeads(2)
        } else if (value[0] <= 10) {
            setSelectedHeads(3)
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
            toast.error(coinflipState.msg)
            setIsRolling(false);
        }
    }, [coinflipState.msg]);

    useEffect(() => {
        dispatch(coinflipActions.loginCoinflipServer())
    }, [getAccessToken()]);

    useEffect(() => {
        dispatch(coinflipActions.subscribeCoinflipServer())
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

    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            {
                isEarned && (
                    <Confetti width={width} height={height} numberOfPieces={2000} gravity={0.1} recycle={false} />
                )
            }
            <div className="flex flex-col items-center justify-center mt-9">
                <div className="flex flex-col">
                    <div className="h-64 flex flex-col justify-around items-center">
                        {
                            coinflipState.gameStatus &&
                            <span className="absolute text-xl uppercase top-3 text-[#df8002] font-bold">{isEarned ? `You Won ${coinflipState.winAmount.toFixed(2)}` : `You Lost`}</span>
                        }
                        <div className="grid gap-6 mt-10" style={{ gridTemplateColumns: `repeat(${Math.min(coins.length, 5)}, 1fr)` }}>
                            {coins.map((coin, index) => {
                                return (
                                    <div key={index} id="coin" className={`coin ${isRolling ? "flipping" : `${coin ? "coin-front" : "coin-back"}`}`} style={{
                                        animation: isRolling ? `${Math.random() * 0.2 + 0.5}s flip infinite` : undefined
                                    }}>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col 2xl:px-30 px-64 lg:px-28 py-7 justify-center items-center gap-5">
                        <span className="text-white text-sm mt-2 ">{probability}% Chance</span>
                        <div className="w-full flex flex-row justify-center gap-10">
                            <div className="flex flex-col gap-4 w-6/12">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray200 text-sm">
                                        Coins
                                    </span>
                                    <div className="flex flex-row w-full border border-purple-0.5 rounded-lg py-3 px-5 justify-between items-center">
                                        <Slider className={`w-10/12 cursor-pointer ${isRolling && "opacity-25"}`} step={1} min={1} max={10} value={[coinAmount]} onValueChange={handleChangeCoinAmount} disabled={isRolling} />
                                        <span className="text-white text-sm">
                                            {coinAmount}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray200 text-sm">
                                        Auto Bet
                                    </span>
                                    <div className="flex flex-row w-full border border-purple-0.5 rounded-lg py-3 px-5 justify-between items-center">
                                        <Slider className={`w-10/12 cursor-pointer ${isRolling && "opacity-25"}`} value={[autobetAmount]} onValueChange={(value) => setAutobetAmount(value[0])} disabled={isRolling} />
                                        <span className="text-white text-sm">
                                            {autobetAmount}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <p className="text-sm uppercase text-[#556987] w-6/12">
                                        bet amount
                                    </p>
                                    <div className="relative">
                                        <Input
                                            type='number'
                                            value={betAmount}
                                            onChange={handleBetAmountChange}
                                            disabled={isRolling}
                                            className="border border-purple-0.5 text-white placeholder:text-gray-700"
                                        />
                                        <span className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild disabled={isRolling}>
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
                                    <div className="grid grid-cols-4 gap-5">
                                        {multiplerArray.map((item, index) => (
                                            <Button
                                                className="rounded-lg border border-[#1D1776] bg-dark-blue font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white"
                                                key={index}
                                                disabled={isRolling}
                                                onClick={() => handleMultiplierClick(item)}
                                            >
                                                {item + 'x'}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 w-6/12">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray200 text-sm">
                                        Heads / Tails
                                    </span>
                                    <div className="flex flex-row w-full border border-purple-0.5 rounded-lg py-3 px-5 justify-between items-center">
                                        <Slider className={`w-10/12 cursor-pointer ${isRolling && "opacity-25"}`} max={10} min={coinAmount < 6 ? 1 : coinAmount < 8 ? 2 : 3} step={1} value={[selectedHeads]} onValueChange={handleHeadsAmounts} disabled={isRolling} />
                                        <span className="text-white text-sm">
                                            {selectedHeads}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray200 text-sm">
                                        Presets
                                    </span>
                                    <div className="flex flex-row w-full border border-purple-0.5 rounded-lg py-1 px-1 justify-between items-center">
                                        <Select onValueChange={handlePresetSelection}>
                                            <SelectTrigger className="!text-gray200 w-full py-4" disabled={isRolling}>
                                                <SelectValue placeholder="custom" className="!text-white" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {coinFlipPresets.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="text-gray200">
                                                        {option.label}
                                                    </SelectItem>

                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex my-auto justify-center items-center gap-10">
                                    <div className="flex flex-row gap-10">
                                        {
                                            coinSide.map((side, index) => (
                                                <div key={index}>
                                                    <div className={`cursor-pointer flex flex-col items-center justify-center border-2 h-full rounded-full ${selectedSide === side ? "border-[#f4b205]" : "border-transparent opacity-80"} transition-transform duration-150 ${isRolling && "opacity-25"}`} onClick={() => setSelectedSide(!selectedSide)}>
                                                        <img src={side ? "/assets/games/coin-flip/coin-head.svg" : "/assets/games/coin-flip/coin-tail.svg"} alt={side ? "head" : "tail"} className="w-24 h-24 p-0.5" />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-10">
                            <Button className="bg-purple hover:bg-purple text-white py-6 px-36 rounded-lg text-md font-light" onClick={startCoinflip} >
                                {
                                    isRolling ? "Rolling..." : "Flip coins"
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}

export default CoinFlipSection;