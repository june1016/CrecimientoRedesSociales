"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Instagram, Users, Clock, Target } from "lucide-react";

export default function InstagramGrowthModel() {
  const [mounted, setMounted] = useState(false);
  const [initialFollowers, setInitialFollowers] = useState<number | "">("");
  const [currentFollowers, setCurrentFollowers] = useState<number | "">("");
  const [timeElapsed, setTimeElapsed] = useState<number | "">("");
  const [targetTime, setTargetTime] = useState<number | "">("");
  const [estimatedFollowers, setEstimatedFollowers] = useState<number | null>(
    null
  );
  const [chartData, setChartData] = useState<
    Array<{ time: number; followers: number }>
  >([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const calculateGrowth = () => {
    if (
      initialFollowers === "" ||
      currentFollowers === "" ||
      timeElapsed === "" ||
      targetTime === ""
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const P0 = Number(initialFollowers);
    const P_t = Number(currentFollowers);
    const t = Number(timeElapsed);
    const t_objetivo = Number(targetTime);

    const k = (Math.log(P_t) - Math.log(P0)) / t;
    const growthFunction = (time: number) => P0 * Math.exp(k * time);

    const estimated = growthFunction(t_objetivo);
    setEstimatedFollowers(estimated);

    const newChartData = Array.from({ length: 100 }, (_, i) => ({
      time: (i / 99) * t_objetivo,
      followers: growthFunction((i / 99) * t_objetivo),
    }));
    setChartData(newChartData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-6 w-6 text-pink-500" />
          Modelo de Crecimiento Exponencial para Instagram
        </CardTitle>
        <CardDescription>
          Ingrese los datos para calcular el crecimiento estimado de seguidores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label
              htmlFor="initialFollowers"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Número inicial de seguidores (P0)
            </Label>
            <Input
              id="initialFollowers"
              type="number"
              value={initialFollowers}
              onChange={(e) =>
                setInitialFollowers(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Ej. 1000"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="currentFollowers"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Número actual de seguidores (P_t)
            </Label>
            <Input
              id="currentFollowers"
              type="number"
              value={currentFollowers}
              onChange={(e) =>
                setCurrentFollowers(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Ej. 5000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeElapsed" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo transcurrido (en meses)
            </Label>
            <Input
              id="timeElapsed"
              type="number"
              value={timeElapsed}
              onChange={(e) =>
                setTimeElapsed(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="Ej. 6"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetTime" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Tiempo objetivo (en meses)
            </Label>
            <Input
              id="targetTime"
              type="number"
              value={targetTime}
              onChange={(e) =>
                setTargetTime(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="Ej. 12"
            />
          </div>
        </div>
        <Button onClick={calculateGrowth} className="w-full mb-6">
          Calcular Crecimiento
        </Button>
        {estimatedFollowers !== null && (
          <div className="text-center mb-6">
            <p className="text-lg font-semibold">
              Seguidores estimados después de {targetTime} meses:
              <span className="text-primary ml-2">
                {Math.round(estimatedFollowers).toLocaleString()}
              </span>
            </p>
          </div>
        )}
        {chartData.length > 0 && (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  label={{
                    value: "Tiempo (meses)",
                    position: "insideBottom",
                    offset: -10,
                  }}
                  tickFormatter={(value: number) =>
                    Math.round(value).toString()
                  }
                />
                <YAxis
                  label={{
                    value: "Número de seguidores",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  formatter={(value: number) => [
                    Math.round(value).toLocaleString(),
                    "Seguidores",
                  ]}
                  labelFormatter={(label) => `Mes ${Math.round(Number(label))}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="#ec4899"
                  name="Crecimiento exponencial"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
