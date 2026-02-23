/**
 * Extracts RGS (Remote Gaming Server) parameters from the game URL.
 *
 * Games are hosted under: https://{{.TeamName}}.cdn.stake-engine.com/{{.GameID}}/{{.GameVersion}}/index.html
 * Query params: sessionID, lang, device, rgs_url
 *
 * Launcher URL format: https://stake-engine.com/teams/{{team}}/games/{{game}}?...
 */

export interface ExtractedUrlParams {
  /** From query: Unique session ID for the player. Required for all requests. */
  sessionID: string | null;
  /** From query: Language for the game display */
  lang: string | null;
  /** From query: 'mobile' or 'desktop' */
  device: string | null;
  /** From query: URL for auth, bets, and rounds. May change dynamically. */
  rgs_url: string | null;
  /** From path or query: Team name (e.g. kg-gaming) */
  team: string | null;
  /** From path or query: Game ID (e.g. ll) */
  game: string | null;
  /** From query: Currency code */
  currency: string | null;
  /** From query: Language (launcher format) */
  language: string | null;
  /** From query: Device type (launcher format) */
  deviceType: string | null;
  /** From query: Player balance */
  balance: string | null;
  /** All raw query params for flexibility */
  allParams: Record<string, string>;
}

/**
 * Extracts parameters from the current page URL.
 * Handles both CDN game URL format and launcher URL format.
 */
export function extractUrlParams(): ExtractedUrlParams {
  const { search, pathname } = window.location;
  const params = new URLSearchParams(search);

  const get = (key: string) => params.get(key) ?? null;

  // Extract team and game from path: /teams/kg-gaming/games/ll
  const teamsMatch = pathname.match(/\/teams\/([^/]+)/);
  const gamesMatch = pathname.match(/\/games\/([^/]+)/);
  const teamFromPath = teamsMatch?.[1] ?? null;
  const gameFromPath = gamesMatch?.[1] ?? null;

  const result: ExtractedUrlParams = {
    sessionID: get('sessionID'),
    lang: get('lang'),
    device: get('device'),
    rgs_url: get('rgs_url'),
    team: get('team') ?? teamFromPath,
    game: get('game') ?? gameFromPath,
    currency: get('currency'),
    language: get('language'),
    deviceType: get('deviceType'),
    balance: get('balance'),
    allParams: Object.fromEntries(params.entries()),
  };

  return result;
}
