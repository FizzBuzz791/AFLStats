export const Teams = {
  adelaide: "Adelaide Crows",
  brisbanel: "Brisbane Lions",
  carlton: "Carlton",
  collingwood: "Collingwood",
  essendon: "Essendon",
  fremantle: "Fremantle",
  geelong: "Geelong Cats",
  goldcoast: "Gold Coast Suns",
  gws: "GWS Giants",
  hawthorn: "Hawthorn",
  melbourne: "Melbourne",
  kangaroos: "North Melbourne",
  padelaide: "Port Adelaide",
  richmond: "Richmond",
  stkilda: "St Kilda",
  swans: "Sydney Swans",
  westcoast: "West Coast Eagles",
  bullldogs: "Western Bulldogs",
} as const;

export type Team = keyof typeof Teams;
