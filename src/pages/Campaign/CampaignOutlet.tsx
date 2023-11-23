import React from 'react';
import { Outlet } from 'react-router-dom';

function CampaignOutlet(): JSX.Element {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default CampaignOutlet;
