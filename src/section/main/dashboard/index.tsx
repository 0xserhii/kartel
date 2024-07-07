"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardChart from "./chart";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/redux";
import { useEffect } from "react";
import { dashboardActions } from "@/store/redux/actions";
import { gameLists } from "@/constants/data";
import WinnerBoard from "./players-board/winner-board";
import LoserBoard from "./players-board/loser-board";

const sampeleWalletData = {
    usk: 2000,
    kart: 2000
}

export default function DashboardSection() {
    const dispatch = useDispatch();
    const dashboardState = useAppSelector((state: any) => state.dashboard);
    useEffect(() => {
        if (dashboardState.dashboardHistory) {
            dispatch(dashboardActions.subscribeDashboardServer());
        }
    }, []);
    console.log(dashboardState.topPlayers);

    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex flex-col items-stretch gap-4 p-12">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-gray300">Dashboard</div>
                </div>
                <div className="flex w-full justify-end items-center gap-2">
                    <div className="flex flex-col gap-2">
                        {sampeleWalletData &&
                            Object.entries(sampeleWalletData).map(([tokenName], index) => (
                                <div
                                    key={index}
                                    className="flex flex-row items-center gap-5"
                                >
                                    <img
                                        src={`/assets/tokens/${tokenName}.png`}
                                        className="h-6 w-6"
                                    />
                                    <span className="flex w-4/12 flex-row items-center gap-3 uppercase text-gray-300">
                                        {tokenName}
                                    </span>
                                    <span className="w-4/12 text-center text-gray-300">
                                        {sampeleWalletData[tokenName]}
                                    </span>
                                    <span className="w-4/12 text-center text-white">
                                        {sampeleWalletData[tokenName]}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="flex flex-col w-full gap-5">
                    <Card className="w-full border-purple-0.15 bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm p-10 h-[500px]">
                        <DashboardChart />
                        <div className="">
                            {gameLists.map((game, index) => (
                                <div key={index} className="flex flex-row gap-2 items-center">
                                    <div className={`rounded-md w-4 h-4 bg-[${game.color}]`}></div>
                                    <span className="text-gray300 text-sm">{game.name}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <div className="flex flex-row gap-5">
                        <WinnerBoard winners={dashboardState?.topPlayers?.crash?.winners} />
                        <LoserBoard losers={dashboardState?.topPlayers?.crash?.losers} />
                    </div>
                </div>
            </div>
        </ScrollArea>
    )
}