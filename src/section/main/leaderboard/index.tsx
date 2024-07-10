import CrashBanner from "/assets/crash.jpg";
import CoinflipBanner from "/assets/coinflip.jpg";
import CoinflipTitle from "/assets/coinflip-title.png";
import CrashTitle from "/assets/crash-title.png";
import PlayText from "/assets/play-text.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { leaderboardActions } from "@/store/redux/actions";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { prizeMultiple, token_currency } from "@/constants/data";

const leaderboardTabs = [
  { title: "Crash", value: "crash" },
  // { title: 'Coinflip', value: 'coinflip' }
];

const LeaderboardCard = () => {
  const leaderboardState = useAppSelector((state: any) => state.leaderboard);
  const active = leaderboardTabs[0].value;

  return (
    <ScrollArea className="h-88 w-full overflow-x-auto rounded-lg border border-purple-0.5 bg-dark bg-opacity-80 p-5 shadow-purple-0.5 drop-shadow-sm">
      <div className="w-full min-w-[400px]">
        <Table className="relative table-fixed border-separate border-spacing-y-3">
          <TableHeader>
            <TableRow className="!bg-transparent text-gray300">
              <TableCell className="w-4/12 text-center">Rank</TableCell>
              <TableCell className="w-4/12 text-center">User</TableCell>
              <TableCell className="w-4/12 text-center">Played</TableCell>
              <TableCell className="w-4/12 text-center">Prize</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardState?.leaderboardHistory?.[active]?.map((score, index) => {
              const betAmount = ((score.leaderboard?.[active]?.kart?.betAmount ?? 0) * token_currency.kart) + (score.leaderboard?.[active]?.usk?.betAmount ?? 0);
              const prize = (betAmount * prizeMultiple).toFixed(2);

              return {
                ...score,
                prize: Number(prize).toFixed(2),
                betAmount: Number(betAmount).toFixed(2),
              };
            })
              .map((score, index) => (

                <TableRow
                  key={index}
                  className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                >
                  <TableCell className="w-4/12 text-center py-3">
                    <div className="flex items-center justify-center gap-2">
                      {index + 1 <= 3 ? (
                        <img
                          src={`/assets/medal/top${index + 1}.svg`}
                          className="h-5 w-5"
                        />
                      ) : (
                        <span>{index + 1 + "th"}</span>
                      )
                      }
                    </div>
                  </TableCell>
                  <TableCell className="w-4/12 truncate text-center">
                    {score.username}
                  </TableCell>
                  <TableCell className="w-4/12">
                    <div className="flex flex-row items-center justify-end gap-4 pr-[35%]">
                      <span className="truncate">
                        {score.betAmount}
                      </span>
                      <img
                        src={`/assets/coin-icon.svg`}
                        className="h-4 w-4"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="w-4/12">
                    <div className="flex flex-row items-center justify-end gap-4 pr-[35%]">
                      <span className="truncate">
                        {score.prize}
                      </span>
                      <img
                        src={`/assets/coin-icon.svg`}
                        className="h-4 w-4"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
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
          <div className="grid grid-cols-1 gap-3">
            <LeaderboardCard />
          </div>
          <div className="">
            {active === "crash" && (
              <div className="flex transition-all ease-in-out w-full">
                <div className="relative rounded-md w-full">
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
