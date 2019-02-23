import React, { useState, Fragment } from 'react';
import Box from '3box';
import { Main, AppBar, Card, Text, Field, Button } from '@aragon/ui';
import './App.css';

import { useMetaMask, use3Box, useLinkedIn } from './hooks';
import { sendToLinkedIn } from './helpers';

const App = () => {
  const [account, setAccount] = useState('');

  useMetaMask(setAccount);

  const [box, setBox] = useState({});

  use3Box(account, box, setBox);

  const updateLocalBox = (field, value) => {
    setBox({ ...box, [field]: value });
  };

  const [auth, setAuth] = useState(false);

  useLinkedIn(auth, setAuth, box, setBox);

  const saveBox = async () => {
    const openedBox = await Box.openBox(account, window.web3.currentProvider);
    await openedBox.public.set('name', box.name);
  };

  return (
    <div className="container">
      <Main>
        <AppBar style={{ marginTop: '60px' }} title="Your Profile">
          {account}
        </AppBar>

        <Card
          height="400px"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {box.loading ? (
            <Text>Finding your 3box...</Text>
          ) : box.hasBox ? (
            <Fragment>
              <Field label="profile picture">
                {box.image ? (
                  <img
                    style={{ width: '100px' }}
                    src={`https://ipfs.infura.io/ipfs/${
                      box.image[0].contentUrl['/']
                    }`}
                    alt=""
                  />
                ) : (
                  <Text>No image uploaded</Text>
                )}
              </Field>
              <Field label="name">
                <input
                  value={box.name || ''}
                  onChange={e => updateLocalBox('name', e.target.value)}
                />
              </Field>
              <Field label="school">
                <input
                  value={box.school || ''}
                  onChange={e => updateLocalBox('school', e.target.value)}
                />
              </Field>
              <Button
                onClick={saveBox}
                style={{ marginBottom: '10px' }}
                mode="strong"
              >
                Save
              </Button>
            </Fragment>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Text style={{ marginTop: '10px' }}>No box</Text>
              <div style={{}}>
                <Button
                  onClick={sendToLinkedIn}
                  style={{ marginBottom: '10px' }}
                  mode="strong"
                >
                  Create a 3Box with LinkedIn
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
          )}
        </Card>
      </Main>
    </div>
  );
};

export default App;
