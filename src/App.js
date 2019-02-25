import React, { useState, useEffect, Fragment } from 'react';
import Box from '3box';
import { Main, AppBar, Card, Text, Field, Button } from '@aragon/ui';
import axios from 'axios';
import './App.css';

import { useMetaMask, use3Box } from './hooks';
import { sendToLinkedIn, getData } from './helpers';
import Redirect from './Redirect';

const App = () => {
  const account = useMetaMask();
  const box = use3Box(account);
  const [localProfile, setLocalProfile] = useState({
    fetchedLinkedIn: false,
    name: '',
    school: '',
    image: [''],
  });

  const updateLocalBox = (field, value) => {
    setLocalProfile({ ...localProfile, [field]: value });
  };

  useEffect(() => {
    window.addEventListener('message', handlePopupMessage);
    const cleanup = () =>
      window.removeEventListener('message', handlePopupMessage);
    return cleanup;
  });

  const handlePopupMessage = async message => {
    if (message.data.from !== 'popup') return;
    if (message.data.name === 'code') {
      const code = message.data.value;
      const {
        data: { token },
      } = await axios.post(`http://localhost:8080/linkedin/auth?code=${code}`);

      const { data } = await axios.get(
        `http://localhost:8080/linkedin/user/access_token/${token}`
      );

      setLocalProfile({
        ...localProfile,
        fetchedLinkedIn: true,
        name: data.name,
      });
    }
  };

  const saveBox = async () => {
    // @TODO - this needs to be better - check the diff of what changed and only set the changes
    const openedBox = await Box.openBox(account, window.web3.currentProvider);
    const { name, image, school } = getData(localProfile, box);
    await openedBox.public.set('name', name);
    await openedBox.public.set('image', image);
    await openedBox.public.set('school', school);
  };

  const { name, image, school } = getData(localProfile, box);

  return (
    <div className="container">
      <Main>
        <AppBar style={{ marginTop: '60px' }} title="Your Profile">
          {account}
        </AppBar>

        <Card
          height="450px"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {box.loading ? (
            <Text>Finding your 3box...</Text>
          ) : (
            <Fragment>
              <Field label="profile picture">
                {image[0] ? (
                  <img
                    style={{ width: '100px' }}
                    src={`https://ipfs.infura.io/ipfs/${
                      image[0].contentUrl['/']
                    }`}
                    alt=""
                  />
                ) : (
                  <Text>No image uploaded</Text>
                )}
              </Field>
              <Field label="name">
                <input
                  value={name}
                  onChange={e => updateLocalBox('name', e.target.value)}
                />
              </Field>
              <Field label="school">
                <input
                  value={school}
                  onChange={e => updateLocalBox('school', e.target.value)}
                />
              </Field>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  height: '100%',
                }}
              >
                <div style={{}}>
                  <Button
                    onClick={() => sendToLinkedIn()}
                    style={{ marginBottom: '10px' }}
                    mode="strong"
                  >
                    Update 3Box with LinkedIn
                  </Button>
                  <br />
                  <Button
                    onClick={saveBox}
                    style={{ marginBottom: '10px' }}
                    mode="strong"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Fragment>
          )}
        </Card>
      </Main>
      <Redirect />
    </div>
  );
};

export default App;
