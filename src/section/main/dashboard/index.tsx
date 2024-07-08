"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardChart from "./chart";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/redux";
import { useEffect, useState } from "react";
import { dashboardActions } from "@/store/redux/actions";
import { EFilterDate, TokenBalances, dateFilter, gameLists, initialBalance, token } from "@/constants/data";
import WinnerBoard from "./players-board/winner-board";
import LoserBoard from "./players-board/loser-board";
import { axiosGet } from "@/utils/axios";

export default function DashboardSection() {
    const dispatch = useDispatch();
    const dashboardState = useAppSelector((state: any) => state.dashboard);
    const [adminWallet, setAdminWallet] = useState<TokenBalances>(initialBalance);
    const [filterDate, setFilterDate] = useState<EFilterDate>(EFilterDate.hour);

    const getAdminBalance = async () => {
        try {
            const response = await axiosGet(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/user/admin-wallet`
            );
            const walletDataRes = {
                usk: response?.balance?.usk ?? 0,
                kart: response?.balance?.kart ?? 0,
            };
            setAdminWallet(walletDataRes);
        } catch (error) {
            console.error("Failed to get balance:", error);
        }
    };

    useEffect(() => {
        if (dashboardState.dashboardHistory) {
            dispatch(dashboardActions.subscribeDashboardServer());
        }
    }, []);

    useEffect(() => {
        getAdminBalance();
    }, [dashboardState.dashboardHistory]);

    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex flex-col items-stretch gap-4 p-12">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-gray300">Dashboard</div>
                </div>
                <div className="flex w-full justify-end items-center gap-2">
                    <div className="flex flex-row gap-5">
                        {token.map((token) => (
                            <div key={token.name} className="flex flex-row items-center gap-2">
                                <img src={`/assets/tokens/${token.name}.png`} className="h-7 w-7" />
                                <span className="w-4/12 text-center text-gray-300">
                                    {Number(
                                        adminWallet[token.name]
                                    ).toFixed(2) ?? 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col w-full gap-5">
                    <Card className="w-full border-purple-0.15 bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm p-10 h-[500px]">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row">
                                {gameLists.map((game, index) => (
                                    <div key={index} className="flex flex-row gap-2 items-center">
                                        <div className={`rounded-sm w-4 h-4 bg-[${game.color}]`}></div>
                                        <span className="text-gray300 text-sm capitalize">{game.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row gap-5">
                                {dateFilter.map((date, index) => (
                                    <button key={index} className={`text-white rounded-lg text-sm py-1 px-2 ${filterDate === date.value ? 'bg-purple' : 'bg-transparent'}`} onClick={() => setFilterDate(date.value)}>
                                        {date.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <DashboardChart date={filterDate} />
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