import { Card, Flex, Text } from "@mantine/core";
import { Player } from "../../models/player";
import { Stat } from "../../models/stat";

interface PlayerStatsProps {
  player: Player;
}

function PlayerStats({ player }: PlayerStatsProps) {
  const fullPlayer = new Player(player.name);
  fullPlayer.disposals = player.disposals;
  fullPlayer.goals = player.goals;

  return (
    <Card>
      <Text>{fullPlayer.name}</Text>
      <Flex direction="column">
        <Text fz="sm">
          Disposals (Avg: {fullPlayer.average(Stat.Disposals)}, 5 Game Trend:{" "}
          {fullPlayer.recentTrend(Stat.Disposals, 5)})
        </Text>
        <Flex direction="row" gap="md">
          {Array.from(fullPlayer.disposals.entries()).map((d) => {
            return (
              <Text fz="xs">
                Round {d[0]}: {d[1]}
              </Text>
            );
          })}
        </Flex>
      </Flex>
      <Flex direction="column">
        <Text fz="sm">
          Goals (Avg: {fullPlayer.average(Stat.Goals)}, 5 Game Trend:{" "}
          {fullPlayer.recentTrend(Stat.Goals, 5)})
        </Text>
        <Flex direction="row" gap="md">
          {Array.from(fullPlayer.goals.entries()).map((g) => {
            return (
              <Text fz="xs">
                Round {g[0]}: {g[1]}
              </Text>
            );
          })}
        </Flex>
      </Flex>
    </Card>
  );
}

export default PlayerStats;
