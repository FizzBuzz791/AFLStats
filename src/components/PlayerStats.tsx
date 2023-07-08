import { Card, Flex, Text, createStyles } from "@mantine/core";
import { Player, recentTrend, average } from "../../models/player";
import { Line } from "react-chartjs-2";
import { Stat } from "../../models/stat";
import { ChartData } from "chart.js";

interface PlayerStatsProps {
  player: Player;
  rounds: number[];
}

const shortTrendGameCount = 3;
const longTrendGameCount = 5;

const useStyles = createStyles(() => ({
  chartContainer: {
    width: `${100 / Object.values(Stat).length}%`,
  },
}));

function PlayerStats({ player, rounds }: PlayerStatsProps) {
  const { classes } = useStyles();

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

  return (
    <Card>
      <Text>{player.name}</Text>
      <Flex direction="row" justify="space-evenly">
        {Object.values(Stat).map((stat) => {
          return (
            <div className={classes.chartContainer}>
              {buildChart(baseOptions, rounds, stat, player)}
            </div>
          );
        })}
      </Flex>
    </Card>
  );
}

function buildChart(
  baseOptions: unknown,
  rounds: number[],
  stat: Stat,
  player: Player
) {
  const options = JSON.parse(JSON.stringify(baseOptions));
  options.plugins.title.text = `${stat} by Round`;
  options.scales = {
    y: {
      beginAtZero: stat === Stat.Goals,
      ticks: {
        stepSize: stat === Stat.Disposals ? 5 : 1,
      },
    },
  };

  const shortTrend = recentTrend(player, stat, shortTrendGameCount);
  const longTrend = recentTrend(player, stat, longTrendGameCount);
  const averageStat = average(player, stat);

  const data: ChartData<
    "line",
    { x: number; y: number | undefined }[],
    number
  > = {
    labels: rounds,
    datasets: [
      {
        label: stat,
        data: rounds.map((round) => ({
          x: round,
          y: player[stat]?.find((s) => s.round === round)?.value,
        })),
        order: 1,
      },
      {
        label: `${shortTrendGameCount} Game Trend`,
        data: rounds.slice(-shortTrendGameCount).map((round) => ({
          x: round,
          y: shortTrend,
        })),
        pointStyle: false,
        order: 2,
      },
      {
        label: `${longTrendGameCount} Game Trend`,
        data: rounds.slice(-longTrendGameCount).map((round) => ({
          x: round,
          y: longTrend,
        })),
        pointStyle: false,
        order: 3,
      },
      {
        label: "Average",
        data: rounds.map((round) => ({
          x: round,
          y: averageStat,
        })),
        pointStyle: false,
        order: 4,
      },
    ],
  };

  return <Line options={options} data={data}></Line>;
}

export default PlayerStats;
