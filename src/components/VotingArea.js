import React from 'react';

import StoryLoading from './StoryLoading.js';
import VoteSen from './VoteSen.js';

class VotingArea extends React.Component {
  constructor(props) {
    super(props);
    this.handleSentenceAccept = this.handleSentenceAccept.bind(this);
    this.handleSentenceDelete = this.handleSentenceDelete.bind(this);
    this.state = {
      storyID: 1,
      voteSentences: null
    };
  }

  componentWillMount() {
    this.props.socket.on('new sentence', () => {
      this.props.fetch("voting");
    });
  }

  componentDidMount() {

  }

  async handleSentenceAccept(senid) {
    await fetch(`http://${this.props.url}:3000/api/sentenceChange?senid=${senid}&action=accept`);
    for (let sen of this.props.sentences) {
      if (sen.id !== senid) {
        await fetch(`http://${this.props.url}:3000/api/sentenceChange?senid=${sen.id}&action=reject`);
      }
    }
    this.props.fetch("active");
    this.props.socket.emit('sentence accepted');
  }

  async handleSentenceDelete(senid) {
    await fetch(`http://${this.props.url}:3000/api/sentenceDelete?senid=${senid}`);
    await this.props.fetch("voting");
  }

  render() {
    return (
      <div className="votingWrapper">
        <h1 className="title">Vote on the next sentence:</h1>
        <div className="votingList">
          {this.props.sentences
            ? this.props.sentences.length > 0
              ? this.props.sentences.map(sen => (
                <VoteSen key={`sen${sen.id}`}
                         url={this.props.url}
                         sentence={sen}
                         input={this.props.input}
                         accept={this.handleSentenceAccept}
                         delete={this.handleSentenceDelete} />
              ))
              : <h2>No submissions yet.</h2>
            : <StoryLoading />}
        </div>
      </div>
    )
  }
}

export default VotingArea
