import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrashBanner from '/assets/crash-banner.svg';
import CoinflipBanner from '/assets/banner-bg.png';
import CoinflipTitle from '/assets/coinflip-title.png';
import CrashTitle from '/assets/crash-title.png';
import PlayText from '/assets/play-text.svg';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ScrollBar, ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { ILeaderboardClientToServerEvents, ILeaderboardServerToClientEvents } from '@/types/leader';
import { LeaderboardType } from '@/types/leaderboard';

interface ILeaderType {
  _id: string;
  username: string;
  rank: number,
  hasVerifiedAccount: boolean,
  createdAt: string,
  leaderboard: LeaderboardType
}

export default function Leaderboard() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [leaderboards, setLeaderboards] = useState<ILeaderType[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const leaderBoardSocket: Socket<
      ILeaderboardServerToClientEvents,
      ILeaderboardClientToServerEvents
    > = io(`${SERVER_URL}/leaderboard`);

    leaderBoardSocket.on('leaderboard-fetch-all', (data) => {
      if (data.leaderboard?.crash) {
        setLoading(false);
        setLeaderboards(data.leaderboard?.crash);
      }


    });

    return () => {
      leaderBoardSocket.disconnect();
    };
  }, []);
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <Tabs
        defaultValue="crash"
        className="flex flex-col items-stretch gap-8 p-12"
      >
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray300">
            LEADER BOARD
          </div>
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
                  <TableCell className="w-3/12 text-center">No.</TableCell>
                  <TableCell className="w-3/12">User</TableCell>
                  <TableCell className="w-3/12 text-center">
                    Bet Amount
                  </TableCell>
                  <TableCell className="w-3/12 text-center">Win Amount</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardHeader>
          <CardContent className={`px-2 py-0 ${loading ? 'opacity-50 h-[536px]' : ''}`}>
            {loading ? (
              <div className='flex justify-center items-center h-full w-full'>
                <div className="small-loading">
                  <svg viewBox="10 10 20 20">
                    <circle r="7" cy="20" cx="20"></circle>
                  </svg>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-88 px-5 py-3">
                <Table className="relative table-fixed border-separate border-spacing-y-3">

                  <TableBody>
                    {leaderboards?.map((score, index) => {
                      return (
                        <TableRow
                          key={index}
                          className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                        >
                          <TableCell className="w-3/12 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {(index + 1) <= 3 && (
                                <img src={`/assets/medal/top${index + 1}.svg`} className='w-5 h-5' />
                              )}
                              <span>{index + 1}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-3/12">
                            <div className="flex items-center gap-2">
                              <span>{score.username}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-3/12 text-center">
                            {Number((score.leaderboard?.crash?.usk?.betAmount ?? 0) + (score.leaderboard?.crash?.kuji?.betAmount ?? 0)).toFixed(2)}
                          </TableCell>
                          <TableCell className="w-3/12">
                            <div className="flex items-center justify-center gap-1">
                              {Number((score.leaderboard?.crash?.usk?.winAmount ?? 0) + (score.leaderboard?.crash?.kuji?.winAmount ?? 0)).toFixed(2)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>)}
          </CardContent>
        </Card>

        <TabsContent value="crash">
          <div className="relative rounded-md">
            <img
              src={CrashBanner}
              alt="Crash Banner"
              className="aspect-auto w-full rounded-md"
            />
            <img
              src={CrashTitle}
              alt="Crash Title"
              className="absolute right-2 top-2 mt-auto"
            />
            <Link to='/crash'>
              <img
                src={PlayText}
                alt="Play Text"
                className="absolute bottom-4 left-7 mt-auto shadow-dark-blue-0.4 ease-in-out hover:shadow-lg hover:transition-all md:hover:scale-[1.3] cursor-pointer"
              />
            </Link>
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
              alt="Play Text  "
              className="absolute bottom-4 left-7 mt-auto shadow-dark-blue-0.4 ease-in-out hover:shadow-lg hover:transition-all md:hover:scale-[1.3] cursor-pointer"
            />
          </div>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
}
