"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Droplet } from "lucide-react";
import { useState } from "react";

function DrinkWaterAmount({ todayUsage, goal }) {
  const [progress, setProgress] = useState(
    ((todayUsage * 100) / goal).toFixed(2),
  );
  return (
    <div className="flex items-center flex-col justify-center md:flex-row  container mx-auto  container ">
      <Card className="w-full relative">
        <CardHeader>
          <CardTitle className="text-white text-xl font-semibold flex items-center justify-center gap-2">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Water Meter
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="items-center text-center flex flex-col justify-center gap-4">
          <div className="flex justify-center">
            <CircularProgress
              value={progress}
              todayUsage={todayUsage}
              size={190}
              goal={goal}
              strokeWidth={15}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const CircularProgress = ({
  value,
  size = 120,
  goal,
  todayUsage,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-700/50"
        />
        {/* Progress circle with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#waterGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-in-out drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          strokeLinecap="round"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text with water icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <Droplet className="h-6 w-6 text-blue-400" />
        <span className="text-xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {todayUsage.toFixed(2)}L
        </span>
        <span className="text-sm text-slate-400 font-medium">
          {` Out of Daily Goal ${goal}L`}
        </span>
      </div>
    </div>
  );
};

export default DrinkWaterAmount;
