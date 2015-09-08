var React = require('react');

var Name = require('./name.jsx');
var Picture = require('./picture.jsx');
var Score = require('./score.jsx');

var $ = require('jquery');
var _ = require('lodash');

const GAME_PEOPLE_AMOUNT = 20;

let Game = React.createClass({
  getInitialState() {
    return {
      allNames: [],
      pictures: [],
      currentPicture: {},
      currentIndex: 0,
      score: {
        correct: 0,
        incorrect: 0
      }
    };
  },
  getAllNames(pictures) {
    return pictures.map(p => p.name);
  },
  getRandomPictures(pictures) {
    // Lodash's sample method allows us to get random items in an array
    return _.sample(pictures, GAME_PEOPLE_AMOUNT);
  },
  selectNextPerson() {
    this.setState(function(previousState) {
      var newIndex = previousState.currentIndex + 1;
      return {
        currentIndex: newIndex,
        currentPicture: this.state.pictures[newIndex]
      };
    });
  },
  selectPerson(a, b) {
    if (this.state.currentPicture.name === a) {
      this.setState(function(previousState) {
        return {
          score: {
            correct: previousState.score.correct + 1,
            incorrect: previousState.score.incorrect
          }
        };
      });
      console.log('correct!');
    } else {
      this.setState(function(previousState) {
        console.log(previousState.score.incorrect);
        return {
          score: {
            correct: previousState.score.correct,
            incorrect: previousState.score.incorrect + 1
          }
        };
      });
      console.log('incorrect');
    }
    this.selectNextPerson();
  },
  componentDidMount() {
    let url = 'https://sisteam.herokuapp.com/api/pictures';
    $.get(url, function(result) {
      if (this.isMounted()) {
        this.setState({
          allNames: this.getAllNames(result.pictures),
          pictures: this.getRandomPictures(result.pictures)
        });
        this.setState({
          currentPicture: this.state.pictures[0]
        });
      }
    }.bind(this));
  },
  render() {
    return (
      <div>
        <div className="p-game-container">
          <Score data={this.state.score} />
          <Picture data={this.state.currentPicture} hideName={true} />
          <Name names={this.state.allNames} currentPicture={this.state.currentPicture} selectPerson={this.selectPerson} />
        </div>
      </div>
    );
  }
});
module.exports = Game;
