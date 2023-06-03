import { Card, Text } from "@mantine/core";
import { Player } from "../models/player";

interface PlayerStatsProps {
  player: Player;
}

function PlayerStats({ player }: PlayerStatsProps) {
  return (
    <Card>
      <Text>{player.name}</Text>
    </Card>
  );
}

export default PlayerStats;
