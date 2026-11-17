/** Loose shapes for backend payloads. The API returns populated Mongo documents. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Rec = Record<string, any>;

export interface TeamSide {
  id?: string;
  name: string;
  code: string;
  score?: string;
  overs?: string;
}

export interface MatchSummary {
  id: string;
  series: string;
  format: string;
  matchType?: string;
  ballsLabel?: string;
  team1: TeamSide;
  team2: TeamSide;
  status: "Scheduled" | "Live" | "Completed" | "Cancelled" | "Abandoned" | string;
  battingTeam?: string;
  venue: string;
  time?: string;
  result?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
