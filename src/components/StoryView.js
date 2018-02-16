import React from 'react';

import story_one from '~/server/seeders/story_one.data.js';
import StoryDisplay from './StoryDisplay.js';
import InputOptions from './InputOptions.js';
import { formatSen } from "../Utils.js";

class StoryView extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.handleEnterSubmit = this.handleEnterSubmit.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.state = {
      storyDetails: {},
      storyID: 1,
      previewSen: ""
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.senInput.focus();
    this.setState({
      storyDetails: story_one
    });
  }

  async handleInputSubmit() {
    let newSen = await fetch(
      `http://${this.props.url}:3000/api/createSentence?`
      + `cont=${formatSen(this.props.preview)}`
      + `&invote=1`
      + `&round=${this.props.sentences.length}`
      + `&uid=1`
      + `&sid=${this.state.storyID}`
    );
    newSen = await newSen.json();

    if (newSen.status === -1) {
      alert(newSen.error);
    }
    else {
      this.senInput.value = "";
      this.props.input("");

      this.props.fetch("voting");
      this.props.socket.emit('new sentence');
    }
  }

  handleEnterSubmit(e) {
    if (e.key === 'Enter') {
      this.handleInputSubmit();
    }
  }

  formatInput(l, r) {
    if (this.senInput.selectionEnd - this.senInput.selectionStart > 0) {
      let val = this.senInput.value.toString();
      let SIS = parseInt(this.senInput.selectionStart);
      let SIE = parseInt(this.senInput.selectionEnd);
      let selection = val.substr(SIS, SIE);
      let beforeSelection = val.substr(0, SIS);
      let afterSelection = val.substr(SIE, val.length);
      this.senInput.value = beforeSelection + l + selection + r + afterSelection;
      this.handleInputChange();
    }
  }

  render() {
    return (
      <div className="storyWrapper">
        <h1 className="title">{this.state.storyDetails.title}</h1>
        <h2 className="storyAuthor">By <b>{this.state.storyDetails.author}</b></h2>
        <StoryDisplay
          key="STORYDISP"
          sentences={this.props.sentences ? this.props.sentences : null}
          input={this.props.preview}
          error={this.props.error}/>
        <div key="STORYIPT" className={`storyInput${this.props.sentences ? " inTop" : ""}`}>
          <div className="mainInput">
            <input
              type="text"
              onChange={() => this.props.input(formatSen(this.senInput.value))}
              onKeyDown={this.handleEnterSubmit}
              placeholder="Write your sentence"
              ref={el => this.senInput = el}
              required />
            <button disabled={!this.props.isTyped} onClick={this.handleInputSubmit}>Submit</button>
          </div>
          <InputOptions isTyped={this.props.isTyped} format={this.formatInput} />
        </div>
      </div>
    )
  }
}

export default StoryView

