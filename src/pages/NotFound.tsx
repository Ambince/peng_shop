import { defaultUrl } from '@/constants';
import { HomeFilled, HomeOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const { Content, Sider } = Layout;

export function NotFound(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="h-screen w-screen bg-white gap-12 flex justify-center items-center flex-col">
      <div className="text-3xl  font-bold text-@MainGreen">Not Found</div>

      <div className="flex items-center gap-2  justify-center">
        <Button
          className="text-lg"
          icon={<HomeFilled />}
          size="large"
          type="primary"
          onClick={() => navigate(defaultUrl)}
        >
          Home
        </Button>
      </div>
    </div>
  );
}
