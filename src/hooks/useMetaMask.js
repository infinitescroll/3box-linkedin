import { useEffect, useState } from 'react';

const useMetaMask = () => {
  const [account, setAccount] = useState('');
  const fetchAccounts = () => {
    window.web3.eth.getAccounts((err, accounts) => {
      if (err) throw new Error(err);
      else setAccount(accounts[0]);
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, [account]);
  return account;
};

export default useMetaMask;
