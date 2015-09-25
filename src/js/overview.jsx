var Pictures = require('./pictures.jsx');
var React = require('react');
var $ = require('jquery');

var Overview = React.createClass({
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
      <Pictures pictures={this.state.pictures}></Pictures>
    );
  }
});
module.exports = Overview;
