import { Container, Select, useMantineColorScheme } from "@mantine/core";
import { Teams } from "../models/teams";
import { useEffect, useState } from "react";
import { Player } from "../models/player";
import PlayerStats from "./components/PlayerStats";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { SelectItem } from "./components/SelectItem";
import { Stat } from "../models/stat";

Chart.register(CategoryScale);

function Content() {
  const [team, setTeam] = useState<string | undefined>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<number[]>([]);
  const { colorScheme } = useMantineColorScheme();

  async function handleTeamChange(value: string | null) {
    if (value !== null) {
      setTeam(value);

      const result = await fetch(
        `/.netlify/functions/retrieve-data?team=${value}`
      )
        .then((result) => result.text())
        .then((content) => JSON.parse(content) as { players: Player[] })
        .then((response) => response.players);
      setPlayers(result);
    }
  }

  useEffect(() => {
    const rounds = [
      ...new Set(
        players.flatMap((p) => p[Stat.Disposals]).flatMap((s) => s?.round ?? 1)
      ),
    ].sort((a, b) => a - b);
    setRounds(rounds);
  }, [players]);

  return (
    <Container fluid>
      <Select
        label="Team"
        placeholder="Choose a team"
        itemComponent={SelectItem}
        data={Object.entries(Teams).map((entry) => ({
          value: entry[0],
          label: entry[1],
          image: `${entry[0]}-${colorScheme}-mode.svg`,
        }))}
        value={team}
        onChange={handleTeamChange}
        p="md"
      ></Select>
      <div className="players-container">
        {players
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((player) => (
            <PlayerStats key={player.name} player={player} rounds={rounds} />
          ))}
      </div>
    </Container>
  );
}

export default Content;
