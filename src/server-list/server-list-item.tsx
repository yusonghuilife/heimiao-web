import { Tag, Button } from "antd";
import { clsPrefix } from "../const";
import { IServerListItem } from "./interface";
import { useCallback, useMemo } from "react";
import { isMobileDevice } from "../utils";

import './server-list-item.less';


const ServerListItem: React.FC<IServerListItem> = (props: IServerListItem) => {
  const { name, players, max_players, map, mapname, address } = props;

  const onJoinButtonClick = useCallback((address: string) => {
    window.open(`steam://connect/${address}`);
  }, []);

  const playerNumStatus = useMemo(() => {
    if (players === 0) {
      return 'empty';
    }
    if (players < max_players / 2) {
      return 'less';
    }
    if (players >= max_players) {
      return 'full';
    }
    return 'half';
  }, [max_players, players]);

  return (
    <div className={`${clsPrefix}-server-list-item`}>
      <div className={`${clsPrefix}-server-name ${playerNumStatus}`}>{name}</div>
      <div className={`${clsPrefix}-server-players`}>
        <span className={`${clsPrefix}-server-cur-players ${playerNumStatus}`}>{players}</span>
        <span className={`${clsPrefix}-server-separator ${players >= max_players && max_players > 0 ? 'full' : ''}`}>/</span>
        <span className={`${clsPrefix}-server-max-players ${players >= max_players && max_players > 0 ? 'full' : ''}`}>{max_players}</span>
      </div>
      <div className={`${clsPrefix}-server-map ${isMobileDevice() ? 'mobile' : ''}`}>
        <div className={`${clsPrefix}-server-map-name`}>
          <Tag className={`${clsPrefix}-server-map-tag ${mapname?.startsWith('(官图)') ? 'official' : ''}`}>{mapname}</Tag>
        </div>
        <div className={`${clsPrefix}-server-map-code`}>{map}</div>
      </div>
      <div className={`${clsPrefix}-server-join`} onClick={ e => e.stopPropagation()}>
        <Button autoInsertSpace={false} onClick={() => onJoinButtonClick(address)}>一键进服</Button>
      </div>
    </div>
  );
}

export default ServerListItem;