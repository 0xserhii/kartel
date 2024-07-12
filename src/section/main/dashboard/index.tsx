"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardChart from "./chart";
import { useEffect, useState } from "react";
import {
  EFilterDate,
  ERevenueType,
  TokenBalances,
  dateFilter,
  gameLists,
  initialBalance,
  token,
} from "@/constants/data";
import WinnerBoard from "./players-board/winner-board";
import LoserBoard from "./players-board/loser-board";
import { axiosGet } from "@/utils/axios";
export default function DashboardSection() {
  const [adminWallet, setAdminWallet] = useState<TokenBalances>(initialBalance);
  const [filterDate, setFilterDate] = useState<EFilterDate>(EFilterDate.hour);
  const [revenueType, setRevenueType] = useState<ERevenueType>(ERevenueType.CRASH);
  const [topLosers, setTopLosers] = useState<any>();
  const [topWinners, setTopWinners] = useState<any>();

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

  const getTopPlayers = async () => {
    try {
      const response = await axiosGet(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/dashboard/top-players`
      );
      setTopWinners(response?.crash?.winners);
      setTopLosers(response?.crash?.losers);
    } catch (error) {
      console.error("Failed to get balance:", error);
    }
  };

  useEffect(() => {
    getAdminBalance();
    getTopPlayers();
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex flex-col items-stretch gap-4 p-12">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray300">Dashboard</div>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <div className="flex flex-row gap-5">
            {token.map((token) => (
              <div
                key={token.name}
                className="flex flex-row items-center gap-2"
              >
                <img
                  src={`/assets/tokens/${token.name}.png`}
                  className="h-7 w-7"
                />
                <span className="w-4/12 text-center text-gray-300 text-lg font-bold">
                  {Number(adminWallet[token.name]).toFixed(2) ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-5">
          <Card className="h-[500px] w-full border-purple-0.15 bg-dark bg-opacity-80 p-10 shadow-purple-0.5 drop-shadow-sm">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-3">
                {gameLists.map((game, index) => (
                  <button
                    key={index}
                    className="flex flex-row items-center gap-2"
                    onClick={() => setRevenueType(game.value)}
                  >
                    <div
                      className={`h-4 w-4 rounded-sm bg-[${game.color}]`}
                    ></div>
                    <span className="text-sm capitalize text-gray300">
                      {game.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-row gap-5">
                {dateFilter.map((date, index) => (
                  <button
                    key={index}
                    className={`rounded-lg px-2 py-1 text-sm text-white ${filterDate === date.value ? "bg-purple" : "bg-transparent"}`}
                    onClick={() => setFilterDate(date.value)}
                  >
                    {date.title}
                  </button>
                ))}
              </div>
            </div>
            <DashboardChart date={filterDate} revenueType={revenueType} />
          </Card>
          <div className="grid w-full grid-cols-2 gap-5">
            <WinnerBoard winners={topWinners} />
            <LoserBoard losers={topLosers} />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
