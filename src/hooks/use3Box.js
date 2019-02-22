import React, { useEffect } from 'react';
import Box from '3box';

const checkForBox = async account => {
  try {
    // this call throws an error if the box DNE
    await Box.getProfile(account);
    return true;
  } catch (err) {
    return false;
  }
};

const use3Box = (account, box, setBox) => {
  const getBox = async () => {
    if (box.loading && account) {
      const hasBox = await checkForBox(account);
      if (!hasBox) setBox({ ...box, loading: false });
      else {
        const openedBox = await Box.openBox(
          account,
          window.web3.currentProvider
        );
        openedBox.onSyncDone(async () => {
          const publicBox = await openedBox.public.all();
          setBox({ ...publicBox, hasBox: true, loading: false });
        });
      }
    }
  };

  useEffect(() => {
    getBox();
  });
};

export default use3Box;
