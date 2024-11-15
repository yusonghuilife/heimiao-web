import { message, Collapse } from "antd"
import { Input } from 'antd';
import UserProfile from "./user-profile";
import { clsPrefix } from "../../const";
import { ChangeEvent, useCallback, useState } from "react";
import axios from "axios";

import { defaultData } from "./data";
import './index.less';


const { Search } = Input;

export const QueryUserInfo = () => {
  const [inputVal, setInputVal] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userData, setUserData] = useState(defaultData);
  // @ts-ignore
  const searchResult = useCallback((value, event, info) => {
    if (inputVal.length === 0 || info.source === 'clear') {
      return;
    }
    setIsSearching(true);
    axios.get(`/api/rank/name/${inputVal}`).then((res) => {
      if (res.data.status === 'failed') {
        message.error(res.data.message);
      } else {
        setUserData(res.data.body);
      }
    }).finally(() => {
      setIsSearching(false);
    });
  }, [inputVal]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(false);
    setInputVal(e.target.value);
  }, [inputVal]);
  return (
    <div className={`${clsPrefix}-query-user`}>
      <Collapse
        items={[{
          key: '1',
          label: '如何搜索玩家数据',
          children: <>
            <div>1. 通过玩家64位steam id查询, id获取方式参考链接<a href="https://jingyan.baidu.com/article/d621e8dae8f1276965913f94.html" target="_blank">如何查询64位steam id</a></div>
            <div>2. 进入游戏内(不是主菜单界面).通过打开游戏控制台输入status后, 使用对应玩家加密steam id查询, 加密id为【恋恋 STEAM_1:0:622962786】中昵称后以STEAM开头字符</div>
            <div>3. 直接输入玩家昵称模糊查询(可能会搜索出重名玩家信息)</div>
          </>,
        }]}
        ghost
        className={`${clsPrefix}-user-data-hint`}
      />
      <Search
        placeholder="输入玩家steam id或昵称查询"
        loading={isSearching}
        enterButton
        onChange={handleInputChange}
        onSearch={searchResult}
        value={inputVal}
        allowClear
      />
      <UserProfile data={userData} />
    </div>
  )
}