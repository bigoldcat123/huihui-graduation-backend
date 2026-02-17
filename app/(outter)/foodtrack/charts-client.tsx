"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

type PieDatum = {
  name: string;
  value: number;
};

type FoodTrackChartsClientProps = {
  pieData: PieDatum[];
};

export function FoodTrackChartsClient({ pieData }: FoodTrackChartsClientProps) {
  const pieChartRef = useRef<HTMLDivElement | null>(null);
  const lineChartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pieChartRef.current || !lineChartRef.current) {
      return;
    }

    const pieChart = echarts.init(pieChartRef.current);
    const lineChart = echarts.init(lineChartRef.current);
    const isPhone = pieChartRef.current.clientWidth <= 420;
    const effectivePieData = pieData.length ? pieData : [{ name: "No Data", value: 1 }];

    const pieOption: EChartsOption = {
      title: {
        text: "Tag Liked Values",
        subtext: "from /tag/liked-values",
        left: "center",
        top: 10,
        textStyle: {
          fontSize: isPhone ? 14 : 18,
        },
        subtextStyle: {
          fontSize: isPhone ? 11 : 12,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        type: "scroll",
        orient: isPhone ? "horizontal" : "vertical",
        left: isPhone ? 12 : undefined,
        right: isPhone ? 12 : 10,
        top: isPhone ? undefined : 20,
        bottom: isPhone ? 10 : 20,
        itemWidth: isPhone ? 10 : 14,
        itemHeight: isPhone ? 8 : 10,
        textStyle: {
          fontSize: isPhone ? 10 : 12,
        },
        data: effectivePieData.map((item) => item.name),
      },
      series: [
        {
          name: "Tag",
          type: "pie",
          radius: isPhone ? "50%" : "55%",
          center: isPhone ? ["50%", "43%"] : ["40%", "50%"],
          data: effectivePieData,
          label: {
            fontSize: isPhone ? 10 : 12,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    const lineOption: EChartsOption = {
      title: {
        text: "Weekly Trend",
        left: "center",
        top: 8,
        textStyle: {
          fontSize: isPhone ? 13 : 16,
        },
      },
      grid: {
        left: 36,
        right: 16,
        top: 44,
        bottom: 30,
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        trigger: "axis",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
          smooth: true,
        },
      ],
    };

    pieChart.setOption(pieOption);
    lineChart.setOption(lineOption);

    const onResize = () => {
      pieChart.resize();
      lineChart.resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      pieChart.dispose();
      lineChart.dispose();
    };
  }, [pieData]);

  return (
    <div className="flex min-h-screen items-start justify-center bg-[url(/bg.png)] bg-cover bg-center p-3 pt-12 pb-6">
      <div className="flex w-full max-w-[390px] flex-col gap-4">
        <div className="h-[430px] overflow-hidden rounded-3xl border bg-background/90 shadow-2xl">
          <div ref={pieChartRef} className="h-full w-full" />
        </div>
        <div className="h-[260px] overflow-hidden rounded-3xl border bg-background/90 shadow-2xl">
          <div ref={lineChartRef} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
