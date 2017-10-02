import React from 'react';

import StoryView from './components/StoryView.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div >
        <StoryView />
      </div>
    )
  }
}

export default App

