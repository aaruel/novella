import React from 'react';
// import marked from 'react-marked';
const ReactMarkdown = require('react-markdown');

import story_one from '../../data/story_one.data.js';
import { formatSen } from "../Utils.js";

class StoryView extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.handleEnterSubmit = this.handleEnterSubmit.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.showSentenceDetails = this.showSentenceDetails.bind(this);
    this.state = {
      previewSen: "",
      sentences: [],
      input: "",
      optionsVisible: false
    };
  }

  componentWillMount() {
    this.setState({
      sentences: story_one.sentences
    });
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

  handleInputSubmit() {
    const newSens = this.state.sentences;
    const date = new Date();
    const formatDate = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getFullYear()}`;
    let formatInput = formatSen(this.state.input);

    newSens.push(
      {
        content: formatInput,
        author: "Anonymous",
        date: formatDate
      }
    );

    this.setState({
      sentences: newSens,
      input: ""
    });

    this.senInput.value = "";
  }

  handleEnterSubmit(e) {
    if (e.key == 'Enter') {
      this.handleInputSubmit();
    }
  }

  showOptions(state) {
    this.setState({
      optionsVisible: state
    });
  }

  showSentenceDetails(sen, hovered) {
    hovered ?
      this.setState({previewSen: `Submitted by ${sen.author} on ${sen.date}`}) :
      this.setState({previewSen: ""});
  }

  render() {
    return (
      <div className="storyWrapper">
        <h1 className="title">{story_one.title}</h1>
        <h2 className="storyAuthor">By <b>{story_one.author}</b></h2>
        <h2 className="sentenceDetail">{this.state.previewSen}</h2>
        <div className="storyDisplay">
          {this.state.sentences.map(
            (sentence, index) => (
              <ReactMarkdown
                key={index}
                className="storySen"
                containerProps={{
                  "data-author": sentence.author,
                  "data-date": sentence.date,
                }}
                containerTagName="span"
                source={sentence.content + "&nbsp;"}
                disallowedTypes={["Paragraph"]}
                unwrapDisallowed={true} />
            )
          )}
          <ReactMarkdown
            containerProps={{
              style: {display: this.state.input ? "inline" : "none"}
            }}
            className="previewSen"
            containerTagName="span"
            source={this.state.input}
            disallowedTypes={["Paragraph", "HtmlBlock"]}
            unwrapDisallowed={true} />
        </div>
        <div className="storyInput">
          <div className="mainInput">
            <input
              type="text"
              onChange={this.handleInputChange}
              onKeyDown={this.handleEnterSubmit}
              placeholder="Write your sentence"
              ref={el => this.senInput = el}/>
            <button onClick={this.handleInputSubmit}>Submit</button>
          </div>
          <div className={
            `inputOptions${this.state.optionsVisible ? " inTop" : ""}`}>
            <button onClick={() => this.formatInput("**", "**")}>
              <i className="fa fa-bold"/>
            </button>
            <button onClick={() => this.formatInput("*", "*")}>
              <i className="fa fa-italic"/>
            </button>
            <button onClick={() => this.formatInput("`", "`")}>
              <i className="fa fa-code"/>
            </button>
            <button onClick={() => this.formatInput("[", "](* link *)")}>
              <i className="fa fa-link"/>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default StoryView

