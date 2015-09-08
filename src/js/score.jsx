var React = require('react');

var Score = React.createClass({
  render: function(){
    return (
      <div className="p-score-container">
        {this.props.data.correct} out of {this.props.data.correct + this.props.data.incorrect}
      </div>
    );
  }
});

module.exports = Score;
