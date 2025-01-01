import { TableColumnsType, Tooltip } from "antd";

import Love from '../../asset/love'
export interface ITotalDataType {
  rank: number;
  key: React.Key;
  name: string;
  total_score: number;
}

export interface ISiKillDataType {
  rank: number;
  key: React.Key;
  name: string;
  si_kill: number;
}

export interface ICiKillDataType {
  rank: number;
  key: React.Key;
  name: string;
  ci_kill: number;
}

export interface IIncapDataType {
  rank: number;
  key: React.Key;
  name: string;
  incap: number;
}

export interface IDeathDataType {
  rank: number;
  key: React.Key;
  name: string;
  death: number;
}
export interface ISaveDataType {
  rank: number;
  key: React.Key;
  name: string;
  save: number;
}

export interface IExpDataType {
  rank: number;
  key: React.Key;
  name: string;
  exp: number;
  play_time: number;
}

export interface ITimeDataType {
  rank: number;
  key: React.Key;
  name: string;
  kills: number;
  play_time: number;
}

export interface ICouplesDataType {
  rank: number;
  key: React.Key;
  name: string;
  mate_name: string;
  total_exp: number;
}
export interface IHeadShotDataType {
  rank: number;
  key: React.Key;
  name: string;
  si_hr: number;
  ci_hr: number;
}

export type IRankType = 'total' | 'exp' | 'time' | 'couples' | 'headshot';

export type DataType = ITotalDataType
  & ICouplesDataType
  & IExpDataType
  & ITimeDataType
  & IHeadShotDataType
  & ISiKillDataType
  & ICiKillDataType
  & IIncapDataType
  & IDeathDataType
  & ISaveDataType
;


export const expColumns: TableColumnsType<IExpDataType> = [
  {
    title: '排名',
    dataIndex: 'rank',
  },
  {
    title: '昵称',
    dataIndex: 'name',
  },
  {
    title: '经验',
    dataIndex: 'exp',
  },
  {
    title: '时长',
    dataIndex: 'play_time',
    render: (text) => `${parseFloat((text / 3600).toFixed(1))}h`,
  },
];

export const timeColumns: TableColumnsType<ITimeDataType> = [{
  title: '排名',
  dataIndex: 'rank',
}, {
  title: '昵称',
  dataIndex: 'name',
}, {
    title: '时长',
    dataIndex: 'play_time',
    render: (text) => `${parseFloat((text / 3600).toFixed(1))}h`,
}, {
  title: '击杀数',
  dataIndex: 'kills',
}];

export const couplesColumns: TableColumnsType<ICouplesDataType> = [{
  title: '排名',
  dataIndex: 'rank',
}, {
  title: '昵称',
  render: (_, record) => {
   return (<div>{record.name}<Love />{record.mate_name}</div>)
  }
}, {
  title: '总经验',
  dataIndex: 'total_exp',
}];

export const headShotColumns: TableColumnsType<IHeadShotDataType> = [
  {
  title: '排名',
  dataIndex: 'rank',
}, {
  title: '昵称',
  dataIndex: 'name',
}, {
  title: '特感',
  dataIndex: 'si_hr',
  render: (text) => `${(text * 100).toFixed(2)}%`,
}, {
  title: '普感',
  dataIndex: 'ci_hr',
  render: (text) => `${(text * 100).toFixed(2)}%`,
}];

export const siKillColumns: TableColumnsType<ISiKillDataType> = [
  {
    title: '排名',
    dataIndex: 'rank',
  },
  {
    title: '昵称',
    dataIndex: 'name',
  },
  {
    title: '击杀数',
    dataIndex: 'si_kill',
  }
];

export const ciKillColumns: TableColumnsType<ICiKillDataType> = [
  {
    title: '排名',
    dataIndex: 'rank',
  },
  {
    title: '昵称',
    dataIndex: 'name',
  },
  {
    title: '击杀数',
    dataIndex: 'ci_kill',
  }
];

export const incapColumns: TableColumnsType<IIncapDataType> = [
  {
    title: '排名',
    dataIndex: 'rank',
  },
  {
    title: '昵称',
    dataIndex: 'name',
  },
  {
    title: '倒地数',
    dataIndex: 'incap',
  }
];

export const deathColumns: TableColumnsType<IDeathDataType> = [
  {
    title: '排名',
    dataIndex: 'rank',
  },
  {
    title: '昵称',
    dataIndex: 'name',
  },
  {
    title: '死亡数',
    dataIndex: 'death',
  }
];

export const saveColumns: TableColumnsType<ISaveDataType> = [
  {
    title: '排名',
    dataIndex: 'rank',
  },
  {
    title: '昵称',
    dataIndex: 'name',
  },
  {
    title: '救人数',
    dataIndex: 'save',
  }
];

export const totalColumns: TableColumnsType<ITotalDataType> = [
  {
    title: '排名',
    dataIndex: 'rank',
  },
  {
    title: '昵称',
    dataIndex: 'name',
  },
  {
    title: <Tooltip
            placement="top"
            title="经验值 + 特感击杀数 + 救人数"
            color="rgba(0, 0, 0, 0.6)"
          >总分
          </Tooltip>,
    dataIndex: 'total_score',
  },
  {
    title: '时长',
    dataIndex: 'play_time',
    render: (text) => `${parseFloat((text / 3600).toFixed(1))}h`,
  }
];



export const rankMap = [
  {
  name: 'total',
  title: '总排名',
  columns: totalColumns,
}, {
  name: 'exp',
  title: '经验榜',
  columns: expColumns,
}, {
  name: 'time',
  title: '陪伴榜',
  columns: timeColumns,
}, {
  name: 'couples',
  title: '双修榜',
  columns: couplesColumns,
}];

export const rankMapRest = [{
  name: 'headshots',
  title: '爆头榜',
  columns: headShotColumns,
}, {
  name: 'si_kill',
  title: '特感榜',
  columns: siKillColumns,
}, {
  name: 'ci_kill',
  title: '丧尸榜',
  columns: ciKillColumns,
}, {
  name: 'incap',
  title: '倒地榜',
  columns: incapColumns,
}, {
  name: 'death',
  title: '死亡榜',
  columns: deathColumns,
}, {
  name: 'save',
  title: '救人榜',
  columns: saveColumns,
}];