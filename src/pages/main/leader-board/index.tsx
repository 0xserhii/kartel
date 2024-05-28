import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrashBanner from '@/assets/crash-banner.png';
import CrashTitle from '@/assets/crash-title.png';
import CoinflipBanner from '@/assets/banner-bg.png';
import CoinflipTitle from '@/assets/coinflip-title.png';
import PlayText from '@/assets/play-text.svg';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ScrollBar, ScrollArea } from '@/components/ui/scroll-area';
import { scores } from '@/constants/data';

export default function Leaderboard() {
    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <Tabs defaultValue="crash" className="flex flex-col items-stretch gap-8 p-12">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-gray300">LEADER BOARD</div>
                    <TabsList className="flex items-center gap-2 bg-transparent">
                        <TabsTrigger
                            value="crash"
                            className="rounded-md border border-blue-border bg-dark-blue px-6 py-2 text-sm text-gray400 data-[state=active]:!border-transparent data-[state=active]:bg-purple data-[state=active]:text-gray200"
                        >
                            Crash
                        </TabsTrigger>
                        <TabsTrigger
                            value="coinflip"
                            className="rounded-md border border-blue-border bg-dark-blue px-6 py-2 text-sm text-gray400 data-[state=active]:!border-transparent  data-[state=active]:bg-purple  data-[state=active]:text-gray200"
                        >
                            Coin Flip
                        </TabsTrigger>
                    </TabsList>
                </div>

                <Card className=" border-purple-0.15  bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-b-purple-0.5 px-7 py-3 text-base font-semibold text-gray500">
                        <Table className="w-full table-fixed">
                            <TableBody>
                                <TableRow className="!bg-transparent">
                                    <TableCell className="w-1/12 text-center">No.</TableCell>
                                    <TableCell className="w-1/2">User</TableCell>
                                    <TableCell className="w-1/6 text-center">Time</TableCell>
                                    <TableCell className="w-1/6 text-center">Bet Amount</TableCell>
                                    <TableCell className="w-1/6 text-center">Score</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardHeader>
                    <CardContent className="px-2 py-0">
                        <ScrollArea className="h-88 px-5 py-3">
                            <Table className="relative table-fixed border-separate border-spacing-y-3">
                                <TableBody>
                                    {scores.map((score, index) => (
                                        <TableRow
                                            key={index}
                                            className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                                        >
                                            <TableCell className="w-1/12 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {score.rank <= 3 && (
                                                        <img src="src/assets/win-icon.svg" />
                                                    )}
                                                    {score.rank}
                                                </div>
                                            </TableCell>
                                            <TableCell className="w-1/2">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={score.avatar}
                                                        alt="User"
                                                        className="h-8 w-8 rounded-full"
                                                    />
                                                    <span>{score.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="w-1/6 text-center">
                                                {score.time}
                                            </TableCell>
                                            <TableCell className="w-1/6 text-center">
                                                ${score.betAmount}
                                            </TableCell>
                                            <TableCell className="w-1/6">
                                                <div className="flex items-center justify-center gap-1">
                                                    <img src="src/assets/score-icon.svg" alt="score flag" />
                                                    {score.score}
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

                <TabsContent value="crash">
                    <div className="relative rounded-md">
                        <img
                            src={CrashBanner}
                            alt="Crash Banner"
                            className="aspect-auto w-full"
                        />
                        <img
                            src={CrashTitle}
                            alt="Crash Title"
                            className="absolute left-7 top-4 mt-auto"
                        />
                        <img
                            src={PlayText}
                            alt="Play Text"
                            className="absolute bottom-4 left-7 mt-auto shadow-dark-blue-0.4 hover:shadow-lg"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="coinflip">
                    <div className="relative rounded-md">
                        <img
                            src={CoinflipBanner}
                            alt="Crash Banner"
                            className="aspect-auto w-full"
                        />
                        <img
                            src={CoinflipTitle}
                            alt="Crash Title"
                            className="absolute right-2 top-2 mt-auto"
                        />
                        <img
                            src={PlayText}
                            alt="Play Text"
                            className="absolute bottom-4 left-7 mt-auto shadow-dark-blue-0.4 hover:shadow-lg"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </ScrollArea>
    );
}
