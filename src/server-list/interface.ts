export interface IServerListItem {
  name: string;
  players: number;
  max_players: number;
  map: string;
  mapname: string;
  address: string;
  bac: boolean;
  ping: number;
}

export interface IPlayer {
  name: string;
  score: number;
  duration: number;
  index: number;
  highlight?: boolean;
}

export interface IServerInfo {
  players: IPlayer[],
  server: IServerListItem,
}

export type IResResult = IServerInfo[]

export interface IServerListProps {
  activeTab: string;
}