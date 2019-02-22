import React, { useEffect } from 'react';

const useMetaMask = setAccount => {
  useEffect(() => {
    window.web3.eth.getAccounts((err, accounts) => {
      if (err) throw new Error(err);
      else setAccount(accounts[0]);
    });
  });
};

export default useMetaMask;
