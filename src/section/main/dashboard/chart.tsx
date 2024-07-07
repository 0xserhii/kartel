"use client";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useAppSelector } from "@/store/redux";
import { gameLists } from "@/constants/data";

export default function DashboardChart() {
    const dashboardState = useAppSelector((state: any) => state.dashboard);
    const lastBalances = Array.isArray(dashboardState.dashboardHistory)
        ? dashboardState.dashboardHistory.map(item => item.lastBalance)
        : [];
    const xAxisLabels = Array.isArray(dashboardState.dashboardHistory)
        ? dashboardState.dashboardHistory.map(item => {
            const date = new Date(item.created);
            return `${date.getDate()}/${date.getMonth() + 1}`; // Format as "day/month"
        })
        : [];

    const chartData = {
        options: {
            chart: {
                id: "basic-bar",
                toolbar: {
                    show: false
                }
            },
            grid: {
                show: true,
                borderColor: '#556987',
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
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
                categories: xAxisLabels,
                labels: {
                    style: {
                        colors: '#556987'
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                colors: ['#0BA544'],
                width: 3
            },
            markers: {
                size: 5,
                colors: ['#0BA544'],
                strokeWidth: 2,
                hover: {
                    size: 7,
                }
            }
        },
        series: [
            {
                name: gameLists[0].name,
                data: lastBalances
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