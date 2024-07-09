import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function WinnerBoard({ winners }: { winners: any }) {
  return (
    <div className="flex w-6/12 flex-col">
      <p className="p-3 text-xl font-semibold text-gray300">Top Winners</p>
      <Card className="w-full border-purple-0.15 bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-b-purple-0.5 px-7 py-3 text-base font-semibold text-gray500">
          <Table className="w-full table-fixed">
            <TableBody>
              <TableRow className="!bg-transparent">
                <TableCell className="w-1/5 text-center">No.</TableCell>
                <TableCell className="w-1/5">User</TableCell>
                <TableCell className="w-1/5 text-center">Bet Amount</TableCell>
                <TableCell className="w-1/5 text-center">Win Amount</TableCell>
                <TableCell className="w-1/5 text-center">Profit</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardHeader>
        <CardContent className="px-2 py-0">
          <ScrollArea className="h-88 px-5 py-3">
            <Table className="relative table-fixed border-separate border-spacing-y-3">
              <TableBody>
                {winners?.map((score, index) => {
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
                        {Number(
                          (score.leaderboard?.crash?.usk?.betAmount ?? 0) +
                            (score.leaderboard?.crash?.kart?.betAmount ?? 0)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="w-1/5">
                        <div className="flex items-center justify-center gap-1">
                          {Number(
                            (score.leaderboard?.crash?.usk?.winAmount ?? 0) +
                              (score.leaderboard?.crash?.kart?.winAmount ?? 0)
                          ).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="w-1/5">
                        <div className="flex items-center justify-center gap-1">
                          <span>
                            {(() => {
                              const winAmount =
                                (score.leaderboard?.crash?.kart?.winAmount ??
                                  0) +
                                (score.leaderboard?.crash?.usk?.winAmount ?? 0);
                              const betAmount =
                                (score.leaderboard?.crash?.kart?.betAmount ??
                                  0) +
                                (score.leaderboard?.crash?.usk?.betAmount ?? 0);

                              const profit = (winAmount - betAmount).toFixed(2);
                              return (
                                <span
                                  className={
                                    Number(profit) >= 0
                                      ? "text-white"
                                      : "text-purple"
                                  }
                                >
                                  {profit}
                                </span>
                              );
                            })()}
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
    </div>
  );
}
