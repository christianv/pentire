var React = require('react');
var Picture = require('./picture.jsx');
var $ = require('jquery');

var Game = React.createClass({
  getInitialState() {
    return {
      pictures: []
    };
  },
  componentDidMount() {
    let url = 'https://sisteam.herokuapp.com/api/pictures';
    $.get(url, function(result) {
      if (this.isMounted()) {
        this.setState({
          pictures: result.pictures
        });
      }
    }.bind(this));
  },
  render() {
    return (
      <div>Hey</div>
    );
  }
});
module.exports = Game;
