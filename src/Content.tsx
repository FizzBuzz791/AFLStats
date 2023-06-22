import { Container, Select, useMantineColorScheme } from "@mantine/core";
import { Teams } from "../models/teams";
import { useEffect, useState } from "react";
import { Player } from "../models/player";
import PlayerStats from "./components/PlayerStats";
import { reviverWithMap } from "../utils/stringify";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale, ChartData } from "chart.js";
import { Stat } from "../models/stat";
import { SelectItem } from "./components/SelectItem";

Chart.register(CategoryScale);

function Content() {
  const [team, setTeam] = useState<string | undefined>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [chartData, setChartData] = useState<
    ChartData<
      "line",
      {
        x: number;
        y: number | undefined;
      }[],
      unknown
    >
  >({ datasets: [] });
  const [rounds, setRounds] = useState<number[]>([]);
  const { colorScheme } = useMantineColorScheme();

  async function handleTeamChange(value: string | null) {
    if (value !== null) {
      setTeam(value);

      const result = await fetch(
        `/.netlify/functions/retrieve-data?team=${value}`
      )
        .then((result) => result.text())
        .then(
          (content) =>
            JSON.parse(content, reviverWithMap) as { players: Player[] }
        )
        .then((response) =>
          response.players.map((p) => {
            const fullPlayer = new Player(p.name);
            fullPlayer.disposals = p.disposals;
            fullPlayer.goals = p.goals;
            return fullPlayer;
          })
        );
      setPlayers(result);
    }
  }

  useEffect(() => {
    const rounds = [
      ...new Set(players.flatMap((p) => Array.from(p.disposals.keys()))),
    ].sort((a, b) => a - b);
    setRounds(rounds);
    setChartData({
      labels: rounds,
      datasets: players
        .filter((p) => p.recentTrend(Stat.Disposals, 5) > 15)
        .map((p) => ({
          label: p.name,
          data: rounds.map((round, index) => ({
            x: round,
            y: p.disposals.get(index + 1),
          })),
        })),
    });
  }, [players]);

  return (
    <Container>
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
      ></Select>
      <div className="chart-container">
        <Line
          options={{
            plugins: {
              title: {
                display: players.length > 0,
                text: "Disposals by Round",
              },
            },
          }}
          data={chartData}
        ></Line>
      </div>
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
