"use client";

import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { EFilterDate, ERevenueType, token_currency } from "@/constants/data";
import { axiosPost } from "@/utils/axios";
import { useEffect, useState } from "react";
import { getMonthName, getDayName } from "@/utils/utils";

export default function DashboardChart({
  date,
  revenueType,
}: {
  date: EFilterDate;
  revenueType: ERevenueType;
}) {
  const [adminUSKBalance, setAdminUSKBalance] = useState<number[]>([]);
  const [adminKartBalance, setAdminKartBalance] = useState<number[]>([]);
  const [chartXData, setChartXData] = useState<string[]>([]);
  const [kart_currency, setKartCurrency] = useState<number>(0);

  const getDashboardData = async () => {
    try {
      const currentHour = new Date().getHours();
      const currentDay = new Date().getDate();
      const currentMonth = new Date().getMonth() + 1;
      const response = await axiosPost(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/dashboard/dashboard-history?date=${date}&revenueType=${revenueType}`
      );

      const fetchedKartBalance = response?.kartLogs.map((item) =>
        (item.lastBalance * response?.kart_currency).toFixed(2)
      );

      setKartCurrency(response?.kart_currency);

      const fetchedUskBalance = response?.uskLogs.map((item) =>
        (item.lastBalance * token_currency.usk).toFixed(2)
      );

      if (fetchedKartBalance.length === 0 && fetchedUskBalance.length === 0) {
        return;
      }

      const tempXData: string[] = [];

      const maxLength = Math.max(
        fetchedKartBalance.length,
        fetchedUskBalance.length
      );

      while (fetchedKartBalance.length < maxLength) {
        fetchedKartBalance.unshift(fetchedKartBalance[0]);
      }

      while (fetchedUskBalance.length < maxLength) {
        fetchedUskBalance.unshift(fetchedUskBalance[0]);
      }

      if (date === EFilterDate.hour) {
        for (let i = 0; i < maxLength; i++) {
          const minutesAgo = i * 5;
          const date = new Date();
          date.setMinutes(date.getMinutes() - minutesAgo);
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          tempXData.unshift(`${hours}:${minutes}`);
        }
      } else if (date === EFilterDate.day) {
        for (let i = 0; i < maxLength; i++) {
          const hour = (currentHour - i + 24) % 24;
          tempXData.unshift(`${hour.toString().padStart(2, "0")}h`);
        }
      } else if (date === EFilterDate.week) {
        for (let i = 0; i < maxLength; i++) {
          tempXData.unshift(getDayName(currentDay - i));
        }
      } else if (date === EFilterDate.month) {
        for (let i = 0; i < maxLength; i++) {
          tempXData.unshift(`${getMonthName(currentMonth)}/${currentDay - i}`);
        }
      } else {
        for (let i = 0; i < maxLength; i++) {
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
  }, [date, revenueType]);

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
        fontFamily: "Montserrat",
        labels: {
          colors: ["#0BA544", "#ff149d"],
        },
        markers: {
          fillColors: ["#0BA544", "#ff149d"],
        },
      },
      tooltip: {
        marker: {
          show: true,
          fillColors: ["#0BA544", "#ff149d"],
        },
        y: {
          formatter: function (value, { seriesIndex }) {
            if (seriesIndex === 0) {
              return (Number(value) / kart_currency).toFixed(2);
            } else if (seriesIndex === 1) {
              return Number(value).toFixed(2);
            }
            return value;
          },
        },
      },
    },
    series: [
      {
        name: "KART",
        data: adminKartBalance,
      },
      {
        name: "USK",
        data: adminUSKBalance,
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
