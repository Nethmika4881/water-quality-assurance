"use server";

import { supabase } from "@/supabase";
import { revalidatePath } from "next/cache";

export const getTodayUsage = async function () {
  const now = new Date();
  const sriLankaOffset = 330;
  const sriLankaTime = new Date(
    now.getTime() + (sriLankaOffset - now.getTimezoneOffset()) * 60 * 1000,
  );
  sriLankaTime.setHours(0, 0, 0, 0);
  const startOfTodayUTC = new Date(
    sriLankaTime.getTime() - sriLankaOffset * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabase
    .from("data")
    .select("usage")
    .gte("created_at", startOfTodayUTC);

  if (error) {
    console.error("Error fetching today's usage:", error);
    throw new Error(error.message);
  }

  const sum = data.reduce((acc, curr) => acc + Number(curr.usage), 0);
  return Number((sum / 1000).toFixed(2));
};

export const getLastInsert = async function () {
  const { data, error } = await supabase
    .from("data")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    console.error("Error fetching last insert:", error);
    throw new Error(error.message);
  }

  return data;
};

export const getGoal = async function () {
  const { data, error } = await supabase
    .from("Daily Target")
    .select("goal")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching goal:", error);
    throw new Error(error.message);
  }

  return data;
};

export const updateGoal = async function (value) {
  if (typeof value !== "number" || value <= 0) {
    throw new Error("Invalid goal value");
  }

  const { data, error } = await supabase
    .from("Daily Target")
    .update({ goal: value })
    .eq("id", 1)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating goal:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");

  return data;
};

export const getWeeklyUsage = async function () {
  const { data, error } = await supabase.rpc("get_weekly_usage");

  if (error) {
    console.error("Error fetching weekly usage:", error);
    throw new Error(error.message);
  }
  const details = data.slice(1);
  return details;
};
