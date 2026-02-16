"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

function genData(count: number) {
  const nameList = [
    "赵",
    "钱",
    "孙",
    "李",
    "周",
    "吴",
    "郑",
    "王",
    "冯",
    "陈",
    "褚",
    "卫",
    "蒋",
    "沈",
    "韩",
    "杨",
    "朱",
    "秦",
    "尤",
    "许",
    "何",
    "吕",
    "施",
    "张",
    "孔",
    "曹",
    "严",
    "华",
    "金",
    "魏",
    "陶",
    "姜",
    "戚",
    "谢",
    "邹",
    "喻",
    "柏",
    "水",
    "窦",
    "章",
    "云",
    "苏",
    "潘",
    "葛",
    "奚",
    "范",
    "彭",
    "郎",
    "鲁",
    "韦",
    "昌",
    "马",
    "苗",
    "凤",
    "花",
    "方",
    "俞",
    "任",
    "袁",
    "柳",
    "酆",
    "鲍",
    "史",
    "唐",
    "费",
    "廉",
    "岑",
    "薛",
    "雷",
    "贺",
    "倪",
    "汤",
    "滕",
    "殷",
    "罗",
    "毕",
    "郝",
    "邬",
    "安",
    "常",
    "乐",
    "于",
    "时",
    "傅",
    "皮",
    "卞",
    "齐",
    "康",
    "伍",
    "余",
    "元",
    "卜",
    "顾",
    "孟",
    "平",
    "黄",
    "和",
    "穆",
    "萧",
    "尹",
    "姚",
    "邵",
    "湛",
    "汪",
    "祁",
    "毛",
    "禹",
    "狄",
    "米",
    "贝",
    "明",
    "臧",
    "计",
    "伏",
    "成",
    "戴",
    "谈",
    "宋",
    "茅",
    "庞",
    "熊",
    "纪",
    "舒",
    "屈",
    "项",
    "祝",
    "董",
    "梁",
    "杜",
    "阮",
    "蓝",
    "闵",
    "席",
    "季",
    "麻",
    "强",
    "贾",
    "路",
    "娄",
    "危",
  ];

  const legendData: string[] = [];
  const seriesData: { name: string; value: number }[] = [];

  const makeWord = (max: number, min: number) => {
    const nameLen = Math.ceil(Math.random() * max + min);
    const name: string[] = [];
    for (let i = 0; i < nameLen; i++) {
      name.push(nameList[Math.floor(Math.random() * nameList.length)]);
    }
    return name.join("");
  };

  for (let i = 0; i < count; i++) {
    const name =
      Math.random() > 0.65 ? `${makeWord(4, 1)}·${makeWord(3, 0)}` : makeWord(2, 1);
    legendData.push(name);
    seriesData.push({
      name,
      value: Math.round(Math.random() * 100000),
    });
  }

  return { legendData, seriesData };
}

export default function FoodTrackPage() {
  const pieChartRef = useRef<HTMLDivElement | null>(null);
  const lineChartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pieChartRef.current || !lineChartRef.current) {
      return;
    }

    const pieChart = echarts.init(pieChartRef.current);
    const lineChart = echarts.init(lineChartRef.current);
    const data = genData(50);
    const isPhone = pieChartRef.current.clientWidth <= 420;
    const pieOption: EChartsOption = {
      title: {
        text: "同名数量统计",
        subtext: "纯属虚构",
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
        data: data.legendData,
      },
      series: [
        {
          name: "姓名",
          type: "pie",
          radius: isPhone ? "50%" : "55%",
          center: isPhone ? ["50%", "43%"] : ["40%", "50%"],
          data: data.seriesData,
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
  }, []);

  return (
    <div className="flex min-h-screen items-start justify-center bg-[url(/bg.png)] bg-cover bg-center p-3 py-6">
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
