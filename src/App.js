import React, {Fragment} from 'react';
import Helmet from 'react-helmet';
import io from 'socket.io-client/dist/socket.io';

import backendURL from './_data/backend';
const URL = process.env.NODE_ENV === 'production' ? backendURL : 'localhost';
const socket = io.connect(`http://${URL}:3000/`);

import icon from './_assets/favicon.png';

import StoryView from './components/StoryView.js';
import VotingArea from './components/VotingArea.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handlePreviewChange = this.handlePreviewChange.bind(this);
    this.fetchSentences = this.fetchSentences.bind(this);
    this.showOldRound = this.showOldRound.bind(this);
    this.state = {
      loaded: false,
      error: null,
      sentencesID: 1,
      story: null,
      voting: null,
      rejected: null,
      oldStory: null,
      preview: "",
      tempPreview: ""
    };
  }

  componentDidMount() {
    this.fetchSentences("active");
    socket.on('sentence accepted', () => {
      this.fetchSentences("active");
    });
  }

  async fetchSentences(from, round=null) {
    let newSens = null;
    try {
      newSens = await fetch(`http://${URL}:3000/api/querySentences?sid=${this.state.sentencesID}&from=${from}`);
      newSens = await newSens.json();
    }
    catch (err) {
      this.setState({
        error: `Couldn't fetch sentences.`
      });
      socket.destroy();
    }

    if (newSens) {
      if (from === "active" || from === "all") {
        this.setState({
          story: newSens.filter(sen => {
            return sen.inVote === 0;
          }),
          voting: newSens.filter(sen => {
            return sen.inVote === 1;
          }),
          rejected: from === "all" ? newSens.filter(
            sen => {
              return sen.inVote === 2;
            }) : null
        });
      }
      else if (from === "voting") {
        this.setState({
          voting: newSens
        });
      }
      else if (from === "story") {
        this.setState({
          story: newSens
        });
      }
      else if (from === "rejected" && round) {
        this.setState({
          rejected: newSens.filter(sen => {
            return sen.round === round;
          })
        });
      }
    }
  }

  handlePreviewChange(prev, temp=null) {
    if (!temp) {
      this.setState({
        preview: prev
      });
    }
    else {
      this.setState({
        tempPreview: prev
      });
    }
  }

  showOldRound(round) {
    const currentStory = this.state.story;
    const oldStory = currentStory.filter(sen => {return sen.round <= round;});
    this.setState({
      oldStory: oldStory
    });
    this.fetchSentences("rejected", round);
  }

  render() {
    return (
      <Fragment>
        <Helmet
          title="Novella"
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
          ]}
          link={[{ href: icon, rel: 'icon', type: 'image/x-icon' }]}
          script={[{ defer: true, src: 'https://use.fontawesome.com/releases/v5.0.4/js/all.js' }]} />
        <div className="mainWrapper">
          <StoryView
            key="SV1"
            url={URL}
            socket={socket}
            sentences={this.state.oldStory ? this.state.oldStory : this.state.story}
            input={this.handlePreviewChange}
            preview={this.state.tempPreview ? this.state.tempPreview : this.state.preview}
            isTyped={this.state.preview}
            fetch={this.fetchSentences}
            error={this.state.error} />
          {
            this.state.error
              ? null
              : <VotingArea
                key="VA1"
                url={URL}
                socket={socket}
                sentences={this.state.rejected ? this.state.rejected : this.state.voting}
                round={this.state.story ? this.state.story.length : 0}
                input={this.handlePreviewChange}
                fetch={this.fetchSentences} />
          }
        </div>
      </Fragment>
    )
  }
}
