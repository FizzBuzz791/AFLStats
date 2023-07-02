import { Card, Flex, Text } from "@mantine/core";
import { Player } from "../../models/player";
import { Line } from "react-chartjs-2";
import "./PlayerStats.css";
import { Stat } from "../../models/stat";
import { ChartData } from "chart.js";

interface PlayerStatsProps {
  player: Player;
  rounds: number[];
}

function PlayerStats({ player, rounds }: PlayerStatsProps) {
  const fullPlayer = new Player(player.name);
  fullPlayer.disposals = player.disposals;
  fullPlayer.goals = player.goals;

  const baseOptions = {
    plugins: {
      title: {
        display: true,
        text: "",
      },
      legend: {
        display: true,
      },
      colors: {
        forceOverride: true,
      },
    },
    spanGaps: false,
  };

  const goalsOptions = JSON.parse(JSON.stringify(baseOptions));
  goalsOptions.plugins.title.text = "Goals by Round";

  return (
    <Card>
      <Text>{fullPlayer.name}</Text>
      <Flex direction="row" justify="space-evenly">
        <div className="disposals-chart-container">
          {buildChart(baseOptions, rounds, Stat.Disposals, fullPlayer)}
        </div>
        <div className="goals-chart-container">
          {buildChart(baseOptions, rounds, Stat.Goals, fullPlayer)}
        </div>
      </Flex>
    </Card>
  );
}

function buildChart(
  baseOptions: unknown,
  rounds: number[],
  targetStat: Stat,
  player: Player
) {
  const options = JSON.parse(JSON.stringify(baseOptions));
  options.plugins.title.text = `${targetStat} by Round`;
  options.scales = {
    y: {
      beginAtZero: targetStat === Stat.Goals,
      ticks: {
        stepSize: targetStat === Stat.Disposals ? 5 : 1,
      },
    },
  };

  // TODO: This bit sucks. Using player[targetStat] would be nicer.
  const targetMap =
    targetStat == Stat.Disposals ? player.disposals : player.goals;
  const trend = player.recentTrend(targetStat, 5);
  const average = player.average(targetStat);

  const data: ChartData<
    "line",
    { x: number; y: number | undefined }[],
    number
  > = {
    labels: rounds,
    datasets: [
      {
        label: targetStat,
        data: rounds.map((round) => ({
          x: round,
          y: targetMap.get(round),
        })),
        order: 1,
      },
      {
        label: "5 Game Trend",
        data: rounds.slice(-5).map((round) => ({
          x: round,
          y: trend,
        })),
        pointStyle: false,
        order: 2,
      },
      {
        label: "Average",
        data: rounds.map((round) => ({
          x: round,
          y: average,
        })),
        pointStyle: false,
        order: 3,
      },
    ],
  };

  return <Line options={options} data={data}></Line>;
}

export default PlayerStats;
