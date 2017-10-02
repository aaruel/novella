import React from 'react';

import story_one from '../../data/story_one.data.js';

class StoryView extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.state = {
          sentences: [],
          input: ""
        };
    }

    componentWillMount() {
      this.setState({
        sentences: story_one.sentences
      });
    }

    handleInputChange(e) {
      this.setState({
        input: e.target.value
      });
    }

    handleInputSubmit() {
      const newSens = this.state.sentences;
      newSens.push(this.state.input);
      this.setState({
        sentences: newSens
      });
    }

    render() {
      return (
        <div className="storyWrapper">
          <div className="storyDisplay">
            <h1 className="title">{story_one.title}</h1>
            <h2 className="storyAuthor">By <b>{story_one.author}</b></h2>
            {this.state.sentences.map(
              (sentence, index) => <span key={index}>{sentence} </span>
            )}
            <span style={{display: this.state.input ? null : "none"}} className="previewSen">{this.state.input}</span>
          </div>
          <div className="storyInput">
            <div>
              <input type="text" onChange={this.handleInputChange}/>
              <button onClick={this.handleInputSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )
    }
}

export default StoryView

