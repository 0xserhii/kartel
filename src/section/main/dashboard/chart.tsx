"use client";

import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { EFilterDate, gameLists } from "@/constants/data";
import { axiosPost } from "@/utils/axios";
import { useEffect, useState } from "react";
import { getMonthName, getDayName } from "@/utils/utils";


export default function DashboardChart({ date }: { date: EFilterDate }) {
    const [adminBalance, setAdminBalance] = useState<number[]>([]);
    const [chartXData, setChartXData] = useState<string[]>([]);

    const getDashboardData = async () => {
        try {
            const currentHour = (new Date()).getHours();
            const currentDay = (new Date()).getDate();
            const currentMonth = (new Date()).getMonth() + 1;
            const response = await axiosPost(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/dashboard/dashboard-update?date=${date}&eventType=3`
            );

            const fetchedAdminBalance = response.map(item => (item.lastBalance).toFixed(2));
            if (!fetchedAdminBalance || fetchedAdminBalance.length == 0) {
                return;
            }
            let tempXData: string[] = []
            if (fetchedAdminBalance.length === 1) {
                fetchedAdminBalance.unshift(fetchedAdminBalance[0])
            }
            if (date === EFilterDate.hour) {
                for (let i = 0; i < fetchedAdminBalance?.length; i++) {
                    const minutesAgo = i * 5;
                    const date = new Date();
                    date.setMinutes(date.getMinutes() - minutesAgo);
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    tempXData.unshift(`${hours}:${minutes}`);
                }
            } else if (date === EFilterDate.day) {
                for (let i = 0; i < fetchedAdminBalance?.length; i++) {
                    tempXData.unshift((`${(currentHour - i).toString().padStart(2, '0')}h`))
                }
            } else if (date === EFilterDate.week) {
                for (let i = 0; i < fetchedAdminBalance?.length; i++) {
                    tempXData.unshift(getDayName(currentDay - i));
                }
            } else if (date === EFilterDate.month) {
                for (let i = 0; i < fetchedAdminBalance?.length; i++) {
                    tempXData.unshift((`${getMonthName(currentMonth)}/${(currentDay - i)}`))
                }
            } else {
                for (let i = 0; i < fetchedAdminBalance?.length; i++) {
                    tempXData.unshift((`${getMonthName(currentMonth - i)}`));
                }
            }
            setAdminBalance(fetchedAdminBalance);
            setChartXData(tempXData)
        } catch (error) {
            console.error("Failed to get balance:", error);
        }
    }

    useEffect(() => {
        getDashboardData();
    }, [date]);

    const chartData = {
        options: {
            chart: {
                id: "basic-bar",
                toolbar: {
                    show: false
                }
            },
            grid: {
                show: false
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return value.toFixed(2);
                    },
                    style: {
                        colors: '#556987'
                    }
                },
            },
            xaxis: {
                categories: chartXData,
                labels: {
                    style: {
                        colors: '#556987'
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 5,
                colors: ['#0BA544'],
                strokeWidth: 2,
                hover: {
                    size: 7,
                }
            },
            stroke: {
                colors: ['#0BA544'],
                width: 3
            },
        },
        series: [
            {
                name: gameLists[0].name,
                data: adminBalance as any
            }
        ]
    };

    return (
        <Chart
            options={chartData.options as ApexOptions}
            series={chartData.series}
            type="line"
            width="100%"
            height="100%"
        />
    )
}