import React, { PureComponent, Fragment } from 'react';
import { getURLParam } from './helpers';

export default class Redirect extends PureComponent {
  componentDidMount() {
    /**
     * Acting as the redirect target it looks up for 'code' URL param on component mount
     * if it detects the code then sends to the opener window
     * via postMessage with 'popup' as origin and close the window (usually a popup)
     */
    const code = getURLParam('code');

    code &&
      window.opener.postMessage(
        { from: 'popup', name: 'code', value: code },
        '*'
      );

    window.close();
  }

  render() {
    return <Fragment />;
  }
}
