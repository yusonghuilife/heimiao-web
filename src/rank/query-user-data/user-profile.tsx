import dayjs from 'dayjs';
import { clsPrefix } from '../../const';
import { defaultData, IUserData } from './data';
import { Avatar, Badge, Col, Row } from 'antd';

import './user-profile.less';



interface IUserProfileProps {
  data: IUserData;
}

const UserProfile: React.FC<IUserProfileProps> = (props: IUserProfileProps) => {
  const { data = defaultData } = props;
  return (
    <div className={`${clsPrefix}-user-card`}>
    <div className="header">
      <Badge count={data.seq} showZero color='rgb(56, 137, 197)' overflowCount={99999999}>
        <Avatar src={data.avatar} shape="circle" size="large" />
      </Badge>
      <div className="username">{!!data.married ? `${data.name} ❤ ${data.mate_name}` : `${data.name}`}</div>
    </div>
    <div className="divider"></div>
    <Row>
      <Col span={12}>
        <div>经验值<span>{data.exp}</span></div>
      </Col>
      <Col span={12}>
        <div>总击杀<span>{data.si_kill + data.ci_kill}</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div>总倒地<span>{data.incap}</span></div>
      </Col>
      <Col span={12}>
        <div>总死亡<span>{data.death}</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div>KDI<span>{data.kdi}</span></div>
      </Col>
      <Col span={12}>
        <div>救人数<span>{data.save}</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <div>首次加入  <span>{dayjs(data.joined_date).format('YYYY/MM/DD HH:mm:ss')}</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <div>游戏时长 <span>{`${parseFloat((data.play_time / 3600).toFixed(1))}h`}</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <div>最后登录 <span>{dayjs(data.last_login_time * 1000).format('YYYY/MM/DD HH:mm:ss')}</span></div>
      </Col>
    </Row>
    <div className="divider"></div>
    <Row>
      <Col span={12}>
        <div>击杀特感 <span>{data.si_kill}</span></div>
      </Col>
      <Col span={12}>
        <div>特感爆头 <span>{data.si_headshot} ({(((data.si_headshot / data.si_kill) || 0) * 100).toFixed(1)}%)</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div>击杀普感 <span>{data.ci_kill}</span></div>
      </Col>
      <Col span={12}>
        <div>普感爆头 <span>{data.ci_headshot} ({(((data.ci_headshot / data.ci_kill) || 0) * 100).toFixed(1)}%)</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div>击杀坦克 <span>{data.tank_kill}</span></div>
      </Col>
      <Col span={12}>
        <div>击杀女巫 <span>{data.witch_kill}</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div>击杀牛牛 <span>{data.charger_kill}</span></div>
      </Col>
      <Col span={12}>
        <div>寸止牛牛 <span>{data.charger_level} ({(((data.charger_level / data.charger_kill) || 0) * 100).toFixed(1)}%)</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div>击杀猎人 <span>{data.hunter_kill}</span></div>
      </Col>
      <Col span={12}>
        <div>空爆猎人 <span>{data.hunter_skeet} ({(((data.hunter_skeet / data.hunter_kill) || 0) * 100).toFixed(1)}%)</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div>击杀猴子 <span>{data.jockey_kill}</span></div>
      </Col>
      <Col span={12}>
        <div>空爆猴子 <span>{data.jockey_skeet} ({(((data.jockey_skeet / data.jockey_kill) || 0) * 100).toFixed(1)}%)</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div>击杀舌头 <span>{data.smoker_kill}</span></div>
      </Col>
      <Col span={12}>
        <div>击杀胖子 <span>{data.boomer_kill}</span></div>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <div>击杀口水 <span>{data.spitter_kill}</span></div>
      </Col>
    </Row>
  </div>
  )
}

export default UserProfile;