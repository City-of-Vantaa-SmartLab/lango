import React from 'react';

import { LoadingIcon } from 'components/icons';

const loaderStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '3rem',
};

export default function CenteredSpinner() {
  return (
    <div style={loaderStyle}>
      <LoadingIcon />
    </div>
  );
}
