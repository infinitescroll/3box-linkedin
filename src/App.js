import React, { useState, useEffect, Fragment } from 'react';
import Box from '3box';
import { Main, AppBar, Card, Text, Field, Button } from '@aragon/ui';
import axios from 'axios';
import './App.css';

import { useMetaMask, use3Box } from './hooks';
import { sendToLinkedIn, getData } from './helpers';

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

  const getLinkedIn = async linkedInCode => {
    axios
      .post(`http://localhost:8080/linkedin/auth?code=${linkedInCode}`)
      .then(response => {
        setLocalProfile({
          ...localProfile,
          fetchedLinkedIn: true,
          name: response.data.name,
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    const urlParams = window.location.href.split('=');
    const linkedInCode = urlParams[1];
    if (!localProfile.fetchedLinkedIn && urlParams[0].includes('code')) {
      setLocalProfile({ ...localProfile, fetchedLinkedIn: true });
      getLinkedIn(linkedInCode);
    }
  });

  const saveBox = async () => {
    // @TODO - this needs to be better - check the diff of what changed and only set the changes
    const openedBox = await Box.openBox(account, window.web3.currentProvider);
    const { name, image, school } = getData(localProfile, box);
    console.log(openedBox, name);
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
                    onClick={sendToLinkedIn}
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
    </div>
  );
};

export default App;
