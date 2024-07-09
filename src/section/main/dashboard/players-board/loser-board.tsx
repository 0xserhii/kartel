import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LoserBoard({ losers }: { losers: any }) {
  return (
    <div className="flex w-full flex-col">
      <p className="p-3 text-xl font-semibold text-gray300">Top Losers</p>
      <ScrollArea className="h-88 w-full overflow-x-auto rounded-lg border border-purple-0.5 bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">
        <div className="w-full min-w-[500px] p-5">
          <Table className="relative table-fixed border-separate border-spacing-y-3">
            <TableHeader>
              <TableRow className="!bg-transparent text-gray300">
                <TableCell className="w-1/5 text-center">No.</TableCell>
                <TableCell className="w-2/5">User</TableCell>
                <TableCell className="w-1/5 text-center">Bet Amount</TableCell>
                <TableCell className="w-1/5 text-center">Win Amount</TableCell>
                <TableCell className="w-1/5 text-center">Loss</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {losers?.map((score, index) => {
                return (
                  <TableRow
                    key={index}
                    className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                  >
                    <TableCell className="w-1/5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell className="w-2/5">
                      <span>{score.username}</span>
                    </TableCell>
                    <TableCell className="w-1/5 text-center">
                      {Number(
                        (score.leaderboard?.crash?.usk?.betAmount ?? 0) +
                          (score.leaderboard?.crash?.kart?.betAmount ?? 0)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell className="w-1/5 text-center">
                      {Number(
                        (score.leaderboard?.crash?.usk?.winAmount ?? 0) +
                          (score.leaderboard?.crash?.kart?.winAmount ?? 0)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell className="w-1/5">
                      <div className="flex items-center justify-center gap-1">
                        <span>
                          {(() => {
                            const winAmount =
                              (score.leaderboard?.crash?.usk?.winAmount ?? 0) +
                              (score.leaderboard?.crash?.kart?.winAmount ?? 0);
                            const betAmount =
                              (score.leaderboard?.crash?.usk?.betAmount ?? 0) +
                              (score.leaderboard?.crash?.kart?.betAmount ?? 0);
                            const loss = (winAmount - betAmount).toFixed(2);
                            return (
                              <span
                                className={
                                  Number(loss) >= 0
                                    ? "text-white"
                                    : "text-purple"
                                }
                              >
                                {loss}
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
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
