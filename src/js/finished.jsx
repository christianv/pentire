var Pictures = require('./pictures.jsx');
var React = require('react');

module.exports = React.createClass({
  render: function(){
    var finishedMessage;

    if (this.props.incorrectPeople.length) {
      finishedMessage = (
        <div>
          <h3>Don't forget about...</h3>
          <Pictures pictures={this.props.incorrectPeople}></Pictures>
        </div>
      )
    } else {
      finishedMessage = (
        <div>
          <h3>Congrats, you guessed all of them correctly!</h3>
        </div>
      )
    }

    return (
      <div className="p-finished-container">
        <button className="p-finished-button" onClick={this.props.reset}>Reset</button>
        {finishedMessage}
      </div>
    );
  }
});
