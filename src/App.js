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
        <StoryView key="SV1" />
      //  load story voting area here
      ]
    )
  }
}

export default App
