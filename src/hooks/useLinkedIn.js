import React, { useEffect } from 'react';
import axios from 'axios';

const useLinkedIn = (auth, setAuth, box, setBox) => {
  useEffect(() => {
    const urlParams = window.location.href.split('=');
    if (!auth && urlParams[0].includes('code')) {
      setAuth(true);
      const linkedInCode = urlParams[1];
      axios
        .post(`http://localhost:8080/auth?code=${linkedInCode}`)
        .then(response => {
          setBox({ ...box, hasBox: true, name: response.data.name });
        })
        .catch(console.error);
    }
  });
};

export default useLinkedIn;
