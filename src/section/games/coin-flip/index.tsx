import { useEffect, useState } from "react";
import "./coinflip-section.css";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { token } from "../crash";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { coinFlipPresets, coinSide, multiplerArray } from "@/constants/data";
import { Button } from "@/components/ui/button";
import { Socket, io } from "socket.io-client";
import { ICoinflipClientToServerEvents, ICoinflipServerToClientEvents } from "@/types/coinflip";
import { getAccessToken } from "@/lib/axios";
import useToast from '@/routes/hooks/use-toast';

interface ICoin {
    result: 1 | 0,
    flipping: boolean
}

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
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const toast = useToast();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [betAmount, setBetAmount] = useState(0);
    const [selectedToken, setSelectedToken] = useState(token[0]);
    const [selectedSide, setSelectedSide] = useState(coinSide[1])
    const [coinAmount, setCoinAmount] = useState(1);
    const [autobetAmount, setAutobetAmount] = useState(1);
    const [flipping, setFlipping] = useState(false);
    const [coins, setCoins] = useState<ICoin[]>(Array.from({ length: 5 }, () => ({ result: 1, flipping: true })));
    const [selectedHeads, setSelectedHeads] = useState(3);
    const [probability, setProbability] = useState(0);

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

        const newCoins = coins.map(() => ({
            result: (Math.random() > 0.5 ? 1 : 0) as 1 | 0,
            flipping: false
        }));
        setCoins(newCoins);
    };

    const onChangeCoins = async () => {
        setFlipping(true);
        const timer = setTimeout(() => {
            setFlipping(false);
        }, 600);
        return () => clearTimeout(timer);
    }

    const startCoinflip = () => {
        if (betAmount > 0) {
            socket?.emit('create-new-coinflipgame', {
                betAmount: Number(betAmount) ?? 0.1,
                denom: selectedToken.name,
                betCoinsCount: coinAmount,
                betSideCount: selectedHeads,
                betSide: selectedSide === 1 ? false : true
            });
        } else {
            toast.error("Bet Amount should be between 0.1 and 100")
        }
    }

    useEffect(() => {
        if (socket) {
            socket.emit('auth', getAccessToken());
        }
    }, [getAccessToken(), socket]);

    useEffect(() => {
        onChangeCoins();
    }, [coins]);

    useEffect(() => {
        const oppositeSide = selectedSide === 1 ? 0 : 1;
        const newCoins = Array.from({ length: coinAmount }, () => ({
            result: oppositeSide as 1 | 0,
            flipping: true
        }));
        for (let i = 0; i < Math.min(selectedHeads, coinAmount); i++) {
            newCoins[i].result = selectedSide as 1 | 0;
        }
        setCoins(newCoins);
    }, [selectedHeads, coinAmount, selectedSide]);

    useEffect(() => {
        const coinflipSocket: Socket<
            ICoinflipServerToClientEvents,
            ICoinflipClientToServerEvents
        > = io(`${SERVER_URL}/coinflip`);

        coinflipSocket.emit('auth', getAccessToken());

        coinflipSocket.on('coinflip-probability', (data) => {
            setProbability(data);
        });

        coinflipSocket.on('game-creation-error', (message) => {
            toast.error(message);
        });

        coinflipSocket.on('new-coinflip-game', (gameData) => {
            console.log(gameData);
        });

        coinflipSocket.on('coinflipgame-join-success', () => {
            toast.success('Joined game');
        });

        coinflipSocket.on('coinflipgame-rolled', (gameData) => {
            console.log(gameData);
        });

        coinflipSocket.on('coinflipgame-joined', (gameData) => {
            console.log(gameData);
        });

        setSocket(coinflipSocket);
    }, []);

    useEffect(() => {
        probabilityXOrMoreHeads(selectedHeads, coinAmount).then((probability) => {
            setProbability(probability * 100);
        });
    }, [coinAmount, selectedHeads])



    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex flex-col items-stretch gap-8">
                <div className="flex flex-col gap-6">
                    <div className="h-80 flex flex-col justify-between items-center">
                        <div className="grid gap-6 mt-10" style={{ gridTemplateColumns: `repeat(${coinAmount > 5 ? 5 : coinAmount}, 1fr)` }}>
                            {coins.map((coin, index) => {
                                return (
                                    <div key={index} id="coin" className={`coin w-6/12 flipping ${flipping ? 'flipping' : ''}`}>
                                        <div className="coin-flip-side">
                                            <img src={`/assets/games/coin-flip/coin-${coin.result === 0 ? 'head' : 'tail'}.svg`} alt="head" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <span className="text-white text-sm">{probability}% Chance</span>
                    </div>
                    <div className="flex flex-col 2xl:px-30 lg:px-20 xl:px-20 mg:px-40 px-72 py-6">
                        <div className="w-full flex flex-row justify-center gap-10">
                            <div className="flex flex-col gap-6 w-6/12">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray200 text-sm">
                                        Coins
                                    </span>
                                    <div className="flex flex-row w-full border border-purple-0.5 rounded-lg py-4 px-5 justify-between items-center">
                                        <Slider className="w-52" step={1} min={1} max={10} defaultValue={coinAmount[0]} onValueChange={(value) => setCoinAmount(value[0])} />
                                        <span className="text-white text-sm">
                                            {coinAmount}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray200 text-sm">
                                        Auto Bet
                                    </span>
                                    <div className="flex flex-row w-full border border-purple-0.5 rounded-lg py-4 px-5 justify-between items-center">
                                        <Slider className="w-52" defaultValue={autobetAmount[0]} onValueChange={(value) => setAutobetAmount(value[0])} />
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
                                    <div className="grid grid-cols-4 gap-5">
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
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 w-6/12">
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray200 text-sm">
                                        Heads / Tails
                                    </span>
                                    <div className="flex flex-row w-full border border-purple-0.5 rounded-lg py-4 px-5 justify-between items-center">
                                        <Slider className="w-52" max={coinAmount} min={coinAmount < 6 ? 1 : coinAmount < 9 ? 2 : 3} step={1} defaultValue={selectedHeads[0]} onValueChange={(value) => setSelectedHeads(value[0])} />
                                        <span className="text-white text-sm">
                                            {selectedHeads}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray200 text-sm">
                                        Presets
                                    </span>
                                    <div className="flex flex-row w-full border border-purple-0.5 rounded-lg py-2 px-1 justify-between items-center">
                                        <Select onValueChange={handlePresetSelection}>
                                            <SelectTrigger className="!text-gray200 w-full py-4">
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
                                                    <div className={`cursor-pointer flex flex-col items-center justify-center border-2 h-full rounded-full ${selectedSide === side ? "border-[#f4b205]" : "border-transparent opacity-80"} transition-transform duration-150`} onClick={() => setSelectedSide(side)}>
                                                        <img src={side === 0 ? "/assets/games/coin-flip/coin-head.svg" : "/assets/games/coin-flip/coin-tail.svg"} alt={side === 1 ? "head" : "tail"} className="w-24 h-24 p-0.5" />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-10">
                        <Button className="bg-[#A326D4] hover:bg-[#A326D4] text-white py-7 px-36 rounded-lg text-md font-light" onClick={startCoinflip}>
                            Flip coins
                        </Button>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}

export default CoinFlipSection;