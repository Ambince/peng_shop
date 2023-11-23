import { authUrllMap, getAuthList } from '@/common/auxin/AuxinCommon';
import { CrownOutlined, LineChartOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const newUIPaths = ['shop_gift'];
type MenuItem = Required<MenuProps>['items'][number];

const rootSubmenuKeys = ['shop_gift_m'];
export function SiderMenu({ callback, isExpand, url }): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState(['gift_campaign']);
  const [backOpenKeys, setBackOpenKeys] = useState<string[]>([]);

  const [current, setCurrent] = useState(url);
  const [items, setItems] = useState<MenuItem[]>([]);

  const getItem = (
    key: string,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ) => {
    const labelNode = () => <span>{t(key)}</span>;
    const iconNode = () => <div className="flex items-center">{icon}</div>;
    return { key, icon: iconNode(), children, label: labelNode() };
  };

  const itemsMap = {
    shop_gift_m: getItem('shop_gift_m', <CrownOutlined />, [
      getItem('shop_gift'),
    ]),
  };

  const calCallback = (key) => {
    const page = newUIPaths.includes(key)
      ? 'bg-@main-background h-screen'
      : 'bg-white';
    const content = newUIPaths.includes(key) ? 'bg-@main-background' : 'p-16';
    callback({ page, content, key });
  };

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    if (!isExpand) return;
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
    if (keys.length >= 2) {
      const urls = Object.keys(authUrllMap).filter(
        (key) => authUrllMap[key] === keys[1],
      );
      if (url !== urls[0]) {
        navigate(urls[0]);
        setCurrent(urls[0]);
        calCallback(urls[0]);
      }
    }
  };

  const onClickMenuItem = (val) => {
    const key = val.key;
    const parentKey = val.keyPath[1];
    localStorage.setItem('path', key);
    localStorage.setItem('parentKey', parentKey);
    setCurrent(key);
    calCallback(key);
    navigate(key);
  };

  const initData = () => {
    const auth = getAuthList();
    const showMenu: any[] = [];
    Object.keys(itemsMap).forEach((key) => {
      if (auth[key]) showMenu.push(itemsMap[key]);
    });
    setItems(showMenu);
  };

  useEffect(() => {
    const parent = authUrllMap[url];
    const path = url ?? localStorage.getItem('path');
    if (path) {
      setCurrent(path);
      calCallback(path);
    }
    const parentKey = parent ?? localStorage.getItem('parentKey');
    if (parentKey) setOpenKeys([parentKey]);
    if (!isExpand) {
      setBackOpenKeys(openKeys);
      setOpenKeys(['']);
    } else if (backOpenKeys.length > 0) {
      setOpenKeys(backOpenKeys);
    }
    initData();
  }, [isExpand]);

  return (
    <div className={`${isExpand ? 'pl-2 pr-1' : ''}`}>
      {isExpand && (
        <div className="flex gap-2 pl-2 pb-2 text-@placeholder">
          <LineChartOutlined />
          <span>商品列表</span>
        </div>
      )}

      <Menu
        items={items}
        mode="inline"
        openKeys={openKeys}
        selectedKeys={[current]}
        style={{ width: 256 }}
        onClick={onClickMenuItem}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
