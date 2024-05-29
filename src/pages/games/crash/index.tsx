import setting from '/assets/auth-btn.svg'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { multiPlayers, players } from '@/constants/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';


const betMode = ["manual", "auto"];
const betAmount = [2, 4, 8]
export default function CrashGames() {
    const selected = multiPlayers[3];
    const [selectMode, setSelectMode] = useState(betMode[0]);
    const [selectAmount, setSelectAmount] = useState(betAmount[0]);

    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex flex-col items-stretch gap-8">
                <div className="flex flex-col items-stretch gap-6">
                    <div className='flex flex-row w-full h-full gap-6 justify-between'>
                        <div className='w-full'>
                            <div className='relative rounded-md bg-[url("/assets/crash-game-bg.svg")] h-[596px] bg-center bg-no-repeat w-full bg-cover'>
                                <div className='flex flex-row justify-around items-center py-5'>
                                    <div className='flex flex-row items-center justify-center gap-2'>
                                        <span className="inline-flex items-center justify-center w-3 h-3 ms-2 text-xs font-semibold text-blue-800 bg-[#0BA544] rounded-full" />
                                        <p className='text-gray-300 text-sm'>Network status</p>
                                    </div>
                                    <div className='flex gap-3'>
                                        {multiPlayers.map((item, index) => (
                                            <span
                                                key={index}
                                                className={cn(
                                                    'text-sm rounded-lg border border-[#1D1776] px-1 py-0.5 bg-[#151245] text-gray500 text-center',
                                                    selected === item && 'text-white bg-[#A326D4] border-[#A326D4]'
                                                )}
                                            >
                                                x{item}
                                            </span>
                                        ))}
                                    </div>
                                    <div className='flex lg:flex-row flex-col items-center gap-6'>
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
                            <div className='flex md:flex-row flex-col gap-7 w-full p-8'>
                                <div className='flex flex-col md:w-5/12 w-full gap-5 h-full'>
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
                                    <Card className=" border-purple-0.15  bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">
                                        <div className='flex flex-col rounded-lg h-full w-full p-8 gap-4 bg-[#0D0B32CC]'>
                                            <div className='flex flex-col gap-6'>
                                                <p className='uppercase text-md text-[#556987] font-semibold'>
                                                    bet amount
                                                </p>
                                                <Input type="text" className='text-white border border-gray-700 placeholder:text-gray-700' />
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
                                    </Card>
                                </div>
                                <div className='flex flex-col md:w-7/12 w-full gap-5 h-full'>
                                    <div className='flex flex-row justify-between items-center py-1.5'>
                                        <h5 className='uppercase text-gray-400 text-xl font-semibold'>124 players</h5>
                                        <span className='flex flex-row items-center gap-2'>
                                            <img src='/assets/icons/coin.svg' />
                                            <p className='text-[#049DD9] text-xl font-semibold'>8.097</p>
                                        </span>
                                    </div>
                                    <Card className=" border-purple-0.15 bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">
                                        <CardHeader className="flex flex-row items-center justify-between border-b border-b-purple-0.5 px-7 py-3 text-base font-semibold text-gray500">
                                            <Table className="w-full table-fixed">
                                                <TableBody>
                                                    <TableRow className="!bg-transparent">
                                                        <TableCell className="w-6/12 text-start">User</TableCell>
                                                        <TableCell className="w-1/6">Time</TableCell>
                                                        <TableCell className="w-1/6 text-center">Bet</TableCell>
                                                        <TableCell className="w-1/6 text-center">Multipler</TableCell>
                                                        <TableCell className="w-1/6 text-center">Payout</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </CardHeader>
                                        <CardContent className="px-2 py-0">
                                            <ScrollArea className="h-[280px] px-5 py-3">
                                                <Table className="relative table-fixed border-separate border-spacing-y-3">
                                                    <TableBody>
                                                        {players.map((player, index) => (
                                                            <TableRow
                                                                key={index}
                                                                className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                                                            >
                                                                <TableCell className="w-1/2">
                                                                    <div className="flex items-center gap-2">
                                                                        <img
                                                                            src={player.avatar}
                                                                            alt="User"
                                                                            className="h-8 w-8 rounded-full"
                                                                        />
                                                                        <span>{player.user}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="w-1/6 text-center">
                                                                    {player.time}
                                                                </TableCell>
                                                                <TableCell className="w-1/6 text-center">
                                                                    ${player.betAmount}
                                                                </TableCell>
                                                                <TableCell className="w-1/6 text-center">
                                                                    <span className={`rounded-lg border border-[#1D1776] px-0.5 py-0.5 text-white font-semibold text-center ${player.status === "success" ? "bg-[#0BA544]" : "bg-[#D31900]"}`}>
                                                                        ${player.multipler}
                                                                    </span>


                                                                </TableCell>
                                                                <TableCell className="w-1/6">
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        ${player.payout}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
