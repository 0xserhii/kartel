import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const BetBoard = ({ betData, betCashout }: { betData: any, betCashout: any }) => {
    return (
        <Card className=" border-purple-0.15 bg-dark bg-opacity-80 shadow-purple-0.5 drop-shadow-sm">

            <CardHeader className="flex flex-row items-center justify-between border-b border-b-purple-0.5 px-7 py-3 text-base font-semibold text-gray500">
                <Table className="w-full table-fixed">
                    <TableBody>
                        <TableRow className="!bg-transparent">
                            <TableCell className="w-6/12 text-start">
                                User
                            </TableCell>
                            <TableCell className="w-1/6">Cash Out</TableCell>
                            <TableCell className="w-1/6 text-center">
                                Bet Amount
                            </TableCell>
                            <TableCell className="w-1/6 text-center">
                                Profit
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardHeader>
            <CardContent className="px-2 py-0">
                <ScrollArea className="h-[280px] px-5 py-3">
                    <Table className="relative table-fixed border-separate border-spacing-y-3 overflow-y-hidden ">
                        <TableBody>
                            {betData
                                ?.sort((a, b) => b.betAmount - a.betAmount)
                                .map((player, index) => (
                                    <TableRow
                                        key={index}
                                        className="text-gray300 [&_td:first-child]:rounded-l-md [&_td:first-child]:border-l [&_td:first-child]:border-l-purple-0.5 [&_td:last-child]:rounded-r-md [&_td:last-child]:border-r [&_td:last-child]:border-r-purple-0.5 [&_td]:border-b [&_td]:border-t [&_td]:border-b-purple-0.5 [&_td]:border-t-purple-0.5 [&_td]:bg-dark-blue"
                                    >
                                        <TableCell className="w-1/2">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src="/assets/icons/avatar.png"
                                                    alt="User"
                                                    className="h-8 w-8 rounded-full"
                                                />
                                                <span>{player.username}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/6 text-center">
                                            {(betCashout?.find(
                                                (item) =>
                                                    item.playerID === player.playerID
                                            )?.stoppedAt &&
                                                (
                                                    (betCashout?.find(
                                                        (item) =>
                                                            item.playerID === player.playerID
                                                    )?.stoppedAt ?? 0) / 100
                                                ).toFixed(2) + 'x') ||
                                                'betting'}
                                        </TableCell>
                                        <TableCell className="w-1/6 text-center">
                                            <div className="flex w-full flex-row items-center justify-center gap-1 text-center">
                                                <img
                                                    src={`/assets/tokens/${player.denom}.png`}
                                                    alt="Multiplier"
                                                    className="h-4 w-4"
                                                />
                                                {player.betAmount}
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/6 text-center">
                                            {betCashout?.find(
                                                (item) =>
                                                    item.playerID === player.playerID
                                            )?.stoppedAt ? (
                                                <div className="flex flex-row items-center justify-center gap-1">
                                                    <img
                                                        src={`/assets/tokens/${betCashout.find((item) => item.playerID === player.playerID)?.denom}.png`}
                                                        alt="Multiplier"
                                                        className="h-4 w-4"
                                                    />
                                                    {(
                                                        ((betCashout?.find(
                                                            (item) =>
                                                                item.playerID === player.playerID
                                                        )?.stoppedAt ?? 0) /
                                                            100) *
                                                        player.betAmount
                                                    ).toFixed(2)}
                                                </div>
                                            ) : (
                                                <span>betting</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default BetBoard;