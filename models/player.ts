import { Stat } from "./stat";

export class Player {
  name: string;
  // Disposals by round
  disposals: Map<number, number> = new Map<number, number>();
  // Goals by round
  goals: Map<number, number> = new Map<number, number>();

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Get the average for the entire season.
   * @param stat which stat to consider.
   * @returns average of the stat.
   */
  average(stat: Stat): number {
    let targetMap: Map<number, number>;
    switch (stat) {
      case Stat.Disposals:
        targetMap = this.disposals;
        break;
      case Stat.Goals:
        targetMap = this.goals;
        break;
    }

    const total = Array.from(targetMap.values()).reduce(
      (acc, val) => acc + val,
      0
    );
    return Math.floor(total / targetMap.size);
  }

  /**
   * Get the average from the most recent games.
   * @param stat which stat to consider.
   * @param games number of games to consider.
   * @returns average disposals over the last X games.
   */
  recentTrend(stat: Stat, games: number): number {
    // i.e. if we want to consider the last 5 games but they've only played 2, then we should average over those 2.
    let targetMap: Map<number, number>;
    switch (stat) {
      case Stat.Disposals:
        targetMap = this.disposals;
        break;
      case Stat.Goals:
        targetMap = this.goals;
        break;
    }
    const gamesPlayed = Math.min(games, targetMap.size);
    const statValues = Array.from(targetMap.values());
    let total = 0;
    for (
      let i = statValues.length - 1;
      i >= statValues.length - gamesPlayed;
      i--
    ) {
      total += statValues[i];
    }
    return Math.floor(total / gamesPlayed);
  }
}
