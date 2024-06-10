import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { minesAmountPresets, multiplerArray, sampleMine, token } from "@/constants/data";
import { EMinesStatus } from "@/constants/status";
import { useState } from "react";

export default function MinesGameSection() {
    const [betAmount, setBetAmount] = useState(0);
    const [minesAmount, setMinesAmount] = useState(0);
    const [selectedToken, setSelectedToken] = useState(token[0]);
    const [presetMineAmount, setPresetMineAmount] = useState(minesAmountPresets[0]);
    const [minesStatus, setMinesStatus] = useState(sampleMine.map(() => false));
    const [isGameOver, setIsGameOver] = useState(false);
    const [mineStatus, setMineStatus] = useState(EMinesStatus.START);

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

    const handleMinesAmountChange = (event) => {
        const inputValue = event.target.value;
        const reqTest = new RegExp(`^\\d*\\.?\\d{0,2}$`);
        if (reqTest.test(inputValue) && inputValue !== '') {
            const updateValue =
                parseFloat(inputValue) >= 1
                    ? inputValue.replace(/^0+/, '')
                    : inputValue;
            setMinesAmount(updateValue);
        } else if (inputValue === '') {
            setMinesAmount(0);
        }
    };

    const handleMinePresetsAmount = (item) => {
        setMinesAmount(item);
        setPresetMineAmount(item)
    };

    const handleMinesClick = (index, mine) => {
        setMineStatus(EMinesStatus.START);
        if (isGameOver) return;
        if (!mine) {
            setIsGameOver(true);
            setMineStatus(EMinesStatus.END);
        };
        setMinesStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = !newStatus[index];
            return newStatus;
        });
    };

    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex justify-center items-center">
                {
                    isGameOver && (
                        <span className="absolute text-xl uppercase top-3 text-[#df8002] font-bold text-center">
                            game over
                        </span>
                    )
                }
            </div>
            <div className="flex flex-col gap-12">
                <div className="flex flex-row justify-between relative mt-10">
                    <div className="w-1/12 flex justify-center items-center">
                        <div className="flex flex-col justify-center items-center bg-darkBlue2 rounded-lg px-7 py-4 gap-1">
                            <img src="/assets/games/mines/star.svg" />
                            <span className="text-white text-sm font-bold">
                                35
                            </span>
                        </div>
                    </div>
                    <div className="w-10/12 grid gap-3  mt-10" style={{ gridTemplateColumns: `repeat(5, 1fr)` }}>
                        {
                            sampleMine.map((mine, index) => (
                                <div className="flex justify-center items-center group" key={index} onClick={() => handleMinesClick(index, mine)}>
                                    <img src={`/assets/games/mines/${minesStatus[index] ? (mine ? 'star.svg' : 'bomb.svg') : 'mystery.svg'}`} alt="mines" className="w-20 h-16 group hover:transition-all" />
                                </div>
                            ))
                        }
                    </div>
                    <div className="w-1/12 flex justify-center items-center">
                        <div className="flex flex-col justify-center items-center bg-darkBlue2 rounded-lg px-7 py-4 gap-1">
                            <img src="/assets/games/mines/bomb.svg" />
                            <span className="text-white text-sm font-bold">
                                35
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-12 justify-center items-center">
                    <div className="flex justify-center gap-6">
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
                            <div className="grid grid-cols-4 gap-5">
                                {multiplerArray.map((item, index) => (
                                    <Button
                                        className="rounded-lg border border-[#1D1776] bg-dark-blue font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white"
                                        key={index}
                                        onClick={() => handleMultiplierClick(item)}
                                    >
                                        {item + 'x'}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-full flex flex-col gap-4">
                                <p className="text-sm uppercase text-[#556987] w-6/12">
                                    mines amount
                                </p>
                                <div className="relative">
                                    <Input
                                        type='number'
                                        value={minesAmount}
                                        onChange={handleMinesAmountChange}
                                        className="border border-purple-0.5 text-white placeholder:text-gray-700"
                                    />
                                    <div className="absolute right-4 top-0 flex h-full items-center justify-center text-gray500">
                                        <img src="/assets/games/mines/bomb.svg" className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-5">
                                    {minesAmountPresets.map((item, index) => (
                                        <Button
                                            className={`rounded-lg border border-[#1D1776] bg-dark-blue font-semibold uppercase text-gray500 hover:bg-dark-blue hover:text-white ${item === presetMineAmount ? 'bg-purple text-white hover:bg-purple' : ''}`}
                                            key={index}
                                            onClick={() => handleMinePresetsAmount(item)}
                                        >
                                            {item}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button className="w-72 bg-purple py-5 hover:bg-purple">
                        {
                            mineStatus === EMinesStatus.START ? 'Start Bet' : 'Cash out'
                        }
                    </Button>
                </div>
            </div>
        </ScrollArea>
    )
}

