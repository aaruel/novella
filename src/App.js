import React from 'react';

import StoryView from './components/StoryView.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      [
        <StoryView key="StoryView1"/>
      ]
    )
  }
}

export default App

