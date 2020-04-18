import React from 'react';
import { Menu } from 'antd';

export default function MultiActionMenu(props) {
  const { menuList = [], onClick, ...rest } = props;
  const handleClick = (e = {}) => {
    if (onClick) {
      onClick(e.key);
    }
  };
  return (
    <Menu
      onClick={handleClick}
      {...rest}
    >
      {
        menuList.map((menuItem) => (
          <Menu.Item key={menuItem.key}>
            {menuItem.title}
          </Menu.Item>
        ))
      }
    </Menu>
  );
}
