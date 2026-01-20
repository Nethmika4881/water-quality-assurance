"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateGoal } from "@/lib/actions";
import { useState } from "react";

function ChangeGoal({ goal }) {
  console.log("goal", goal);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdateGoal = async () => {
    if (!value || parseFloat(value) <= 0) {
      setMessage({ type: "error", text: "Please enter a valid goal amount" });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);
      await updateGoal(parseFloat(value));
      setMessage({ type: "success", text: "Goal updated successfully!" });
      setValue("");

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating goal:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update goal",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-40 ">
      <Card className="w-full">
        <CardContent className="flex flex-col gap-4 ">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Daily Goal (Current: {goal}L)
            </label>
            <Input
              type="number"
              placeholder={`Enter new goal in Litres`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateGoal();
                }
              }}
              disabled={isLoading}
              min="0"
              step="0.1"
            />
            {message && (
              <p
                className={`text-sm ${
                  message.type === "error" ? "text-red-500" : "text-green-500"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
          <Button
            onClick={handleUpdateGoal}
            disabled={isLoading || !value}
            className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Change Goal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangeGoal;
