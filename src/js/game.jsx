var React = require('react/addons');

var Finished = require('./finished.jsx');
var Name = require('./name.jsx');
var Picture = require('./picture.jsx');
var Score = require('./score.jsx');

var $ = require('jquery');
var _ = require('lodash');

const GAME_PEOPLE_AMOUNT = 3;

let Game = React.createClass({
  getInitialState() {
    return {
      allNames: [],
      pictures: [],
      currentPicture: {},
      currentIndex: 0,
      finished: false,
      incorrectPeople: [],
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
  nextStep() {

    this.setState(function(previousState) {
      if (previousState.currentIndex === GAME_PEOPLE_AMOUNT - 1) {
        return {
          finished: true
        }
      }
      else {
        var newIndex = previousState.currentIndex + 1;
        return {
          currentIndex: newIndex,
          currentPicture: this.state.pictures[newIndex]
        };
      }
    });
  },
  selectPerson(personName) {
    let isCorrect = (this.state.currentPicture.name === personName);
    if (isCorrect) {
      this.setState(function(previousState) {
        return {
          score: {
            correct: previousState.score.correct + 1,
            incorrect: previousState.score.incorrect
          }
        };
      });
    } else {
      this.setState(function(previousState) {
        return {
          incorrectPeople: this.state.incorrectPeople.concat([this.state.currentPicture]),
          score: {
            correct: previousState.score.correct,
            incorrect: previousState.score.incorrect + 1
          }
        };
      });
    }

    let pictureImage =  document.querySelector('.p-picture-container .p-picture-image', React.findDOMNode(this));
    let addClassname = isCorrect ? 'p-animate-correct' : 'p-animate-incorrect'
    pictureImage.className = pictureImage.className + ' ' + addClassname;

    let onAnimationFinished = () => {
      pictureImage.removeEventListener('animationend', onAnimationFinished);
      this.nextStep();
    };

    pictureImage.addEventListener('animationend', onAnimationFinished);
  },
  reset() {
    this.replaceState(this.getInitialState());
    this.componentDidMount();
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
    var playing;
    if (this.state.finished) {
      playing = (
        <div>
          <Finished incorrectPeople={this.state.incorrectPeople} reset={this.reset} />
        </div>
      )
    } else {
      playing = (
        <div>
          <Picture data={this.state.currentPicture} hideName={true} hideByDefault={true} />
          <Name names={this.state.allNames} selectPerson={this.selectPerson} />
        </div>
      )
    }
    return (
      <div>
        <div className="p-game-container">
          <Score data={this.state.score} />
          {playing}
        </div>
      </div>
    );
  }
});
module.exports = Game;
