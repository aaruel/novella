import React from 'react';

import ReactMarkdown from 'react-markdown';
import StoryLoading from './StoryLoading.js';
// import { formatSen } from "../Utils.js";

class VoteSen extends React.Component {
  constructor(props) {
    super(props);
    this.handleSentenceVote = this.handleSentenceVote.bind(this);
    this.state = {
      sen: null,
      voted: false
    };
  }

  componentWillMount() {
    this.setState({
      sen: this.props.sentence,
      voted: this.props.sentence.votes > 0
    });
  }

  async handleSentenceVote() {
    let newSen = {...this.state.sen};
    let senVotes = await fetch(`http://${this.props.url}:3000/api/sentenceChange?senid=${this.state.sen.id}&action=${this.state.voted ? "unvote" : "vote"}`);
    senVotes = await senVotes.json();
    newSen.votes = senVotes.votes;

    this.setState({
      sen: newSen,
      voted: !this.state.voted
    });
  }

  render() {
    return (
      this.state.sen ?
        <div className={this.state.voted ? "voteSen voted" : "voteSen"}>
          <blockquote
            className={this.state.voted ? "voted" : null}
            onMouseOver={() => this.props.input(this.state.sen.content, true)}
            onMouseOut={() => this.props.input("", true)}>
            <ReactMarkdown
              containerTagName="span"
              source={this.state.sen.content}
              disallowedTypes={["paragraph"]}
              unwrapDisallowed={true}/>
            <h3 className="attribution">&#8213;{this.state.sen.author}</h3>
            {/*<h3>round: {this.state.sen.round}</h3>*/}
            <h3>votes: {this.state.sen.votes}</h3>
            <div className="animateVoteSen"/>
          </blockquote>
          <div className="voteBtns">
            {/*<i className="fa fa-times" onClick={() => this.props.delete(this.state.sen.id)}/>*/}
            <i className="fa fa-book" onClick={() => this.props.accept(this.state.sen.id)}/>
            <i onClick={this.handleSentenceVote} className="voteBtn fa fa-arrow-up" aria-hidden="true"/>
          </div>
        </div> :
        <StoryLoading />
    )
  }
}

export default VoteSen
