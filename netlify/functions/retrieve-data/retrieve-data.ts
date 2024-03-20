import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { DomUtils, parseDocument } from "htmlparser2";
import { Element } from "domhandler";
import { Team } from "../../../models/teams";
import { Stat } from "../../../models/stat";
import { Player, RoundStat } from "../../../models/player";

export const handler: Handler = async (
  event: HandlerEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: HandlerContext
) => {
  if (event.queryStringParameters) {
    const tablesContainer = await getTablesContainer(
      event.queryStringParameters.team as Team,
      Number.parseInt(event.queryStringParameters.year ?? "2024")
    );
    if (tablesContainer !== null) {
      const roundMap = getRoundMapping(tablesContainer);
      const playersWithStats: Player[] = [];

      for (const stat of Object.values(Stat)) {
        playersWithStats.push(
          ...getPlayersWithStats(tablesContainer, stat, roundMap)
        );
      }

      const combinedPlayers = new Map();

      playersWithStats.forEach((player) => {
        combinedPlayers.has(player.name)
          ? combinedPlayers.set(player.name, {
              ...player,
              ...combinedPlayers.get(player.name),
            })
          : combinedPlayers.set(player.name, player);
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          players: Array.from(combinedPlayers.values()),
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Unable to find tables",
        }),
      };
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Query strings undefined",
      }),
    };
  }
};

async function getTablesContainer(
  team: Team,
  year: number
): Promise<Element | null> {
  const url = `https://afltables.com/afl/stats/teams/${team}/${year}_gbg.html`;
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

function getRoundMapping(tablesContainer: Element): Map<number, number> {
  const roundMap: Map<number, number> = new Map();

  const header = DomUtils.findOne(
    (n) => DomUtils.textContent(n) === Stat.Disposals, // Doesn't matter which stat
    tablesContainer.childNodes,
    true
  );

  if (header !== undefined && header !== null) {
    const headerRow = DomUtils.getParent(header);
    const headerCells = DomUtils.findAll(
      (n) => n.tagName === "th",
      headerRow?.children.slice(1) ?? [] // .slice(1) to skip the "Stat" header
    );
    for (const [index, cell] of headerCells.entries()) {
      const content = DomUtils.textContent(cell).trim();
      const parsedContent = Number.parseInt(content.replace("R", ""));
      if (Number.isInteger(parsedContent)) {
        roundMap.set(index, parsedContent);
      }
    }
  }

  return roundMap;
}

function getPlayersWithStats(
  tablesContainer: Element,
  stat: Stat,
  roundMap: Map<number, number>
): Player[] {
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
        const player: Player = {
          name: `${playerNameCell.split(",")[1].trim()} ${playerNameCell
            .split(",")[0]
            .trim()}`,
        };
        for (const [index, cell] of tableCells.entries()) {
          const content = DomUtils.textContent(cell).trim();
          if (content.length > 0) {
            switch (index) {
              case 0:
                // Do nothing, we've already grabbed the name
                break;
              case tableCells.length - 1:
                // Do nothing, we can dynamically calculate the total
                break;
              default: {
                const roundStat: RoundStat = {
                  round: roundMap.get(index) ?? -1, // Fallback to -1, indicates an issue
                  value: content === "-" ? 0 : Number.parseInt(content),
                };
                player[stat] !== undefined
                  ? player[stat]?.push(roundStat)
                  : (player[stat] = [roundStat]);
                break;
              }
            }
          }
        }
        players.push(player);
      }
    }
  }

  return players;
}
