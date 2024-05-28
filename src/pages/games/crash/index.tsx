import setting from '@/assets/auth-btn.svg'
import InvitedFriends from '@/assets/invited-friends.png';
import BlackJack from '@/assets/blackjack.png';
import HorseRacing from '@/assets/horseracing.png';
import Roulette from '@/assets/roulette.png';
import Slots from '@/assets/slots.png';
import { ScrollArea } from '@/components/ui/scroll-area';
import { multiPlayers } from '@/constants/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from '@/components/ui/input';


const betMode = ["manual", "auto"];
const betAmount = [2, 4, 8]
export default function CrashGames() {
    const [selected, setSelected] = useState(multiPlayers[3]);
    const [selectMode, setSelectMode] = useState(betMode[0]);
    const [selectAmount, setSelectAmount] = useState(betAmount[0]);

    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex flex-col items-stretch gap-8">
                <div className="flex flex-col items-stretch gap-6">
                    <div className='flex flex-row w-full h-full gap-6 justify-between'>
                        <div className='w-full h-full'>
                            <div className='relative rounded-md bg-[url("src/assets/crash-game.png")] h-[596px]'>
                                <div className='flex flex-row justify-around items-center py-5'>
                                    <div className='flex flex-row items-center justify-center gap-2'>
                                        <span className="inline-flex items-center justify-center w-3 h-3 ms-2 text-xs font-semibold text-blue-800 bg-[#0BA544] rounded-full" />
                                        <p className='text-gray-300 text-sm'>Network status</p>
                                    </div>
                                    <div className='flex flex-row gap-3'>
                                        {multiPlayers.map((item, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => setSelected(item)}
                                                className={cn(
                                                    'min-h-full rounded-lg border border-[#1D1776] px-6 py-5 bg-[#151245] uppercase text-gray500 font-semibold hover:text-white hover:bg-[#151245]',
                                                    selected === item && 'text-white bg-[#A326D4] hover:bg-[#A326D4] border-[#A326D4]'
                                                )}
                                            >
                                                x{item}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className='flex flex-row items-center gap-6'>
                                        <button>
                                            <img src={setting} className='p-2 bg-[#F8BB54] rounded-md' />
                                        </button>
                                        <button className='flex flex-row items-center uppercase bg-[#049DD9] py-2 px-3 text-sm text-white gap-2 rounded-md'>
                                            <img src={setting} />
                                            history
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row gap-2 w-full p-8'>
                                <div className='flex flex-col w-5/12 gap-5'>
                                    <div className='flex flex-row justify-between items-center'>
                                        <h5 className='uppercase text-gray-400 text-xl font-semibold'>bet mode</h5>
                                        <div className='flex flex-row items-center gap-3'>
                                            {
                                                betMode.map((item, index) => (
                                                    <Button
                                                        className={cn(
                                                            'min-h-full rounded-lg border border-[#1D1776] px-6 py-5 bg-[#151245] uppercase text-gray500 font-semibold hover:text-white hover:bg-[#151245]',
                                                            selectMode === item && 'text-white bg-[#A326D4] hover:bg-[#A326D4] border-[#A326D4]'
                                                        )}
                                                        key={index} onClick={() => setSelectMode(item)}>
                                                        {item}
                                                    </Button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className='flex flex-col rounded-lg border border-[#4B34A780] h-full w-full p-8 gap-4 bg-[#0D0B32CC]'>
                                        <div className='flex flex-col gap-6'>
                                            <p className='uppercase text-md text-gray-300'>
                                                bet amount
                                            </p>
                                            <Input type="number" className='text-white border border-gray-700 placeholder:text-gray-700' />
                                            <div className='grid grid-cols-3 space-x-3'>
                                                {
                                                    betAmount.map((item, index) => (
                                                        <Button
                                                            className={cn(
                                                                'rounded-lg border border-[#1D1776] bg-[#151245] uppercase text-gray500 font-semibold hover:text-white hover:bg-[#151245]',
                                                                selectAmount === item && 'text-white bg-[#A326D4] hover:bg-[#A326D4] border-[#A326D4]'
                                                            )}
                                                            key={index} onClick={() => setSelectAmount(item)}>
                                                            {item + "x"}
                                                        </Button>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <Button className='bg-[#F205B3] py-5 hover:bg-[#F205B3] w-full uppercase'>Start bet</Button>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div>

                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
