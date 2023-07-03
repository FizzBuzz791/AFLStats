import { Stat } from "./stat";

export type RoundStat = {
  round: number;
  value: number;
};

type PlayerStats = {
  // Stats by round
  [key in Stat]?: RoundStat[] | undefined;
};

export type Player = PlayerStats & {
  name: string;
};

/**
 * Get the average for the entire season.
 * @param stat which stat to consider.
 * @returns average of the stat.
 */
export function average(player: Player, stat: Stat): number {
  const targetStat = player[stat];

  if (targetStat) {
    const total = targetStat.reduce((acc, val) => acc + val.value, 0);
    return Math.floor(total / targetStat.length);
  } else {
    return 0;
  }
}

/**
 * Get the average from the most recent games.
 * @param stat which stat to consider.
 * @param games number of games to consider.
 * @returns average disposals over the last X games.
 */
export function recentTrend(player: Player, stat: Stat, games: number): number {
  // i.e. if we want to consider the last 5 games but they've only played 2, then we should average over those 2.
  const targetStat = player[stat];

  if (targetStat) {
    const gamesPlayed = Math.min(games, targetStat.length);
    const total = targetStat
      .slice(-games)
      .reduce((acc, val) => acc + val.value, 0);
    return Math.floor(total / gamesPlayed);
  } else {
    return 0;
  }
}
