import React from 'react';
import io from 'socket.io-client/dist/socket.io';

// const socket = io();
const URL = process.env.NODE_ENV === 'production' ?
  'ec2-35-182-166-200.ca-central-1.compute.amazonaws.com' : 'localhost';

const socket = io.connect(`http://${URL}:3000`);

import story_one from '~/server/seeders/story_one.data.js';
import StoryDisplay from './StoryDisplay.js';
import InputOptions from './InputOptions.js';

class StoryView extends React.Component {
  constructor(props) {
    super(props);
    this.fetchSentences = this.fetchSentences.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.handleEnterSubmit = this.handleEnterSubmit.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.state = {
      storyDetails: {},
      storyID: 1,
      previewSen: "",
      sentences: null,
      input: ""
    };
  }

  componentWillMount() {
    this.fetchSentences();
    socket.on('new sentence', () => {
      console.log('new sentence');
      this.fetchSentences();
    });
  }

  componentDidMount() {
    this.senInput.focus();
    this.setState({
      storyDetails: story_one
    });
  }

  async fetchSentences() {
    let newSens = await fetch(`http://${URL}:3000/api/queryStorySentences?sid=${this.state.storyID}`);
    newSens = await newSens.json();

    this.setState({
      sentences: newSens
    });
  }

  async handleInputSubmit() {
    let newSen = await fetch(`http://${URL}:3000/api/createSentence?cont=${this.state.input}&uid=1&sid=${this.state.storyID}`);
    newSen = await newSen.json();

    if (newSen.status === -1) {
      alert(newSen.error);
    }
    else {
      let currentSens = this.state.sentences;
      currentSens.push(newSen);

      this.setState({
        sentences: currentSens,
        input: ""
      });

      this.senInput.value = "";

      socket.emit('new sentence');
      this.fetchSentences();
    }
  }

  handleInputChange() {
    this.setState({
      input: this.senInput.value,
    });
  }

  formatInput(l, r) {
    if (this.senInput.selectionEnd - this.senInput.selectionStart > 0) {
      let val = this.senInput.value.toString();
      let SIS = parseInt(this.senInput.selectionStart);
      let SIE = parseInt(this.senInput.selectionEnd);
      let selection = val.substr(SIS, SIE - 1);
      let beforeSelection = val.substr(0, SIS);
      let afterSelection = val.substr(SIE, val.length);
      this.senInput.value = beforeSelection + l + selection + r + afterSelection;
      this.handleInputChange();
    }
  }

  handleEnterSubmit(e) {
    if (e.key === 'Enter') {
      this.handleInputSubmit();
    }
  }

  render() {
    return (
      <div className="storyWrapper">
        <h1 className="title">{this.state.storyDetails.title}</h1>
        <h2 className="storyAuthor">
          By <b>{this.state.storyDetails.author}</b>
        </h2>
        <StoryDisplay
          key="STORYDISP"
          sentences={this.state.sentences}
          input={this.state.input} />
        <div key="STORYIPT" className="storyInput">
          <div className={`mainInput${this.state.sentences ? " inTop" : ""}`}>
            <input
              type="text"
              onChange={this.handleInputChange}
              onKeyDown={this.handleEnterSubmit}
              placeholder="Write your sentence"
              ref={el => this.senInput = el}
              required />
            <button disabled={!this.state.input} onClick={this.handleInputSubmit}>
              {this.state.input
                ? "Submit" : <i className="fa fa-pencil" aria-hidden="true" ><span>...</span></i>}
            </button>
          </div>
          <InputOptions visible={this.state.input} format={this.formatInput} />
        </div>
      </div>
    )
  }
}

export default StoryView

