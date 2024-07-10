"use client";

import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { EFilterDate, token_currency } from "@/constants/data";
import { axiosPost } from "@/utils/axios";
import { useEffect, useState } from "react";
import { getMonthName, getDayName } from "@/utils/utils";

export default function DashboardChart({ date }: { date: EFilterDate }) {
  const [adminUSKBalance, setAdminUSKBalance] = useState<number[]>([]);
  const [adminKartBalance, setAdminKartBalance] = useState<number[]>([]);
  const [chartXData, setChartXData] = useState<string[]>([]);

  const getDashboardData = async () => {
    try {
      const currentHour = new Date().getHours();
      const currentDay = new Date().getDate();
      const currentMonth = new Date().getMonth() + 1;
      const response = await axiosPost(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/dashboard/dashboard-update?date=${date}&eventType=3`
      );

      const fetchedKartBalance = response
        .filter((item) => item.denom === 'kart')
        .map((item) => (item.lastBalance.toFixed(2) * token_currency.kart));

      const fetchedUskBalance = response
        .filter((item) => item.denom === 'usk')
        .map((item) => item.lastBalance.toFixed(2));

      if ((!fetchedKartBalance || fetchedKartBalance.length == 0) &&
        (!fetchedUskBalance || fetchedUskBalance.length == 0)) {
        return;
      }

      const tempXData: string[] = [];

      if (fetchedKartBalance.length === 1) {
        fetchedKartBalance.unshift(fetchedKartBalance[0]);
      }

      if (fetchedUskBalance.length === 1) {
        fetchedUskBalance.unshift(fetchedUskBalance[0]);
      }

      if (date === EFilterDate.hour) {
        for (let i = 0; i < fetchedKartBalance?.length; i++) {
          const minutesAgo = i * 5;
          const date = new Date();
          date.setMinutes(date.getMinutes() - minutesAgo);
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          tempXData.unshift(`${hours}:${minutes}`);
        }
      } else if (date === EFilterDate.day) {
        for (let i = 0; i < fetchedKartBalance?.length; i++) {
          const hour = (currentHour - i + 24) % 24;
          tempXData.unshift(`${hour.toString().padStart(2, "0")}h`);
        }
      } else if (date === EFilterDate.week) {
        for (let i = 0; i < fetchedKartBalance?.length; i++) {
          tempXData.unshift(getDayName(currentDay - i));
        }
      } else if (date === EFilterDate.month) {
        for (let i = 0; i < fetchedKartBalance?.length; i++) {
          tempXData.unshift(`${getMonthName(currentMonth)}/${currentDay - i}`);
        }
      } else {
        for (let i = 0; i < fetchedKartBalance?.length; i++) {
          tempXData.unshift(`${getMonthName(currentMonth - i)}`);
        }
      }
      setAdminKartBalance(fetchedKartBalance);
      setAdminUSKBalance(fetchedUskBalance);
      setChartXData(tempXData);
    } catch (error) {
      console.error("Failed to get balance:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [date]);

  const chartData = {
    options: {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            if (value !== undefined && value !== null) {
              return value.toFixed(2);
            }
            return value;
          },
          style: {
            colors: "#556987",
          },
        },
      },
      xaxis: {
        categories: chartXData,
        labels: {
          style: {
            colors: "#556987",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 5,
        colors: ["#0BA544", "#ff149d"],
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      stroke: {
        colors: ["#0BA544", "#ff149d"],
        width: 3,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Poppins",
        labels: {
          colors: ["#0BA544", "#ff149d"],
        },
        markers: {
          fillColors: ["#0BA544", "#ff149d"],
        },
      },
    },
    series: [
      {
        name: "KART",
        data: adminKartBalance as any,
      },
      {
        name: "USK",
        data: adminUSKBalance as any,
      },
    ],
  };

  return (
    <Chart
      options={chartData.options as ApexOptions}
      series={chartData.series}
      type="line"
      width="100%"
      height="100%"
    />
  );
}
