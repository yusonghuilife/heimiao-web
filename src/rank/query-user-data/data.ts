export interface IUserData {
  avatar: string;
  boomer_kill: number;
  charger_kill: number; // 击杀牛牛
  charger_level: number; // 寸止牛牛
  charger_level_rate: number// 寸止牛牛率;
  ci_headshot: number;
  ci_hr: number;
  ci_kill: number;
  death: number;
  exp: number;
  hunter_kill: number; // 击杀ht 
  hunter_skeet: number; // 空爆ht
  hunter_skeet_rate: number; // 空爆ht率
  incap: number;
  jockey_kill: number; // 击杀猴子
  jockey_skeet: number; // 空爆猴子
  jockey_skeet_rate: number; // 空爆猴子率 
  joined_date: string;
  kdi: number;
  save: number;
  last_login_time: number;
  married: 0 | 1;
  mate_name: string;
  name: string;
  play_time: number;
  propose_marriage: number;
  seq: number;
  si_headshot: number;
  si_hr: number;
  si_kill: number;
  smoker_kill: number;
  spitter_kill: number;
  tank_kill: number;
  witch_kill: number;
}

export const defaultData: IUserData = {
  avatar: 'http://heimiao520.cn/default-avatar.jpg',
  boomer_kill: 0, // 击杀胖子
  charger_kill: 0, // 击杀牛牛
  charger_level: 0, // 寸止牛牛
  charger_level_rate: 0, // 寸止牛牛率;
  ci_headshot: 0, // 普感爆头
  ci_hr: 0, // 普感爆头率
  ci_kill: 0, // 击杀普感
  death: 0, // 总死亡
  exp: 0, // 总经验
  hunter_kill: 0, // 击杀ht 
  hunter_skeet: 0, // 空爆ht
  hunter_skeet_rate: 0, // 空爆ht率
  incap: 0, // 总倒地
  jockey_kill: 0, // 击杀猴子
  jockey_skeet: 0, // 空爆猴子
  jockey_skeet_rate: 0, // 空爆猴子率 
  joined_date: '1970/01/01 08:00:00', // 首次加入
  kdi: 0, // kdi
  save: 0, // 救人数
  last_login_time: 0, // 最后登陆
  married: 0, // 是否jh
  mate_name: '',
  name: '【调试】默认用户名',
  play_time: 0, // 游戏时长
  propose_marriage: 0, // 结婚次数
  seq: 0, // 排名
  si_headshot: 0, // 特感爆头
  si_hr: 0, // 特感爆头率
  si_kill: 0, // 击杀特感
  smoker_kill: 0, // 击杀舌头
  spitter_kill: 0, // 击杀口水
  tank_kill: 0, // 击杀tank
  witch_kill: 0, // 击杀witch
}