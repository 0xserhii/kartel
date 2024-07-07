import CrashBanner from "/assets/crash.jpg";
import CoinflipBanner from "/assets/coinflip.jpg";
import CoinflipTitle from "/assets/coinflip-title.png";
import CrashTitle from "/assets/crash-title.png";
import PlayText from "/assets/play-text.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { leaderboardActions } from "@/store/redux/actions";
import { useAppDispatch, useAppSelector } from "@/store/redux";

const leaderboardTabs = [
    { title: "Crash", value: "crash" },
    // { title: 'Coinflip', value: 'coinflip' }
];

const LeaderboardCard = ({ title, dataKey }) => {
    const leaderboardState = useAppSelector((state: any) => state.leaderboard);
    const active = leaderboardTabs[0].value;

    return (
        <Card className="w-6/12 border-purple-0.15 bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-b-purple-0.5 px-7 py-3 text-base font-semibold text-gray500">
                <Table className="w-full table-fixed">
                    <TableBody>
                        <TableRow className="!bg-transparent">
                            <TableCell className="w-1/5 text-center">No.</TableCell>
                            <TableCell className="w-1/5">User</TableCell>
                            <TableCell className="w-1/5 text-center">{title} Bet</TableCell>
                            <TableCell className="w-1/5 text-center">{title} Win</TableCell>
                            <TableCell className="w-1/5 text-center">{title} Profit</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardHeader>
            <CardContent className={`px-2 py-0 ${"h-[536px]"}`}>

                <ScrollArea className="h-88 px-5 py-3">
                    <Table className="relative table-fixed border-separate border-spacing-y-3">
                        <TableBody>
                            {leaderboardState?.leaderboardHistory?.[active]?.[dataKey]?.map((score, index) => {
                                const betAmount = score.leaderboard?.[active]?.[dataKey]?.betAmount ?? 0;
                                const winAmount = score.leaderboard?.[active]?.[dataKey]?.winAmount ?? 0;
                                const profit = (winAmount - betAmount).toFixed(2);

                                return (
                                    <TableRow
                                        key={index}
                                        className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                                    >
                                        <TableCell className="w-1/5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {index + 1 <= 3 && (
                                                    <img
                                                        src={`/assets/medal/top${index + 1}.svg`}
                                                        className="h-5 w-5"
                                                    />
                                                )}
                                                <span>{index + 1}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/5">
                                            <div className="flex items-center gap-2">
                                                <span>{score.username}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/5 text-center">
                                            {Number(betAmount).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="w-1/5">
                                            <div className="flex items-center justify-center gap-1">
                                                {Number(winAmount).toFixed(2)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/5">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className={Number(profit) >= 0 ? "text-white" : "text-purple"}>
                                                    {profit}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default function LeaderboardSection() {
    const dispatch = useAppDispatch();
    const [active, setActive] = useState(leaderboardTabs[0].value);

    useEffect(() => {
        dispatch(leaderboardActions.subscribeLeaderboardServer());
    }, []);

    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex flex-col items-stretch gap-8 p-12">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-gray300">Leaderboard</div>
                    <div className="flex items-center gap-2 bg-transparent">
                        {leaderboardTabs.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setActive(item.value)}
                                className={`rounded-md border border-blue-border bg-dark-blue px-6 py-2 text-sm  ${active === item.value ? "bg-purple text-white" : "text-gray400"}`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                        <LeaderboardCard title="USK" dataKey="usk" />
                        <LeaderboardCard title="KART" dataKey="kart" />
                    </div>
                    <div className="">
                        {active === "crash" && (
                            <div className="flex transition-all ease-in-out">
                                <div className="relative rounded-md">
                                    <img
                                        src={CrashBanner}
                                        alt="Crash Banner"
                                        className="aspect-auto h-full w-full rounded-md"
                                    />
                                    <img
                                        src={CrashTitle}
                                        alt="Crash Title"
                                        className="absolute right-2 top-2 mt-auto"
                                    />
                                    <Link to="/crash">
                                        <img
                                            src={PlayText}
                                            alt="Play Text"
                                            className="absolute bottom-4 left-7 mt-auto cursor-pointer shadow-dark-blue-0.4 ease-in-out hover:shadow-lg hover:transition-all md:hover:scale-[1.3]"
                                        />
                                    </Link>
                                </div>
                            </div>
                        )}
                        {active === "coinflip" && (
                            <div className="flex transition-all ease-in-out">
                                <div className="relative rounded-md">
                                    <img
                                        src={CoinflipBanner}
                                        alt="Crash Banner"
                                        className="aspect-auto h-full w-full rounded-lg"
                                    />
                                    <img
                                        src={CoinflipTitle}
                                        alt="Crash Title"
                                        className="absolute right-2 top-2 mt-auto w-32"
                                    />
                                    <Link to="/coinflip">
                                        <img
                                            src={PlayText}
                                            alt="Play Text"
                                            className="absolute bottom-4 left-7 mt-auto cursor-pointer shadow-dark-blue-0.4 ease-in-out hover:shadow-lg hover:transition-all md:hover:scale-[1.3]"
                                        />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
