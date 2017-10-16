import React from 'react';
const ReactMarkdown = require('react-markdown');

const URL = process.env.NODE_ENV === 'production' ?
  'ec2-35-182-166-200.ca-central-1.compute.amazonaws.com' : 'localhost';

import StoryLoading from './StoryLoading.js';
import InputOptions from './InputOptions.js';
import story_one from '../../seeders/story_one.data.js';
import { formatSen } from "../Utils.js";

class StoryView extends React.Component {
  constructor(props) {
    super(props);
    this.fetchSentences = this.fetchSentences.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.handleEnterSubmit = this.handleEnterSubmit.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.showSentenceDetails = this.showSentenceDetails.bind(this);
    this.state = {
      storyID: 1,
      previewSen: "",
      sentences: null,
      input: "",
      optionsVisible: false
    };
  }

  componentWillMount() {
    this.fetchSentences();
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

    let currentSens = this.state.sentences;
    currentSens.push(newSen);

    this.setState({
      sentences: currentSens,
      input: ""
    });

    this.senInput.value = "";

    this.fetchSentences();
  }

  handleInputChange() {
    this.setState({
      input: this.senInput.value,
      optionsVisible: this.senInput.value.length > 0
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

  showSentenceDetails(sen, hovered) {
    hovered ?
      this.setState({previewSen: `Submitted by ${sen.author} on ${sen.date}`}) :
      this.setState({previewSen: ""});
  }

  render() {
    // console.log(this.state.sentences)

    return (
      <div className="storyWrapper">
        <h1 className="title">{story_one.title}</h1>
        <h2 className="storyAuthor">By <b>{story_one.author}</b></h2>
        <h2 className="sentenceDetail">{this.state.previewSen}</h2>
        <div className="storyDisplay">
          {!this.state.sentences ?
            <StoryLoading/> :
            this.state.sentences.map(
              (sentence, index) => (
                <ReactMarkdown
                  key={index}
                  className="storySen"
                  // containerProps={{
                  //   "data-author": sentence.author,
                  //   "data-date": sentence.date,
                  // }}
                  containerTagName="span"
                  source={formatSen(sentence.content) + "&nbsp;"}
                  disallowedTypes={["Paragraph"]}
                  unwrapDisallowed={true}/>
              )
            )
          }
          <ReactMarkdown
            containerProps={{style: {display: this.state.input ? "inline" : "none"}}}
            className="previewSen"
            containerTagName="span"
            source={this.state.input}
            disallowedTypes={["Paragraph", "HtmlBlock"]}
            unwrapDisallowed={true} />
        </div>
        <div className="storyInput">
          <div className={`mainInput${this.state.sentences ? " inTop" : ""}`}>
            <input
              type="text"
              onChange={this.handleInputChange}
              onKeyDown={this.handleEnterSubmit}
              placeholder="Write your sentence"
              ref={el => this.senInput = el}/>
            <button onClick={this.handleInputSubmit}>Submit</button>
          </div>
          <InputOptions visible={this.state.optionsVisible} format={this.formatInput} />
        </div>
      </div>
    )
  }
}

export default StoryView

