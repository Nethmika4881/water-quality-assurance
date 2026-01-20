"use client";
import { useEffect, useState } from "react";
import Chart from "./_components/Chart";
import Conductivity from "./_components/Conductivity";
import DrinkWaterAmount from "./_components/DrinkWaterAmount";
import PHLevel from "./_components/PHLevel";
import Turbidity from "./_components/Turbidity";
import {
  getGoal,
  getLastInsert,
  getTodayUsage,
  getWeeklyUsage,
} from "@/lib/actions";
import { supabase } from "@/supabase";
import ChangeGoal from "./_components/ChangeGoal";

export default function Home() {
  const [lastInsert, setLastInsert] = useState(null);
  const [todayUsage, setTodayUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goal, setGoal] = useState(null);
  const [weekUsage, setWeekUsage] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [lastInsertData, todayUsageData, goalData, weekData] =
          await Promise.all([
            getLastInsert(),
            getTodayUsage(),
            getGoal(),
            getWeeklyUsage(),
          ]);

        setWeekUsage(weekData);
        setGoal(goalData);
        setLastInsert(lastInsertData);
        setTodayUsage(todayUsageData);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "data",
        },
        async (payload) => {
          setLastInsert(payload.new);
          try {
            const updatedUsage = await getTodayUsage();
            setTodayUsage(updatedUsage);
          } catch (err) {
            console.error("Error updating usage:", err);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  console.log(goal, "gggg");
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!lastInsert || !todayUsage || !goal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  const { ph, turbidity, conductivity } = lastInsert;

  return (
    <div className="py-5">
      <DrinkWaterAmount todayUsage={todayUsage} goal={goal.goal} />
      <div className="grid py-10 grid-cols-1 md:h-60  items-center gap-10 md:gap-20 md:grid-cols-2 lg:grid-cols-4">
        <Turbidity turbidity={turbidity} />
        <PHLevel ph={ph} />
        <Conductivity conductivity={conductivity} />
        <ChangeGoal goal={goal.goal} />
      </div>
      <Chart weekUsage={weekUsage} />
    </div>
  );
}
