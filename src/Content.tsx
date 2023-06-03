import { Container, NativeSelect } from "@mantine/core";
import { Team, Teams } from "./models/teams";
import { useState } from "react";
import { Player } from "./models/player";
import { DomUtils, parseDocument } from "htmlparser2";
import { Element } from "domhandler";
import { Stat } from "./models/stat";
import PlayerStats from "./components/PlayerStats";

function Content() {
  const [team, setTeam] = useState<string | undefined>();
  const [players, setPlayers] = useState<Player[]>([]);

  async function handleTeamChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setTeam(event.currentTarget.value);

    const tablesContainer = await getTablesContainer(
      event.currentTarget.value as Team
    );
    if (tablesContainer !== null) {
      const playersWithDisposals = getPlayersWithStats(
        tablesContainer,
        Stat.Disposals
      );
      const playersWithGoals = getPlayersWithStats(tablesContainer, Stat.Goals);

      const combinedPlayers: Player[] = [];
      for (const playerWithDisposals of playersWithDisposals) {
        const playerWithGoals = playersWithGoals.find(
          (p) => p.name == playerWithDisposals.name
        );
        const player = new Player(playerWithDisposals.name);
        player.disposals = playerWithDisposals.disposals;
        player.goals = playerWithGoals?.goals ?? new Map<number, number>();
        combinedPlayers.push(player);
      }
      setPlayers(combinedPlayers);
    }
  }

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
      {players.map((player) => (
        <PlayerStats player={player} />
      ))}
    </Container>
  );
}

async function getTablesContainer(team: Team): Promise<Element | null> {
  const url = `https://afltables.com/afl/stats/teams/${team}/2023_gbg.html`;
  const headers = new Headers();
  return await fetch(url, { headers: headers })
    .then((result) => result.text())
    .then((raw) => parseDocument(raw))
    .then((doc) => DomUtils.findOne((n) => n.tagName === "html", doc.children))
    .then((htmlNode) =>
      DomUtils.findOne((n) => n.tagName === "body", htmlNode?.children ?? [])
    )
    .then((bodyNode) =>
      DomUtils.findOne((n) => n.tagName === "center", bodyNode?.children ?? [])
    )
    .then((centerNode) =>
      DomUtils.findOne((n) => n.tagName === "div", centerNode?.children ?? [])
    );
}

function getPlayersWithStats(tablesContainer: Element, stat: Stat): Player[] {
  const players: Player[] = [];
  const header = DomUtils.findOne(
    (n) => DomUtils.textContent(n) === stat,
    tablesContainer.childNodes,
    true
  );

  if (header !== undefined && header !== null) {
    const headerRow = DomUtils.getParent(header);
    if (headerRow !== undefined && headerRow !== null) {
      const table = DomUtils.getParent(headerRow);
      const tableBody = DomUtils.findOne(
        (n) => n.tagName === "tbody",
        table?.children ?? []
      );
      const tableRows = DomUtils.findAll(
        (n) => n.tagName === "tr",
        tableBody?.children ?? []
      );

      for (const row of tableRows) {
        const tableCells = DomUtils.findAll(
          (n) => n.tagName === "td",
          row.children
        );
        const playerNameCell = DomUtils.textContent(tableCells[0]).trim();
        const player = new Player(
          `${playerNameCell.split(",")[1].trim()} ${playerNameCell
            .split(",")[0]
            .trim()}`
        );
        for (const [index, cell] of tableCells.entries()) {
          const content = DomUtils.textContent(cell).trim();
          if (content.length > 0 && content !== "-") {
            switch (index) {
              case 0:
                // Do nothing, we've already grabbed the name
                break;
              case tableCells.length - 1:
                // Do nothing, we can dynamically calculate the total
                break;
              default:
                if (stat === Stat.Disposals) {
                  player.disposals.set(index, Number.parseInt(content));
                } else {
                  player.goals.set(index, Number.parseInt(content));
                }
                break;
            }
          }
        }
        players.push(player);
      }
    }
  }

  return players;
}

export default Content;
