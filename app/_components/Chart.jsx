"use client";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = {
  waterUsage: { stroke: "#0DA2E7", fill: "#D9F1FC" },
  text: "#888888",
  background: "#fff",
};

function DailyFeedConsumption({ weekUsage }) {
  const weekTemplate = [
    { day: "Mon", usage: 0 },
    { day: "Tue", usage: 0 },
    { day: "Wed", usage: 0 },
    { day: "Thu", usage: 0 },
    { day: "Fri", usage: 0 },
    { day: "Sat", usage: 0 },
    { day: "Sun", usage: 0 },
  ];

  const data = weekTemplate.map((dayTemplate) => {
    const match = weekUsage?.find((d) => d.day?.trim() === dayTemplate.day);
    return {
      day: dayTemplate.day,
      usage: match ? parseFloat(match.usage) || 0 : 0,
    };
  });

  return (
    <div className="col-span-2 rounded-xl bg-white px-4 py-4 text-[.7rem] shadow-sm lg:col-span-1">
      <Heading />
      <ResponsiveContainer width="100%" className="my-10" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0DA2E7" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#0DA2E7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="L"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <Area
            dataKey="usage"
            type="monotone"
            stroke={colors.waterUsage.stroke}
            fill="url(#waterGradient)"
            strokeWidth={2}
            name="Water Usage"
            unit="L"
          />
          <Tooltip
            contentStyle={{ backgroundColor: colors.background }}
            formatter={(value) => [`${value}L`, "Water Usage"]}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Heading() {
  return (
    <div className="mt-2 mb-4">
      <h1 className="text-[1rem] font-semibold">Daily Water Consumption</h1>
      <h4 className="text-sm text-stone-500 opacity-60">
        Your daily water intake will be tracked and displayed here.
      </h4>
    </div>
  );
}

export default DailyFeedConsumption;
