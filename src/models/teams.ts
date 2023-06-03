export const Teams = {
  adelaide: "Adelaide Crows",
  brisbanel: "Brisbane Lions",
  carlton: "Carlton Blues",
  collingwood: "Collingwood Magpies",
} as const;

export type Team = keyof typeof Teams;
