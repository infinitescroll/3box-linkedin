import { useEffect, useState } from 'react';
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

const use3Box = account => {
  const [box, setBox] = useState({
    name: '',
    image: [''],
    school: '',
    fetchedBox: false,
    loading: true,
  });

  const getBox = async () => {
    const hasBox = await checkForBox(account);
    if (!hasBox) setBox({ ...box, fetchedBox: true, loading: false });
    else {
      const openedBox = await Box.openBox(account, window.web3.currentProvider);
      openedBox.onSyncDone(async () => {
        const box = await openedBox.public.all();
        setBox({ ...box, fetchedBox: true, loading: false });
      });
    }
  };

  useEffect(() => {
    if (account && !box.fetchedBox) getBox();
  });

  return box;
};

export default use3Box;
