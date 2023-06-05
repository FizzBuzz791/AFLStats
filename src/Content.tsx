import { Container, NativeSelect } from "@mantine/core";
import { Teams } from "../models/teams";
import { useEffect, useState } from "react";
import { Player } from "../models/player";
import PlayerStats from "./components/PlayerStats";
import { reviverWithMap } from "../utils/stringify";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale, ChartData, Title } from "chart.js";
import { Stat } from "../models/stat";

Chart.register(CategoryScale, Title);

function Content() {
  const [team, setTeam] = useState<string | undefined>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [chartData, setChartData] = useState<
    ChartData<
      "line",
      {
        x: number;
        y: number;
      }[],
      unknown
    >
  >({ datasets: [] });

  async function handleTeamChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setTeam(event.currentTarget.value);

    const result = await fetch(
      `/.netlify/functions/retrieve-data?team=${event.currentTarget.value}`
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

  useEffect(() => {
    setChartData({
      labels: [
        ...new Set(players.flatMap((p) => Array.from(p.disposals.keys()))),
      ].sort((a, b) => a - b),
      datasets: players
        .filter((p) => {
          console.log(
            `${p.name}: Recent Trend: ${p.recentTrend(Stat.Disposals, 5)}`
          );
          return p.recentTrend(Stat.Disposals, 5) > 15;
        })
        .map((p) => {
          return {
            label: p.name,
            data: Array.from(p.disposals.entries()).map((d) => {
              return { x: d[0], y: d[1] };
            }),
          };
        }),
    });
  }, [players]);

  return (
    <Container>
      <NativeSelect
        label="Team"
        placeholder="Choose a team"
        data={Object.entries(Teams).map((entry) => ({
          value: entry[0],
          label: entry[1],
        }))}
        value={team}
        onChange={handleTeamChange}
      ></NativeSelect>
      <div className="chart-container">
        <Line
          title="Disposals by Round"
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
      {players
        // .filter((p) => p.recentTrend(Stat.Disposals, 5) > 15)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((player) => (
          <PlayerStats key={player.name} player={player} />
        ))}
    </Container>
  );
}

export default Content;
